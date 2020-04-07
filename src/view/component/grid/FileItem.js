import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {Size} from '../../common/Size';
import {Color} from '../../common/Color';
import {CFont} from '../../common/CFont';
import {API} from '../../common/Api';
import Video from 'react-native-video';
import {Util} from '../../common/Util';
import FastImage from 'react-native-fast-image';
import {Actions} from 'react-native-router-flux';

export default class FileItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailImage: '',
      thumbnailHeight: '100%',
    };
  }

  componentDidMount() {}

  onPress = () => {
    const {fileList, index, fileInfo, adShowFunc} = this.props;
    Actions.fileDetail({
      fileInfo: fileInfo,
      adShowFunc: adShowFunc,
      fileList: fileList,
      index: index,
    });
    // this.requestStorageAccess();
  };

  onLongPress = () => {
    const {onLongPress, fileInfo} = this.props;
    if (onLongPress) {
      onLongPress(fileInfo);
    }
  };

  onBuffer = data => {};

  videoError = err => {};

  render() {
    const {thumbnailHeight, isFastImage} = this.state;
    const {fileInfo} = this.props;
    var isVideo = Util.isVideo(fileInfo.FileExtention);
    var fileName = '';
    if (isVideo) {
      fileName = String(fileInfo.FileThumbnail).replace(
        fileInfo.FileExtention,
        'jpg',
      );
    } else {
      fileName = fileInfo.FileThumbnail;
    }
    return (
      <View style={styles.container}>
        <View style={[styles.margin, styles.shadow]}>
          <TouchableOpacity
            disabled={false}
            style={styles.touchable}
            onPress={this.onPress}
            onLongPress={this.onLongPress}>
            {isVideo ? (
              <View style={styles.photo_frame}>
                <Video
                  source={{uri: API.downloadVideoURL + fileInfo.FilePath}}
                  ref={ref => {
                    this.player = ref;
                  }}
                  volume={0}
                  onBuffer={this.onBuffer}
                  onError={this.videoError}
                  onReadyForDisplay={() => {
                    this.setState({
                      thumbnailHeight: 0,
                    });
                  }}
                  onLoadStart={() => {
                    this.setState({
                      thumbnailHeight: '100%',
                    });
                  }}
                  resizeMode="contain"
                  style={styles.photo}
                />
                <FastImage
                  style={[styles.photo_thumnail, {height: thumbnailHeight}]}
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri: API.downloadURL + fileName,
                    cache: FastImage.cacheControl.web,
                  }}
                />
              </View>
            ) : (
              <View style={styles.photo_frame}>
                <FastImage
                  style={styles.photo}
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri: API.downloadURL + fileInfo.FileThumbnail,
                    cache: FastImage.cacheControl.web,
                  }}
                />
              </View>
            )}
          </TouchableOpacity>
          {isVideo ? (
            <View style={styles.file_frame}>
              <Image
                style={styles.small_icon}
                source={require('../../../assets/images/movie.png')}
              />
            </View>
          ) : (
            <View />
          )}
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
    backgroundColor: Color.cffffff,
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
    flexDirection: 'row',
    position: 'relative',
  },
  photo: {
    flex: 1,
  },
  photo_thumnail: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
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
    width: Size.width(20),
    borderRadius: Size.height(10),
    position: 'absolute',
    right: 7,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  small_icon_frame: {
    width: Size.width(15),
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: Size.width(5),
  },
  small_icon: {
    width: Size.width(20),
    height: Size.width(20),
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
