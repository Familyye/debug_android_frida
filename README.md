
## Guidelines
android调试工具，可实现
1 输出需调试方法的参数、返回值
2 修改调试方法返回值
3 输出调试方法堆栈
4 跳过指定方法不执行
5 ...

### Client：  
1 安装Python 3  
2 Frida安装 pip install frida -i https://pypi.mirrors.ustc.edu.cn/simple/  pip install frida-tools -i https://pypi.mirrors.ustc.edu.cn/simple/  
3 配置代码编辑器，推荐webstorm代码编辑器，
如安装vscode，配置vscode语言中文简体。打开"vscode" , 
按快捷键"Ctrl+Shift+P"， 
在顶部搜索框中输入"configure language" 安装nodejs，
新建一个文件夹，在目录下执行下面这条命令 npm i @types/frida-gum  

### Server：
    adb root  
    adb push E:/dev/debug_android_frida/server/frida-server-16.1.4 /data/local/tmp/  
    adb shell "chmod 755 /data/local/tmp/frida-server-16.1.4"  
    adb device  
    adb shell "/data/local/tmp/frida-server-16.1.4 &"  

### Run：
    frida -U  设置 -l E:/dev/debug_android_frida/debug_android.js   
    frida -U  -f com.android.settings -l E:/dev/debug_android_frida/debug_android.js

# frida releases
https://github.com/frida/frida/releases
