import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import {Color} from '../common/Color';

export default class CreateGroupPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  close = () => {
    const {onClose} = this.props;
    if (onClose) {
      onClose();
    }
  };

  render() {
    const {isVisible} = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={this.close}>
        <TouchableWithoutFeedback onLayout={layout => {}} onPress={this.close}>
          <View transparent={true} style={styles.container}>
            <TouchableHighlight activeOpacity={1} style={styles.alert_frame}>
              <View />
            </TouchableHighlight>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

CreateGroupPopup.propTypes = {
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
});
