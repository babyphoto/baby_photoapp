import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {Size} from '../../common/Size';
import {Color} from '../../common/Color';
import {CFont} from '../../common/CFont';

export default class CNavigation extends React.PureComponent {
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
    const {isBack, children} = this.props;
    return (
      <View style={[styles.container, styles.shadow]}>
        <View style={styles.margin}>
          {isBack ? (
            <View style={styles.back_button_frame}>
              <TouchableOpacity style={styles.touchable}>
                <Image
                  style={styles.back_button_image}
                  source={require('../../../assets/images/back_icon.png')}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
          <View style={styles.title_frame}>
            <Text style={[CFont.title, {color: Color.navtitle}]}>
              {children}
            </Text>
          </View>
          <View style={styles.button_frame}>
            <TouchableOpacity style={styles.touchable}>
              <Image
                style={styles.back_button_image}
                source={require('../../../assets/images/account.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

CNavigation.propTypes = {
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    height: Size.navigationHeight,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: Color.cffffff,
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
  margin: {
    marginLeft: Size.width(19),
    marginRight: Size.width(19.5),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title_frame: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  back_button_frame: {
    height: Size.width(29),
    width: Size.width(29),
    marginRight: Size.width(20),
  },
  back_button_image: {
    height: Size.width(26),
    width: Size.width(20),
  },
  button_frame: {
    height: Size.width(29),
    width: Size.width(29),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Size.width(20),
  },
  button_image: {
    height: Size.width(16),
    width: Size.width(19.5),
  },
  touchable: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
