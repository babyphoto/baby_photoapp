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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {Color} from '../common/Color';
import {Size} from '../common/Size';

export default class Loading extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      people_text: '',
      groupUserList: [],
      userList: [],
    };
  }

  componentDidMount() {}

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
    const {isVisible} = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={this.close}>
        <TouchableWithoutFeedback>
          <View transparent={true} style={styles.back_view}>
            <ScrollView style={styles.back_scroll}>
              <View style={styles.container}>
                <ActivityIndicator size={60} color={Color.cba74e8} />
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

Loading.propTypes = {
  onPress: PropTypes.func,
  data: PropTypes.object,
  disable: PropTypes.bool,
};

const styles = StyleSheet.create({
  back_view: {
    flex: 1,
    backgroundColor: Color.modal,
    flexDirection: 'column',
  },
  back_scroll: {
    flex: 1,
  },
  container: {
    height: Size.viewHeight - Size.StatusBarHeight,
    width: Size.viewWidth,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    height: '100%',
    width: '100%',
  },
  popup_back: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    margin: 10,
  },
});
