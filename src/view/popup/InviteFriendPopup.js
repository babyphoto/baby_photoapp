import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
  Text,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import {Color} from '../common/Color';
import {Size} from '../common/Size';
import {CFont} from '../common/CFont';
import CTextField from '../component/textfleid/CTextField';
import CButton from '../component/button/CButton';
import {API} from '../common/Api';

export default class InviteFriendPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      friend_id: '',
    };
  }

  close = () => {
    const {onClose} = this.props;
    this.setState({
      friend_id: '',
    });
    if (onClose) {
      onClose();
    }
  };

  confirm = () => {
    const {friend_id} = this.state;
    const {profileFunc} = this.props;

    API.userSearch(
      {
        userNickName: friend_id,
      },
      res => {
        if (res.result) {
          var userInfo = res.result.userInfo;
          if (userInfo === null) {
            alert('존재하지 않는 ID입니다.');
          } else {
            if (profileFunc) {
              this.close();
              profileFunc(userInfo);
            }
          }
        }
      },
    );
  };

  onChangeText = text => {
    this.setState({
      friend_id: text,
    });
  };

  render() {
    const {friend_id} = this.state;
    const {isVisible} = this.props;
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
                <View style={styles.title_frame}>
                  <Text style={[CFont.body2, {color: Color.navtitle}]}>
                    친구추가
                  </Text>
                </View>
                <View style={styles.input_frame}>
                  <CTextField
                    initText={friend_id}
                    onChangeText={this.onChangeText}
                  />
                </View>
                <View style={styles.button_frame}>
                  <CButton style={styles.button} onPress={this.close}>
                    <View style={styles.button_back}>
                      <Text style={[CFont.body2, {color: Color.cf24444}]}>
                        취소
                      </Text>
                    </View>
                  </CButton>
                  <CButton style={styles.button} onPress={this.confirm}>
                    <View style={styles.button_back}>
                      <Text style={[CFont.body2, {color: Color.c0a214b}]}>
                        확인
                      </Text>
                    </View>
                  </CButton>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

InviteFriendPopup.propTypes = {
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
    minHeight: Size.height(160),
    width: '90%',
    flexDirection: 'column',
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
    justifyContent: 'center',
  },
  title_frame: {
    marginRight: Size.width(24),
    marginLeft: Size.width(24),
    height: Size.height(60),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input_frame: {
    marginRight: Size.width(24),
    marginLeft: Size.width(24),
    height: Size.height(50),
  },
  button_frame: {
    height: Size.height(52),
    flexDirection: 'row',
    marginRight: Size.width(11),
    marginLeft: Size.width(11),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button_back: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: Size.height(36),
    width: Size.width(74),
    marginLeft: Size.width(8),
  },
});
