import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';

export default class CImageButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressButton = () => {
    const {onPress, index} = this.props;
    if (onPress != null) {
      onPress(index);
    }
  };

  render() {
    const {style, backgroundImage} = this.props;
    return (
      <View style={[style]}>
        <TouchableOpacity style={styles.touchable} onPress={this.onPressButton}>
          <ImageBackground source={backgroundImage} style={styles.container} />
        </TouchableOpacity>
      </View>
    );
  }
}

CImageButton.propTypes = {
  onPress: PropTypes.func,
  backgroundImage: PropTypes.number,
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
