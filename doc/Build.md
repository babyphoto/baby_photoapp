```
명령어(프로젝트 폴더)
IOS
react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios

ANDROID
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/build/intermediates/assets/release/index.android.bundle --assets-dest ./android/app/build/intermediates/res/merged/release
```