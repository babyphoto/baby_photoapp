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
import CButton from '../component/button/CButton';

export default class Confirm extends React.PureComponent {
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
    const {isVisible, title, context} = this.props;
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
                    {title}
                  </Text>
                </View>
                <View style={styles.input_frame}>
                  <Text style={[CFont.subtext, {color: Color.navtitle}]}>
                    {context}
                  </Text>
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

Confirm.propTypes = {
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
    minHeight: Size.height(100),
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
    flexDirection: 'column',
    justifyContent: 'center',
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
