
/**
 * Some frequently used classes, get instance:cls.$new()
 * */
const Thread = Java.use("java.lang.Thread")
const Log = Java.use("android.util.Log")
const Binder = Java.use('android.os.Binder')
const Exception = Java.use("java.lang.Exception")
const String = Java.use("java.lang.String")
const Modifier = Java.use("java.lang.reflect.Modifier")



//打印堆栈
function printStackTrace(retraction = "", methodName = "") {
    let bt = Log.getStackTraceString(Exception.$new("调用栈:->" + methodName));
    console.log(retraction, bt);
}

//打印对象属性值 或 调用对象的方法
function printObj(obj, filter) {
    if (obj == null) {
        console.log("obj is null ? " + obj)
        return
    }
    for (let key in obj) {
        // console.log(key)
        if (!key.startsWith("$")) {
            if (filter === key) {
                if (typeof obj[key] == "function") {
                    console.log("call ", key + "() return: ", obj[key]())
                } else if (typeof obj[key] == "object") {
                    console.log("field is", key, obj[key].value, getType(obj[key].value))
                }
            } else if (filter === undefined) {
                if (typeof obj[key] == "object") {
                    console.log("field is", key, obj[key].value, getType(obj[key].value))
                }
            }
        }
    }
}

function getUid() {
    return Binder.getCallingUid()
}

function getPid() {
    return Binder.getCallingPid()
}

//列表转string
function list2String(list) {
    let str = "Size=" + list.size() + " [";
    for (let i = 0; i < list.size(); i++) {
        let o = list.get(i);
        if (i === list.size() - 1) {
            str += o
        } else {
            str += o + ","
        }
    }
    str += "]";
    return str
}

function formatDate() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const second = date.getSeconds() < 10 ? ' 0 ' + date.getSeconds() : date.getSeconds()
    const milliSeconds = date.getMilliseconds() //毫秒
    const currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + milliSeconds
    return currentTime
}

function getStackTrace() {
    return Thread.currentThread().getStackTrace();
}

function getType(obj) {
    let type = typeof obj
    if (type === "object" && obj !== null) {
        return obj.$className
    }
    return type
}

function getListType(list) {
    console.log("ss ", list[0].className)
    let str = ""
    for (let i = 0; i < list.length; i++) {
        str += getType(list[i]) + ","
    }
    return str
}

function sleep(time) {
    Thread.sleep(time)
}


/* ------------------------ util  ----------------------------- */


let TracingCount = 0;
const NOT_CALL = "NOT_CALL"
// step 1
function traceClass(className, methodName, parameters) {
    const hook = Java.use(className);
    const methods = hook.class.getDeclaredMethods();
    hook.$dispose;


    if (methodName === undefined || methodName === "") {
        // hook所有方法
        methods.forEach(function (arg) {
            if (!arg.getName().startsWith("$")) {
                traceMethod(className + "." + arg.getName(), parameters, arg);
            }
        });
    } else if (methodName === "$init") {
        //构造函数
        traceMethod(className + ".$init", parameters, null);
    } else {
        // hook多个方法，用 || 分割
        methods.forEach(function (arg) {
            //非$开头的方法  和  * 通配包含的方法
            let foundMethod;
            if (methodName.indexOf("*") === -1) {
                foundMethod = arg.getName() === methodName
            } else {
                foundMethod = arg.getName().indexOf(methodName.replace("*", "") !== -1) !== -1
            }
            if ((!arg.getName().startsWith("$")) && foundMethod) {
                if (!parameters || parameters.length === arg.getParameterCount()) {
                    traceMethod(className + "." + arg.getName(), parameters, arg);
                }
            }
        });
    }
}

// step 2
function traceMethod(targetClassMethod, parameters, method) {
    let i;
    const delim = targetClassMethod.lastIndexOf(".");
    if (delim === -1) return;

    const targetClass = targetClassMethod.slice(0, delim);
    const targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length);

    const hook = Java.use(targetClass);

    let overloadCount = hook[targetMethod].overloads.length;

    let MethodDesc = {};
    if (method) {
        MethodDesc.isStatic = Modifier.isStatic(method.getModifiers())
        // MethodDesc.parameterCount = method.getParameterCount()
        // MethodDesc.parameterTypes = method.getGenericParameterTypes()
    }

    if (parameters) {
        realHook(hook, targetMethod, targetClass, -1, targetClassMethod, MethodDesc, parameters)
        console.log("\x1B[35mTracing " + targetClassMethod + " [" + parameters + "] " + MethodDesc.isStatic, ++TracingCount);
    } else {
        for (i = 0; i < overloadCount; i++) {
            realHook(hook, targetMethod, targetClass, i, targetClassMethod, MethodDesc, undefined)
        }
        console.log("\x1B[35mTracing " + targetClassMethod + " [" + overloadCount + " overload(s)] " + MethodDesc.isStatic, ++TracingCount);
    }
}

