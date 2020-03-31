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
      inviteFriendPopup: false,
      profilePopup: <View />,
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
    console.log(window, screen);
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

  showProfile = userInfo => {
    const {param} = this.props;
    this.setState({
      profilePopup: (
        <Profile
          onClose={this.closeProfile}
          userInfo={userInfo}
          groupInfo={param}
          buttonCallback={this.callAddInvite}
          isInvite
        />
      ),
    });
  };

  callAddInvite = (userNum, inviteUserNum, groupNum) => {
    API.inviteGroup(
      {
        userNum: userNum,
        groupNum: groupNum,
        inviteUserNum: inviteUserNum,
      },
      res => {
        if (res) {
          if (res === 'Invite Success') {
            this.closeProfile();
            alert('초대되었습니다.');
          } else {
            alert('초대에 실패했습니다. 잠시후 다시 시도해주세요.');
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

  onAddFriend = () => {
    this.setState({
      inviteFriendPopup: true,
    });
  };

  closeAddFriend = () => {
    this.setState({
      inviteFriendPopup: false,
    });
  };

  // mediaType변경시 Vedio도 가능
  onAddFile = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    }).then(images => {
      const {userInfo, param} = this.props;
      console.log(userInfo, param);
      let data = new FormData();
      images.forEach((value, index) => {
        console.log(value);
        data.append('files', {
          uri: value.path,
          type: value.mime,
          name: value.path.split(/[/ ]+/).pop(),
        });
        if (Util.isVideo(value.mime)) {
          this.makeThumnailAndPushServer(value);
        }
      });
      data.append('userNum', userInfo.UserNum);
      data.append('groupNum', param.GroupNum);
      this.gads.show();
      this.callUploadFiles(data);
    });
  };

  makeThumnailAndPushServer = param => {
    const {userInfo} = this.props;
    createThumbnail({
      url: param.path,
      type: 'local',
    })
      .then(response => {
        console.log(response);
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
        console.log(fileExtention, fileName);
        data.append('userNum', userInfo.UserNum);
        data.append('fileName', fileName);
        API.uploadThumnail(data, res => {
          console.log('thum', res);
        });
      })
      .catch(err => console.log({err}));
  };

  callFileList = () => {
    const {param} = this.props;
    API.fileList(
      {
        groupNum: param.GroupNum,
      },
      res => {
        if (res.result) {
          this.setState({
            fileList: res.result.fileList,
          });
        }
      },
    );
  };

  callUploadFiles = files => {
    API.uploadFiles(
      files,
      res => {
        if (res.result) {
          this.callFileList();
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  adShowFunc = () => {
    this.gads.show();
  };

  onLongPress = fileInfo => {
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

  render() {
    const {
      fileList,
      col,
      isGridView,
      inviteFriendPopup,
      profilePopup,
    } = this.state;
    const {title, userInfo} = this.props;
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
                fileInfo={data}
                onPress={this.onClickGroupItem}
                onLongPress={this.onLongPress}
              />
            );
          }}
          data={fileList}
          numColumns={col}
          keyExtractor={(data, i) => 'fileList_' + i.toString()}
        />
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
          <CNavigation isBack>{title}</CNavigation>
          <View style={styles.list_frame}>{gridView}</View>
          <InviteFriendPopup
            isVisible={inviteFriendPopup}
            onClose={this.closeAddFriend}
            userInfo={userInfo}
            profileFunc={this.showProfile}
          />
          {profilePopup}
        </View>
        <ActionButton buttonColor={Color.floatingActionButton}>
          <ActionButton.Item
            buttonColor={Color.c9b59b6}
            textContainerStyle={{backgroundColor: Color.c000000}}
            textStyle={{color: Color.cffffff}}
            title="친구 추가"
            onPress={this.onAddFriend}>
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
});
