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
import * as Progress from 'react-native-progress';
import {CFont} from '../common/CFont';
import CButton from '../component/button/CButton';
import firebase from 'react-native-firebase';

export default class CProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      group_text: '',
    };
  }

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
    const {isVisible, data, adShowFunc} = this.props;
    var oneMb = 1048576;

    const Banner = firebase.admob.Banner;
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();

    const unitId = 'ca-app-pub-7452031807230982/3626491189';

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={this.close}>
        <TouchableWithoutFeedback onLayout={layout => {}} onPress={this.close}>
          <View transparent={true} style={styles.container}>
            <View style={styles.banner}>
              <Banner
                unitId={unitId}
                size={'SMART_BANNER'}
                request={request.build()}
                onAdLoaded={() => {}}
              />
            </View>
            <TouchableHighlight
              activeOpacity={1}
              style={[styles.popup_back, styles.shadow]}>
              <View style={styles.content}>
                <View style={styles.title_frame}>
                  <Text style={[CFont.body2, {color: Color.c0a214b}]}>
                    업로드중...
                    <Text style={[CFont.subtext2, {color: Color.c0a214b}]}>
                      {Math.round(data.loaded / oneMb) !==
                      Math.round(data.total / oneMb)
                        ? '(' +
                          Math.round(data.loaded / oneMb) +
                          'mb / ' +
                          Math.round(data.total / oneMb) +
                          'mb)'
                        : '저장중...'}
                    </Text>
                  </Text>
                </View>
                <View style={styles.input_frame}>
                  <Progress.Bar
                    progress={data.per / 100}
                    width={300}
                    height={10}
                  />
                </View>
                <View style={styles.warning_frame}>
                  <Text style={[CFont.small_bold_text, {color: Color.cf24444}]}>
                    업로드중 종료시 사진이 정상적으로 업로드되지 않습니다.
                  </Text>
                </View>
                <View style={styles.button_frame}>
                  <CButton style={styles.button} onPress={adShowFunc}>
                    <View style={styles.button_back}>
                      <Text style={[CFont.body2, {color: Color.c0a887b}]}>
                        업로드동안 광고보기
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

CProgress.propTypes = {
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
    position: 'relative',
  },
  touchable: {
    height: '100%',
    width: '100%',
  },
  popup_back: {
    backgroundColor: Color.cffffff,
    minHeight: Size.height(120),
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
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
    height: Size.height(20),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning_frame: {
    height: Size.height(15),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input_frame: {
    marginTop: Size.height(10),
    marginRight: Size.width(24),
    marginLeft: Size.width(24),
    height: Size.height(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_frame: {
    height: Size.height(40),
    marginTop: Size.height(10),
    marginRight: Size.width(11),
    marginLeft: Size.width(11),
    flexDirection: 'column',
    alignItems: 'center',
  },
  button_back: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  button: {
    height: Size.height(30),
    marginLeft: Size.width(8),
  },
  banner: {
    marginBottom: Size.height(5),
  },
});
