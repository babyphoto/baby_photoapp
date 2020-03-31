import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  BackHandler,
  Dimensions,
  Text,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Color} from '../common/Color';
import {Actions} from 'react-native-router-flux';
import {API} from '../common/Api';
import {Util} from '../common/Util';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';

import Video from 'react-native-video';
import CNavigation from '../component/navigation/CNavigation';
import {Size} from '../common/Size';
import RNFetchBlob from 'rn-fetch-blob';
import GoogleAds from '../component/ads/GoogleAds';
export default class FileDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailHeight: 0,
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      playerState: PLAYER_STATES.PLAYING,
      screenType: 'content',
      fastimage_width: 0,
      cropHeight: Dimensions.get('window').height - Size.navigationHeight,
      cropWidth: Dimensions.get('window').width,
    };

    this.gads = new GoogleAds(
      () => {
        console.log('Advert ready to show.');
      },
      event => {},
    );
  }

  componentDidMount() {
    BackHandler.addEventListener('exitAppBackPress', this.handleBackButton);
    Dimensions.addEventListener('change', this.onChange);
  }

  componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('exitAppBackPress', this.handleBackButton);
    Dimensions.removeEventListener('change', this.onChange);
  }

  async requestStorageAccess() {
    const {fileInfo} = this.props;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let dirs = RNFetchBlob.fs.dirs;
        var fileName = String(fileInfo.FilePath.split(/[\\ ]+/).pop());
        this.gads.show();
        RNFetchBlob.config({
          addAndroidDownloads: {
            useDownloadManager: true, // <-- this is the only thing required
            // Optional, override notification setting (default to true)
            notification: true,
            // Optional, but recommended since android DownloadManager will fail when
            // the url does not contains a file extension, by default the mime type will be text/plain
            mime: 'text/plain',
            description: 'File downloaded by download manager.',
            path: dirs.PictureDir + '/' + fileName,
          },
        })
          .fetch('GET', API.downloadURL + fileInfo.FilePath)
          .then(resp => {
            console.log(resp);
            // the path of downloaded file
            resp.path();
          });
      } else {
        Alert.alert('권한 부족', '파일을 다운로드 할 수 없습니다.');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  onDownLoad = () => {
    this.requestStorageAccess();
  };

  onChange = ({window, screen}) => {
    console.log(window, screen);
    this.setState({
      cropHeight: Dimensions.get('window').height - Size.navigationHeight,
      cropWidth: Dimensions.get('window').width,
    });
  };

  onSeek = seek => {
    this.videoPlayer.seek(seek);
  };
  onPaused = playerState => {
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };
  onReplay = () => {
    this.setState({playerState: PLAYER_STATES.PLAYING});
    this.videoPlayer.seek(0);
  };
  onProgress = data => {
    const {isLoading, playerState} = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({currentTime: data.currentTime});
    }
  };
  onLoad = data => {
    this.setState({duration: data.duration, isLoading: false});
  };
  onLoadStart = data => {
    this.setState({isLoading: true});
  };
  onEnd = () => {
    this.setState({playerState: PLAYER_STATES.ENDED});
  };
  onError = () => {
    alert('Oh! ', error);
  };
  exitFullScreen = () => {
    alert('Exit full screen');
  };
  enterFullScreen = () => {};
  onFullScreen = () => {
    if (this.state.screenType == 'content') {
      this.setState({screenType: 'cover'});
    } else {
      this.setState({screenType: 'content'});
    }
  };
  renderToolbar = () => (
    <View>
      <Text> toolbar </Text>
    </View>
  );

  handleBackButton = () => {
    Actions.pop();
    return true;
  };

  render() {
    const {
      thumbnailHeight,
      fastimage_width,
      cropHeight,
      cropWidth,
    } = this.state;
    const {fileInfo} = this.props;
    var isVideo = Util.isVideo(fileInfo.FileExtention);
    var fileName = '';
    if (isVideo) {
      fileName = String(fileInfo.FilePath).replace(
        fileInfo.FileExtention,
        'jpg',
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="dark-content" backgroundColor={Color.cffffff} />
        )}
        <View style={styles.content_frame}>
          <CNavigation
            isBack
            isRight
            onRightButtonImage={require('../../assets/images/download.png')}
            onRightButton={this.onDownLoad}
          />
          {isVideo ? (
            <View style={styles.video_frame}>
              <Video
                onEnd={this.onEnd}
                onLoad={this.onLoad}
                onLoadStart={this.onLoadStart}
                onProgress={this.onProgress}
                paused={this.state.paused}
                ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                resizeMode={this.state.screenType}
                onFullScreen={this.state.isFullScreen}
                source={{uri: API.downloadURL + fileInfo.FilePath}}
                style={styles.video}
                volume={10}
              />
              <MediaControls
                duration={this.state.duration}
                isLoading={this.state.isLoading}
                mainColor="orange"
                onFullScreen={this.onFullScreen}
                onPaused={this.onPaused}
                onReplay={this.onReplay}
                onSeek={this.onSeek}
                playerState={this.state.playerState}
                progress={this.state.currentTime}
                toolbar={this.renderToolbar()}
              />
            </View>
          ) : (
            <View style={styles.photo_frame}>
              <ImageZoom
                style={styles.photo_frame}
                cropWidth={cropWidth}
                cropHeight={cropHeight}
                imageWidth={cropWidth}
                imageHeight={cropHeight}>
                <FastImage
                  style={[styles.photo, {width: fastimage_width}]}
                  resizeMode={FastImage.resizeMode.contain}
                  onLoad={e => {
                    console.log('fileDetail');
                    this.setState({
                      fastimage_width: Size.viewWidth,
                    });
                  }}
                  source={{
                    uri: API.downloadURL + fileInfo.FilePath,
                  }}
                />
                <Image
                  style={styles.photo}
                  resizeMode="contain"
                  source={{
                    uri: API.downloadURL + fileInfo.FilePath,
                  }}
                />
              </ImageZoom>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content_frame: {
    flex: 1,
    flexDirection: 'column',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  list_frame: {
    flex: 1,
    flexDirection: 'column',
  },
  scroll_frame: {
    flex: 1,
  },
  photo_frame: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: Color.c000000,
  },
  photo: {
    height: '100%',
    width: '100%',
  },
  video_frame: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: Color.c000000,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: 300,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
});
