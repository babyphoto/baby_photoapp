```
// 명령어 모음 https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli
npm install -g appcenter-cli

npm install --save react-native-code-push

appcenter login

appcenter apps create -d MyApp-Android -o Android -p React-Native
appcenter apps create -d MyApp-iOS -o iOS -p React-Native

appcenter codepush deployment add -a <ownerName>/<appName> Staging
appcenter codepush deployment add -a <ownerName>/<appName> Production
```

```
앱정보

App Secret:            534ffc0c-48fa-4b31-b057-53ed8558e2af
Description:
Display Name:          babyphoto-android
Name:                  babyphoto-android
OS:                    Android
Platform:              React-Native
Release Type:
Owner ID:              261b7e06-1817-4b57-9069-fe6542564653
Owner Display Name:    이성근
Owner Email:           sherwher@sherwher.org
Owner Name:            sherwher-sherwher.org
Azure Subscription ID:

Android
Staging : sNdT_VCp_P6obFcW9tnKYD6z0rJZs7HroIU8j
Production : yjDPot6gFr1RabOc9mjdLuOLKRSGaLg5tDTt2
```