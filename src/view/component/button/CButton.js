import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

export default class CButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressButton = () => {
    const {onPress, index, data} = this.props;
    if (onPress != null) {
      onPress(index, data);
    }
  };

  render() {
    const {style, children, disable} = this.props;
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          activeOpacity={disable ? 1 : 0.2}
          style={styles.touchable}
          onPress={disable ? () => {} : this.onPressButton}>
          {children}
        </TouchableOpacity>
      </View>
    );
  }
}

CButton.propTypes = {
  onPress: PropTypes.func,
  data: PropTypes.object,
  disable: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  touchable: {
    height: '100%',
    width: '100%',
  },
});
