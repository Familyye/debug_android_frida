# Notes

### Gradle
distributionUrl=https://mirrors.cloud.tencent.com/gradle/gradle-8.2-bin.zip   
maven { url=uri("https://maven.aliyun.com/repository/gradle-plugin")}   
maven { url=uri("https://maven.aliyun.com/repository/google")}   
maven { url=uri("https://maven.aliyun.com/repository/central")}   
maven { url=uri("https://maven.aliyun.com/repository/public")}

### debug   
adb shell setprop persist.debug.dalvik.vm.jdwp.enabled 1
