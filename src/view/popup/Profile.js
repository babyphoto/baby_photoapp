import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  Image,
  Clipboard,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {Color} from '../common/Color';
import {Size} from '../common/Size';
import {CFont} from '../common/CFont';
import CButton from '../component/button/CButton';
import {Util} from '../common/Util';
import {API} from '../common/Api';
import {Strings} from '../common/Strings';

export default class Profile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      group_text: '',
      ableInvite: false,
    };

    if (props.isInvite) {
      this.callGroupList(props.groupInfo.GroupNum);
    }
  }

  callGroupList = groupNum => {
    const {userInfo} = this.props;
    API.groupUserList(
      {
        groupNum: groupNum,
      },
      res => {
        if (res.result) {
          if (res.result.userList.length > 0) {
            var able = true;
            res.result.userList.map((val, index) => {
              if (val.UserNum === userInfo.UserNum) {
                able = false;
              }
            });
            this.setState({
              ableInvite: able,
            });
          } else {
            this.setState({
              ableInvite: true,
            });
          }
        }
      },
    );
  };

  close = () => {
    const {onClose} = this.props;
    if (onClose) {
      onClose();
    }
  };

  confirm = () => {
    const {onConfirm} = this.props;
    if (onConfirm) {
      onConfirm();
    }
  };

  render() {
    const {ableInvite} = this.state;
    const {isVisible, userInfo, isInvite, buttonCallback} = this.props;
    var profile = userInfo.UserProfile
      ? {uri: userInfo.UserProfile}
      : require('../../assets/images/account.png');
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={this.close}>
        <TouchableWithoutFeedback onLayout={layout => {}} onPress={this.close}>
          <View transparent={true} style={styles.container}>
            <TouchableHighlight
              activeOpacity={1}
              style={[styles.popup_back, styles.shadow]}>
              <View style={styles.content}>
                <View style={styles.profile_image_frame}>
                  <Image style={styles.profile_image} source={profile} />
                </View>
                <View style={styles.profile_name_frame}>
                  <Text style={[CFont.body2, {color: Color.c0a214b}]}>
                    {userInfo.UserName}
                  </Text>
                </View>
                <View style={styles.text_frame}>
                  <TouchableOpacity
                    style={styles.text_frame}
                    onPress={() => {
                      Clipboard.setString(userInfo.UserNickName);
                      ToastAndroid.show('복사되었습니다.', 2000);
                    }}>
                    <Text style={[CFont.body2, {color: Color.c0a214b}]}>
                      ID : {userInfo.UserNickName}
                    </Text>
                    <Image
                      source={require('../../assets/images/copy.png')}
                      style={styles.copy_icon_frame}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.text_frame}>
                  <Text style={[CFont.subtext2, {color: Color.c0a214b}]}>
                    등록일 :{' '}
                    {Util.stringToDateString(
                      userInfo.UserRegDtm,
                      'YYYYMMDDHHmmss',
                    )}
                  </Text>
                </View>
                <View style={styles.button_frame}>
                  <CButton
                    onPress={() => {
                      buttonCallback(userInfo);
                    }}
                    disable={ableInvite ? !ableInvite : false}>
                    <View style={styles.button}>
                      <Text
                        style={[
                          CFont.body2,
                          {
                            color: (ableInvite
                            ? ableInvite
                            : true)
                              ? Color.c30d9c8
                              : Color.cdedede,
                          },
                        ]}>
                        {isInvite ? '초대하기' : '로그아웃'}
                      </Text>
                    </View>
                  </CButton>
                </View>
                <View style={styles.app_version_frame}>
                  <Text style={[CFont.small_bold_text, {color: Color.cba74e8}]}>
                    {isInvite ? '' : Strings.version}
                  </Text>
                </View>
                <View style={styles.back_frame}>
                  <TouchableHighlight
                    style={styles.back_touch}
                    onPress={this.close}>
                    <Image
                      style={styles.back_touch}
                      source={require('../../assets/images/close.png')}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

Profile.propTypes = {
  onPress: PropTypes.func,
  data: PropTypes.object,
  disable: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.modal,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    height: '100%',
    width: '100%',
  },
  popup_back: {
    backgroundColor: Color.cffffff,
    minHeight: Size.height(280),
    width: '70%',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  },
  shadow: {
    shadowColor: Color.shadows,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  content: {
    flexDirection: 'column',
  },
  profile_image_frame: {
    height: Size.height(110),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile_image: {
    height: Size.width(100),
    width: Size.width(100),
    borderRadius: Size.width(50),
  },
  profile_name_frame: {
    height: Size.height(30),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_frame: {
    height: Size.height(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Size.width(30),
    marginRight: Size.width(30),
  },
  copy_icon_frame: {
    marginLeft: Size.width(8),
    height: Size.width(18),
    width: Size.width(12),
  },
  button_frame: {
    height: Size.height(40),
  },
  button: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  app_version_frame: {
    height: Size.height(20),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  back_frame: {
    height: Size.width(30),
    width: Size.width(30),
    position: 'absolute',
    top: -12,
    right: 5,
  },
  back_touch: {
    height: '100%',
    width: '100%',
  },
});