// step 3
function realHook(hook, targetMethod, targetClass, i, targetClassMethod, MethodDesc, parameters) {
    let func = function () {
        // console.log()
        let retraction = "    ";
        const stackTraces = getStackTrace()
        for (let i = 2; i < stackTraces.length; i++) {
            var stack = stackTraces[i];
            if ((stack.getClassName()) === targetClass) {
                retraction += "  "
            }
        }

        const showLog = showLogIfNeed(this, targetClassMethod, targetClass, arguments, retraction, Thread.currentThread().getName());
        if (showLog) {
            let hashCode;
            if (MethodDesc.isStatic) {
                hashCode = '***Static***'
            } else {
                hashCode = this.hashCode()
            }
            console.log(retraction, "\x1B[32m[" + targetMethod + "](agrs=" + arguments.length + ")",
                Thread.currentThread().getName(),
                getType(this),
                hashCode);

            if (detailedLog()) {
                for (var j = 0; j < arguments.length; j++) {
                    console.log(retraction, "\x1B[37m" + "arg[" + j + "]: " + arguments[j], getType(arguments[j]));
                }
            }
        }
        var obj = this;
        if (MethodDesc.isStatic) {
            obj = null
        }
        const agrs = onMethodEnter(obj, targetClassMethod, targetClass, arguments, retraction, showLog);

        const startTime = new Date().getTime()
        const callTime = formatDate();
        let retrieval;
        if (agrs !== NOT_CALL) {
            if (MethodDesc.isStatic) {
                let clazz = Java.use(targetClass);
                retrieval = clazz[targetMethod].apply(clazz, agrs);
            } else {
                retrieval = this[targetMethod].apply(this, agrs);
            }
        }

        var showRet = ""
        if (detailedLog()) {
            showRet = retrieval
        }

        if (showLog) {
            console.warn(retraction,
                "\x1B[30m[" + targetMethod + "](agrs=" + arguments.length + ")",
                "\x1B[34mreturn: " + showRet,
                "\x1B[30mclass: " + getType(showRet),
                callTime,
                // formatDate(),
                " Took time :" + (new Date().getTime() - startTime) + "ms");
        }
        return onMethodExit(this, targetClassMethod, targetClass, arguments, retrieval, retraction, showLog);
    }

    if (parameters) {
        hook[targetMethod].overload(...parameters).implementation = func
    } else {
        hook[targetMethod].overloads[i].implementation = func
    }
}

function detailedLog() {
    return true
}

function showLogIfNeed(obj, methodName, targetClass, args, retraction, threadName) {

    return true;
}

function onMethodEnter(obj, methodName, targetClass, args, retraction, showLog) {
    if (showLog) {
        // console.log(retraction, obj.mPreferenceKey.value)
        // printStackTrace()
    }
    return args

}

function onMethodExit(obj, methodName, targetClass, args, ret, retraction, showLog) {
    if (showLog) {

        // printStackTrace()
        // printObj(ret)
        // console.log(retraction,getType(ret))
    }
    return ret
}

/**
 * className: The full class name that needs to be hooked,such as: java.util.ArrayList
 * methodName: Method name that needs to be hooked, such as: add,If undefined, hook all methods
 * parameters: String array,The parameter type of the method that needs to be hooked,
 * If undefined, hook all overridden methods
 * */
Java.perform(
    function () {
        console.log()
        const hooks = [
            {
                className: "java.util.ArrayList",
                methodName: 'add',
                parameters: ['java.lang.Object', '[Ljava.lang.Object;', 'int']
            }
        ];

        hooks.forEach(function (obj) {
            traceClass(obj.className, obj.methodName, obj.parameters)
        })
        console.log("\x1B[31mTracking methods," + TracingCount);
    }
);
