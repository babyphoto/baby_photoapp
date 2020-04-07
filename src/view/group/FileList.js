import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  BackHandler,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import CNavigation from '../component/navigation/CNavigation';
import {Color} from '../common/Color';
import {Actions} from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {API} from '../common/Api';
import GoogleAds from '../component/ads/GoogleAds';
import Grid from 'react-native-grid-component';
import FileItem from '../component/grid/FileItem';
import {createThumbnail} from 'react-native-create-thumbnail';
import {Util} from '../common/Util';
import InviteFriendPopup from '../popup/InviteFriendPopup';
import Profile from '../popup/Profile';
import CProgress from '../popup/CProgress';
import ImageEditor from '@react-native-community/image-editor';
import {Size} from '../common/Size';
import GroupUserList from '../popup/GroupUserList';
export default class FileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      imageData: {
        name: '',
        uri: '',
        type: '',
      },
      col:
        Dimensions.get('window').height > Dimensions.get('window').width
          ? 2
          : 4,
      isGridView: null,
      visible: false,
      inviteFriendPopup: <View />,
      profilePopup: <View />,
      isProgress: false,
      progressData: {
        total: 0,
        loaded: 0,
        per: 0,
      },
      groupUserList: <View />,
    };

    this.gads = new GoogleAds(() => {}, event => {});
  }

  componentDidMount() {
    BackHandler.addEventListener('exitAppBackPress', this.handleBackButton);

    Dimensions.addEventListener('change', this.onChange);
    this.callFileList();
  }

  componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('exitAppBackPress', this.handleBackButton);
    Dimensions.removeEventListener('change', this.onChange);
    const {callback} = this.props;
    if (callback) {
      callback();
    }
  }

  onChange = ({window, screen}) => {
    this.setState(
      {
        col: window.height > window.width ? 2 : 4,
        isGridView: <View />,
      },
      () => {
        this.setState({
          isGridView: null,
        });
      },
    );
  };

  handleBackButton = () => {
    Actions.pop();
    return true;
  };

  callAddInvite = (inviteUserInfo, callback) => {
    const {param, userInfo} = this.props;

    API.inviteGroup(
      {
        userNum: userInfo.UserNum,
        groupNum: param.GroupNum,
        inviteUserNum: inviteUserInfo.UserNum,
      },
      res => {
        if (res) {
          if (res === 'Invite Success') {
            Alert.alert('친구초대', '초대되었습니다.');
            if (callback) {
              callback();
            }
          } else if (res === 'Invite fail - Lack of authority') {
            Alert.alert('친구초대 실패', '초대할 수 있는 권한이 없습니다.');
          } else {
            Alert.alert(
              '유저초대 실패',
              '초대에 실패했습니다. 잠시후 다시 시도해주세요.',
            );
          }
        }
      },
    );
  };

  closeProfile = () => {
    this.setState({
      profilePopup: <View />,
    });
  };

  // mediaType변경시 Vedio도 가능
  onAddFile = () => {
    const {param} = this.props;
    if (param.AbleUpload === 'Y') {
      ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        showsSelectedCount: true,
        maxFiles: 30,
      }).then(images => {
        // var selectImageSize = 0;
        // var maxImageSize = 15728640;
        // var oneMb = 1048576;
        var selectImageCount = 0;
        images.forEach((value, index) => {
          selectImageCount += 1;
        });
        if (selectImageCount > 30) {
          Alert.alert(
            '업로드 실패',
            '한번에 최대 올릴 수 있는 사진의 갯수는 30장입니다.',
          );
        } else {
          this.setState({
            isProgress: true,
          });
          const {userInfo, param} = this.props;
          let data = new FormData();
          images.forEach((value, index) => {
            data.append('files', {
              uri: value.path,
              type: value.mime,
              name: value.path.split(/[/ ]+/).pop(),
            });
            if (Util.isVideo(value.mime)) {
              this.makeThumnailAndPushServer(value);
            } else {
              this.makeResizeImage(value);
            }
          });
          data.append('userNum', userInfo.UserNum);
          data.append('groupNum', param.GroupNum);
          this.gads.show();
          this.callUploadFiles(data);
        }
      });
    } else {
      Alert.alert(
        '권한부족',
        '업로드할 권한이 없습니다. 권한이 필요할 경우 그룹관리자에게 문의하세요.',
      );
    }
  };

  makeResizeImage = param => {
    const {userInfo} = this.props;
    var text = ImageEditor.cropImage(param.path, {
      offset: {x: 0, y: 0}, // crop 시작 위치
      size: {width: param.width, height: param.height},
      displaySize: {width: param.width * 0.3, height: param.height * 0.3},
      resizeMode: 'cover',
    })
      .then(value => {
        let data = new FormData();
        data.append('file', {
          uri: value,
          type: param.mime,
          name: param.path.split(/[/ ]+/).pop(),
        });
        data.append('userNum', userInfo.UserNum);
        data.append('fileName', param.path.split(/[/]+/).pop());
        API.uploadThumnail(data, res => {
          console.log('thum', res);
        });
      })
      .catch(err => {
        console.log(err);
      });
    console.log('resize', text);
  };

  makeThumnailAndPushServer = param => {
    const {userInfo} = this.props;
    createThumbnail({
      url: param.path,
      type: 'local',
    })
      .then(response => {
        let data = new FormData();
        data.append('file', {
          uri: response.path,
          type: 'image/jpeg',
          name: response.path.split(/[/ ]+/).pop(),
        });
        var fileExtention = String(param.path.split(/[. ]+/).pop());
        var fileName = String(param.path.split(/[/ ]+/).pop()).replace(
          fileExtention,
          'jpg',
        );
        data.append('userNum', userInfo.UserNum);
        data.append('fileName', fileName);
        data.append('fileType', 'video');
        API.uploadThumnail(data, res => {
          console.log('thum', res);
        });
      })
      .catch(err => console.log({err}));
  };

  callFileList = () => {
    const {userInfo} = this.props;
    const {param} = this.props;
    API.fileList(
      {
        userNum: userInfo.UserNum,
        groupNum: param.GroupNum,
      },
      res => {
        if (res.result) {
          this.setState({
            fileList: res.result.fileList,
          });
        } else {
          if (res === 'Viewing fail - Lack of authority') {
            Alert.alert(
              '권한부족',
              '해당 그룹의 사진을 볼 수 있는 권한이 없습니다. 권한이 필요하실 경우 그룹관리자에게 문의하세요.',
            );
            Actions.pop();
          }
        }
      },
    );
  };

  callUploadFiles = files => {
    API.uploadProgress(
      files,
      res => {
        console.log(res);
        if (res.result) {
          if (res.result === 'file upload success') {
            this.callFileList();
            this.setState({
              isProgress: false,
              progressData: {
                total: 0,
                loaded: 0,
                per: 0,
              },
            });
          }
        }
      },
      err => {
        console.log(err);
      },
      oEvent => {
        if (oEvent.lengthComputable) {
          var percentComplete = (oEvent.loaded / oEvent.total) * 100;
          this.setState({
            progressData: {
              total: oEvent.total,
              loaded: oEvent.loaded,
              per: percentComplete,
            },
          });
        } else {
          // Unable to compute progress information since the total size is unknown
        }
      },
    );
  };

  adShowFunc = () => {
    this.gads.show();
  };

  onLongPress = fileInfo => {
    const {param} = this.props;
    if (param.AbleDelete === 'Y') {
      global.confirm_show(
        '사진삭제',
        '선택한 사진을 삭제하시겠습니까?',
        () => {
          global.confirm_close();
        },
        () => {
          global.confirm_close();
          this.callDeleteFile(fileInfo);
        },
      );
    } else {
      Alert.alert(
        '권한부족',
        '삭제할 권한이 없습니다. 권한이 필요할 경우 그룹관리자에게 문의하세요.',
      );
    }
  };

  callDeleteFile = fileInfo => {
    const {userInfo, param} = this.props;
    API.deleteFile(
      {
        userNum: userInfo.UserNum,
        groupNum: param.GroupNum,
        fileNum: fileInfo.FileNum,
      },
      res => {
        if (res) {
          if (res === 'Delete fail - Lack of authority') {
            Alert.alert('삭제실패', '권한이 부족합니다.');
          } else {
            Alert.alert('사진삭제', '사진이 삭제되었습니다.');
            this.callFileList();
          }
        }
      },
    );
  };

  showGroupList = () => {
    const {userInfo, param} = this.props;
    this.setState({
      groupUserList: (
        <GroupUserList
          isVisible={true}
          onClose={this.closeGroupList}
          groupInfo={param}
          loginUserInfo={userInfo}
        />
      ),
    });
  };

  closeGroupList = () => {
    this.setState({
      groupUserList: <View />,
    });
  };

  showFriendSearch = () => {
    const {userInfo, param} = this.props;
    if (param.IsAdmin === 'Y') {
      this.setState({
        inviteFriendPopup: (
          <InviteFriendPopup
            isVisible={true}
            onClose={this.closeFriendSearch}
            loginUserInfo={userInfo}
            groupInfo={param}
            addInvite={this.callAddInvite}
          />
        ),
      });
    } else {
      Alert.alert('권한부족', '관리자만 새로운 친구를 추가할 수 있습니다.');
    }
  };

  closeFriendSearch = () => {
    this.setState({
      inviteFriendPopup: <View />,
    });
  };

  render() {
    const {
      fileList,
      col,
      isGridView,
      inviteFriendPopup,
      profilePopup,
      isProgress,
      progressData,
      groupUserList,
    } = this.state;
    const {title, userInfo, param} = this.props;
    var gridView = <View />;
    if (isGridView) {
      gridView = isGridView;
    } else {
      gridView = (
        <Grid
          style={styles.scroll_frame}
          renderItem={(data, i) => {
            return (
              <FileItem
                fileList={fileList}
                index={i}
                fileInfo={data}
                onPress={this.onClickGroupItem}
                onLongPress={this.onLongPress}
                adShowFunc={this.adShowFunc}
              />
            );
          }}
          data={fileList}
          numColumns={col}
          keyExtractor={(data, i) => 'fileList_' + i.toString()}
        />
      );
    }
    console.log(param);
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
            isRightList
            rightList={
              <View style={styles.right_button_frame}>
                {Util.isY(param.IsAdmin) ? (
                  <View style={styles.button_frame}>
                    <TouchableOpacity
                      style={styles.touchable}
                      onPress={this.showGroupList}>
                      <Image
                        style={styles.button_image}
                        source={require('../../assets/images/people.png')}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View />
                )}

                <View style={styles.button_frame}>
                  <TouchableOpacity
                    style={styles.touchable}
                    onPress={this.callFileList}>
                    <Image
                      style={styles.button_image}
                      source={require('../../assets/images/refresh.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            }>
            {title}
          </CNavigation>
          <View style={styles.list_frame}>{gridView}</View>

          {profilePopup}
          <CProgress
            isVisible={isProgress}
            data={progressData}
            adShowFunc={this.adShowFunc}
          />
          {inviteFriendPopup}
          {groupUserList}
        </View>
        <ActionButton buttonColor={Color.floatingActionButton}>
          <ActionButton.Item
            buttonColor={Color.c9b59b6}
            textContainerStyle={{backgroundColor: Color.c000000}}
            textStyle={{color: Color.cffffff}}
            title="친구 추가"
            onPress={this.showFriendSearch}>
            <Icon name="md-people" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor={Color.c9b59b6}
            textContainerStyle={{backgroundColor: Color.c000000}}
            textStyle={{color: Color.cffffff}}
            title="이미지 추가"
            onPress={this.onAddFile}>
            <Icon name="md-images" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
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
  right_button_frame: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button_frame: {
    height: Size.width(29),
    width: Size.width(29),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Size.width(10),
  },
  button_image: {
    height: Size.width(21),
    width: Size.width(24),
  },
  touchable: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
