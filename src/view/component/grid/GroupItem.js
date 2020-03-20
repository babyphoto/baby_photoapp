import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import PropTypes from 'prop-types';
import {Size} from '../../common/Size';
import {Color} from '../../common/Color';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CFont} from '../../common/CFont';

export default class GroupItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {groupInfo} = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.margin, styles.shadow]}>
          <TouchableOpacity style={styles.touchable}>
            <View style={styles.photo}>
              <Image
                style={styles.photo}
                source={{
                  uri:
                    'https://k.kakaocdn.net/dn/dkqNJQ/btqCOzx45CQ/FfHGU432QWW7Qy7wudNHzK/img_640x640.jpg',
                }}
              />
            </View>
            <View style={styles.title_frame}>
              <Text
                style={[CFont.body2, {color: Color.cffffff}]}
                numberOfLines={1}
                lineBreakMode="tail">
                {groupInfo.GroupName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

GroupItem.propTypes = {
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    height: Size.height(174),
    flex: 1,
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
  margin: {
    margin: Size.width(10),
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Color.ce2faf8,
    borderRadius: Size.height(15),
    overflow: 'hidden',
  },
  touchable: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    position: 'relative',
  },
  photo: {
    flex: 1,
    flexDirection: 'column',
  },
  title_frame: {
    height: Size.height(48),
    width: '100%',
    backgroundColor: Color.groupItemSubTitleBack,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 99,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: Size.width(15),
    paddingRight: Size.width(15),
  },
});
