ex1: 安装应用时签名不匹配

android.content.pm.SigningDetails.hasCertificateInternal ->  return true
or
com.android.server.pm.PackageManagerServiceUtils.verifySignatures ->  return true


at android.content.pm.SigningDetails.hasCertificateInternal(Native Method)
at android.content.pm.SigningDetails.hasCertificate(SigningDetails.java:682)
at android.content.pm.SigningDetails.checkCapability(SigningDetails.java:635)
at com.android.server.pm.PackageManagerServiceUtils.verifySignatures(PackageManagerServiceUtils.java:574)
at com.android.server.pm.InstallPackageHelper.preparePackageLI(InstallPackageHelper.java:1418)
at com.android.server.pm.InstallPackageHelper.installPackagesLI(InstallPackageHelper.java:1000)
at com.android.server.pm.InstallPackageHelper.installPackagesTraced(InstallPackageHelper.java:962)
at com.android.server.pm.InstallingSession.processApkInstallRequests(InstallingSession.java:547)
at com.android.server.pm.InstallingSession.processInstallRequests(InstallingSession.java:536)
at com.android.server.pm.InstallingSession.lambda$processPendingInstall$0(InstallingSession.java:295)
at com.android.server.pm.InstallingSession.$r8$lambda$tqRjKCgCJYNNnnY7Qw5M5BHLup8(InstallingSession.java:0)
at com.android.server.pm.InstallingSession$$ExternalSyntheticLambda2.run(R8$$SyntheticClass:0)

