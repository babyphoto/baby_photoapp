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

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileImage: '',
      profile: {},
    };

    AsyncStorage.getItem(Keys.login).then(value => {
      if (value === 'Y') {
        Actions.replace('home_stack');
      }
    });
  }

  clickKakaoLogin = () => {
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
  };

  clickFaceBookLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      result => {
        console.log(result);
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            //TODO login success process
            console.log(data);
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
  };

  async getPublicProfile() {
    const infoRequest = new GraphRequest(
      '/me?fields=id,name,email,picture',
      null,
      (err, result) => {
        if (err) {
          console.log('Error fetching data: ' + err.toString());
        } else {
          console.log(result);
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
        }
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="dark-content" backgroundColor={Color.cffffff} />
        )}
        <View style={styles.content_frame}>
          <View style={styles.logo_frame}>
            <Image
              style={styles.logo}
              source={require('../assets/images/logo.png')}
            />
          </View>
          <View style={styles.logo_text_frame}>
            <Text style={[CFont.logo, {color: Color.c0a214b}]}>Baby Photo</Text>
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
        </View>
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
  nav_frame: {
    height: Size.height(62),
  },
  tab_frame: {
    height: Size.height(60),
  },
});
