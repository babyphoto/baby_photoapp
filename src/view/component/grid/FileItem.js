import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Size} from '../../common/Size';
import {Color} from '../../common/Color';
import {CFont} from '../../common/CFont';
import {API} from '../../common/Api';

export default class FileItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPress = () => {};

  render() {
    const {fileInfo} = this.props;
    return (
      <View style={styles.container}>
        <View style={[styles.margin, styles.shadow]}>
          <TouchableOpacity
            disabled={false}
            style={styles.touchable}
            onPress={this.onPress}>
            <View style={styles.photo_frame}>
              <Image
                style={styles.photo}
                resizeMode="cover"
                source={{
                  uri: API.downloadURL + fileInfo.FilePath,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

FileItem.propTypes = {
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
    backgroundColor: Color.c000000,
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
    flexDirection: 'column',
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
