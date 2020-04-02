import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  AsyncStorage,
  Image,
  Alert,
} from 'react-native';
import {Color} from './common/Color';
import {Size} from './common/Size';
import CImageButton from './component/button/CImageButton';
import RNKakaoLogins from '@react-native-seoul/kakao-login';
import {API} from './common/Api';
import {Keys} from './common/Keys';
import {Actions} from 'react-native-router-flux';
import {CFont} from './common/CFont';
import {
  LoginManager,
  AccessToken,
  ShareDialog,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import CButton from './component/button/CButton';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileImage: '',
      profile: {},
      agreement: false,
      display: false,
    };

    AsyncStorage.getItem(Keys.login).then(value => {
      if (value === 'Y') {
        AsyncStorage.getItem(Keys.userinfo).then(value1 => {
          var result = JSON.parse(value1);
          this.oAuthLogin({
            platform: result.UserType,
            id: result.UserCode,
            name: result.UserName,
            profile: result.UserProfile,
          });
        });
      } else {
        this.setState({
          display: true,
        });
      }
    });
  }

  clickKakaoLogin = () => {
    const {agreement} = this.state;
    if (agreement) {
      RNKakaoLogins.login()
        .then(result => {
          RNKakaoLogins.getProfile((err, result1) => {
            if (err) {
              console.log(err);
              return;
            }
            this.oAuthLogin({
              platform: 'kakao',
              id: result1.id,
              name: result1.nickname,
              profile: result1.profile_image_url,
            });
          });
        })
        .catch(err => {
          if (err.code === 'E_CANCELLED_OPERATION') {
            console.log(err.message);
          } else {
            console.log(err.code);
            console.log(err.message);
          }
        });
    } else {
      Alert.alert(
        '주의사항 동의',
        '주의사항에 동의하셔야 이용하실 수 있습니다.',
      );
    }
  };

  clickFaceBookLogin = () => {
    const {agreement} = this.state;
    if (agreement) {
      LoginManager.logInWithPermissions(['public_profile']).then(
        result => {
          if (result.isCancelled) {
            console.log('Login cancelled');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              //TODO login success process
              this.getPublicProfile();
              // this.oAuthLogin('facebook', data.userID);
            });
          }
        },
        error => {
          //TODO login fail process
          console.log('Login fail with error: ' + error);
        },
      );
    } else {
      Alert.alert(
        '주의사항 동의',
        '주의사항에 동의하셔야 이용하실 수 있습니다.',
      );
    }
  };

  async getPublicProfile() {
    const infoRequest = new GraphRequest(
      '/me?fields=id,name,email,picture',
      null,
      (err, result) => {
        if (err) {
          console.log('Error fetching data: ' + err.toString());
        } else {
          this.oAuthLogin({
            platform: 'facebook',
            id: result.id,
            name: result.name,
            profile: result.picture.data.url,
          });
        }
      },
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  oAuthLogin = param => {
    API.registUser(
      {
        userCode: param.id,
        userType: param.platform,
        userName: param.name,
        userProfile: param.profile,
      },
      res => {
        if (res.result) {
          AsyncStorage.setItem(
            Keys.userinfo,
            JSON.stringify(res.result.userinfo),
          )
            .then(() => {
              AsyncStorage.setItem(Keys.login, 'Y')
                .then(() => {
                  Actions.replace('home_stack');
                })
                .catch(err => {
                  console.error(err);
                });
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          this.setState({
            display: true,
          });
        }
      },
      err => {
        console.log(err);
        this.setState({
          display: true,
        });
      },
    );
  };

  // text?: string;
  //   onPress?: (value?: string) => void;
  //   style?: 'default' | 'cancel' | 'destructive';
  onClickAgree = () => {
    Alert.alert(
      '주의사항',
      '해당 앱은 사진을 업로드, 다운로드, 확인하는 앱으로 데이터의 소비가 큰 서비스입니다. WiFi사용을 권장합니다.',
      [
        {
          text: '취소',
          onPress: () =>
            this.setState({
              agreement: false,
            }),
          style: 'cancel',
        },
        {
          text: '동의',
          onPress: () =>
            this.setState({
              agreement: true,
            }),
        },
      ],
    );
  };

  render() {
    const {agreement, display} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="dark-content" backgroundColor={Color.cffffff} />
        )}
        {display ? (
          <View style={styles.content_frame}>
            <View style={styles.logo_frame}>
              <Image
                style={styles.logo}
                source={require('../assets/images/logo.png')}
              />
            </View>
            <View style={styles.logo_text_frame}>
              <Text style={[CFont.logo, {color: Color.c0a214b}]}>
                Baby Photo
              </Text>
            </View>
            <CImageButton
              style={styles.button_frame}
              backgroundImage={require('../assets/images/Kakao_Login.png')}
              onPress={this.clickKakaoLogin}
            />
            <CImageButton
              style={styles.button_frame}
              backgroundImage={require('../assets/images/Facebook_Login.png')}
              onPress={this.clickFaceBookLogin}
            />
            <View style={styles.check_button_frame}>
              <CButton style={styles.check_button} onPress={this.onClickAgree}>
                <View style={styles.check_button_back}>
                  <View style={styles.check_icon_frame}>
                    <Image
                      style={styles.check_icon}
                      source={
                        agreement
                          ? require('../assets/images/on-check-box-white.png')
                          : require('../assets/images/off-check-box-white.png')
                      }
                    />
                  </View>
                  <View style={styles.check_title_frame}>
                    <Text style={[CFont.subtext2, {color: Color.cffffff}]}>
                      주의사항에 동의하시겠습니까?
                    </Text>
                  </View>
                </View>
              </CButton>
            </View>
          </View>
        ) : (
          <View />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content_frame: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo_frame: {
    height: Size.height(100),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logo_text_frame: {
    height: Size.height(40),
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: Size.height(100),
  },
  logo: {
    height: Size.width(100),
    width: Size.width(100),
  },
  button_frame: {
    height: Size.height(39),
    width: Size.width(265),
    marginTop: Size.height(8),
  },
  check_button_frame: {
    height: Size.height(30),
    width: Size.width(265),
    marginTop: Size.height(11),
  },
  check_button: {
    height: '100%',
    width: '100%',
    borderRadius: Size.height(3),
    backgroundColor: Color.c0a214b,
    flexDirection: 'row',
    alignItems: 'center',
  },
  check_button_back: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  check_icon_frame: {
    marginLeft: Size.width(10),
    marginRight: Size.width(13),
    height: Size.width(20),
    width: Size.width(20),
  },
  check_icon: {
    height: Size.width(20),
    width: Size.width(20),
  },
  check_title_frame: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  nav_frame: {
    height: Size.height(62),
  },
  tab_frame: {
    height: Size.height(60),
  },
});
