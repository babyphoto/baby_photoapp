import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Size} from '../../common/Size';
import {Color} from '../../common/Color';
import {CFont} from '../../common/CFont';
import {API} from '../../common/Api';
import {Util} from '../../common/Util';
import FastImage from 'react-native-fast-image';

export default class GroupItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPress = () => {
    const {onPress, groupInfo} = this.props;
    if (onPress) {
      onPress(groupInfo, groupInfo.GroupName);
    }
  };

  onLongPress = () => {
    const {onLongPress, groupInfo} = this.props;
    if (onLongPress) {
      onLongPress(groupInfo);
    }
  };

  render() {
    const {groupInfo} = this.props;
    var isEmptyFile = groupInfo.GroupFileCount === 0;
    var fileName = groupInfo.FilePath;
    console.log(groupInfo);
    if (Util.isVideo(groupInfo.FilePath)) {
      var fileExtention = String(groupInfo.FilePath.split(/[. ]+/).pop());
      fileName = String(groupInfo.FilePath).replace(fileExtention, 'jpg');
    }
    console.log(fileName);
    return (
      <View style={styles.container}>
        <View style={[styles.margin, styles.shadow]}>
          <TouchableOpacity
            disabled={false}
            style={styles.touchable}
            onPress={this.onPress}
            onLongPress={this.onLongPress}>
            {isEmptyFile ? (
              <View style={styles.empty_frame}>
                <Image
                  style={styles.empty_image}
                  source={require('../../../assets/images/empty_image.png')}
                />
              </View>
            ) : (
              <View style={styles.photo_frame}>
                <FastImage
                  style={styles.photo}
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri: API.downloadURL + fileName,
                  }}
                />
              </View>
            )}
            <View style={styles.title_frame}>
              <Text
                style={[CFont.body2, {color: Color.cffffff}]}
                numberOfLines={1}
                lineBreakMode="tail">
                {groupInfo.GroupName}
              </Text>
            </View>
            <View style={styles.file_frame}>
              <View style={styles.small_icon_frame}>
                <Image
                  style={styles.small_icon}
                  source={require('../../../assets/images/face.png')}
                />
              </View>
              <View style={styles.small_text_frame}>
                <Text style={[CFont.subtext2, {color: Color.cffffff}]}>
                  {groupInfo.GroupPeopleCount}
                </Text>
              </View>
            </View>
            <View style={styles.people_frame}>
              <View style={styles.small_icon_frame}>
                <Image
                  style={styles.small_icon}
                  source={require('../../../assets/images/photo.png')}
                />
              </View>
              <View style={styles.small_text_frame}>
                <Text style={[CFont.subtext2, {color: Color.cffffff}]}>
                  {groupInfo.GroupFileCount}
                </Text>
              </View>
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
    maxWidth: Size.group_max_width,
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
    position: 'relative',
  },
  touchable: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  photo_frame: {
    flex: 1,
    flexDirection: 'column',
  },
  photo: {
    flex: 1,
  },
  empty_frame: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty_image: {
    height: Size.height(50),
    width: Size.height(50),
  },
  title_frame: {
    height: Size.height(36),
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
  file_frame: {
    height: Size.height(20),
    width: Size.width(60),
    backgroundColor: Color.c30d9c8,
    borderRadius: Size.height(10),
    position: 'absolute',
    right: 7,
    top: 10,
    flexDirection: 'row',
  },
  people_frame: {
    height: Size.height(20),
    width: Size.width(60),
    backgroundColor: Color.c30d9c8,
    borderRadius: Size.height(10),
    position: 'absolute',
    right: 7,
    top: 35,
    flexDirection: 'row',
  },
  small_icon_frame: {
    width: Size.width(15),
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: Size.width(5),
  },
  small_icon: {
    width: Size.width(15),
    height: Size.width(15),
  },
  small_text_frame: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Size.width(5),
    marginRight: Size.width(5),
  },
});
