import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  AsyncStorage,
} from 'react-native';
import {Color} from './common/Color';
import {Size} from './common/Size';
import CImageButton from './component/button/CImageButton';
import RNKakaoLogins from '@react-native-seoul/kakao-login';
import {API} from './common/Api';
import {Keys} from './common/Keys';
import {Actions} from 'react-native-router-flux';
export default class Login extends React.Component {
  constructor(props) {
    super(props);
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
                  Actions.home_stack();
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
          <CImageButton
            style={styles.button_frame}
            backgroundImage={require('../assets/images/Kakao_Login.png')}
            onPress={this.clickKakaoLogin}
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
  button_frame: {
    height: Size.height(39),
    width: Size.width(265),
    marginBottom: Size.height(3.9),
  },
  nav_frame: {
    height: Size.height(62),
  },
  tab_frame: {
    height: Size.height(60),
  },
});
