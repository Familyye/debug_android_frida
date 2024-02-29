# frida_hook

//  {className: "okhttp3.internal.connection.e", methodName: 'q'},
//        at okhttp3.internal.http.g.a(RealInterceptorChain.kt:163)
//         at okhttp3.internal.http.j.a(RetryAndFollowUpInterceptor.kt:35)
//         at okhttp3.internal.http.g.a(RealInterceptorChain.kt:163)
//         at okhttp3.internal.connection.e.q(RealCall.kt:118)
//         at okhttp3.internal.connection.e$a.run(RealCall.kt:34)
//         at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1137)
//         at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:637)
//         at java.lang.Thread.run(Thread.java:1012)

// 多类多方法 (hooks数组)

//指南
// 客户端：
// 1 安装Python 3
// 2 Frida安装 pip install frida -i https://pypi.mirrors.ustc.edu.cn/simple/  pip install frida-tools -i https://pypi.mirrors.ustc.edu.cn/simple/
// 3 安装vscode，配置vscode语言中文简体。打开"vscode" , 按快捷键"Ctrl+Shift+P"，
// 在顶部搜索框中输入"configure language" 安装nodejs，新建一个文件夹，在目录下执行下面这条命令 npm i @types/frida-gum


// 服务端：
// adb root
// adb push E:/dev/FridaHookJS/frida-server-16.1.4 /data/local/tmp/
// adb shell "chmod 755 /data/local/tmp/frida-server-16.1.4"
// adb device
// adb shell "/data/local/tmp/frida-server-16.1.4 &"

// 使用：
// frida -U  设置 -l E:/dev/FridaHookJS/hook.js  or  frida -U  -f com.android.settings -l E:/dev/FridaHookJS/hook.js

distributionUrl=https://mirrors.cloud.tencent.com/gradle/gradle-8.2-bin.zip
maven { url=uri("https://maven.aliyun.com/repository/gradle-plugin")}
maven { url=uri("https://maven.aliyun.com/repository/google")}
maven { url=uri("https://maven.aliyun.com/repository/central")}
maven { url=uri("https://maven.aliyun.com/repository/public")}
