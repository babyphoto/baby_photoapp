import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  BackHandler,
  ToastAndroid,
  AsyncStorage,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Color} from './common/Color';
import {Size} from './common/Size';
import CNavigation from './component/navigation/CNavigation';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import CreateGroupPopup from './popup/CreateGroupPopup';
import {Keys} from './common/Keys';
import {API} from './common/Api';
import {CFont} from './common/CFont';
import Grid from 'react-native-grid-component';
import GroupItem from './component/grid/GroupItem';
import {Actions} from 'react-native-router-flux';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createGroupPopup: false,
      userInfo: {},
      invitedGroupList: [],
      myGroupList: [],
      col:
        Dimensions.get('window').height > Dimensions.get('window').width
          ? 2
          : 4,
      inviteView: null,
      myView: null,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('exitAppBackPress', this.handleBackButton);
    Dimensions.addEventListener('change', this.onChange);
    this.init();
  }

  componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('exitAppBackPress', this.handleBackButton);
    Dimensions.removeEventListener('change', this.onChange);
  }

  onChange = ({window, screen}) => {
    console.log(window, screen);
    this.setState(
      {
        col: window.height > window.width ? 2 : 4,
        inviteView: <View />,
        myView: <View />,
      },
      () => {
        this.setState({
          inviteView: null,
          myView: null,
        });
      },
    );
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  init = () => {
    AsyncStorage.getItem(Keys.userinfo).then(value => {
      this.setState(
        {
          userInfo: JSON.parse(value),
        },
        () => {
          this.callGroupList(value);
        },
      );
    });
  };

  callGroupList = () => {
    const {userInfo} = this.state;
    API.groupList(
      {
        userNum: userInfo.UserNum,
      },
      res => {
        if (res.result) {
          this.setState({
            invitedGroupList: res.result.invitedGroupList,
            myGroupList: res.result.myGroupList,
          });
        }
      },
    );
  };

  handleBackButton = () => {
    const {createGroupPopup} = this.state;
    if (createGroupPopup) {
      this.closeCreateGroup();
    } else {
      if (this.exitApp == undefined || !this.exitApp) {
        ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
        this.exitApp = true;

        this.timeout = setTimeout(
          () => {
            this.exitApp = false;
          },
          2000, // 2초
        );
      } else {
        clearTimeout(this.timeout);

        BackHandler.exitApp(); // 앱 종료
      }
    }
    return true;
  };

  onCreateGroup = () => {
    this.setState({
      createGroupPopup: true,
    });
  };

  closeCreateGroup = () => {
    this.setState({
      createGroupPopup: false,
    });
  };

  onClickGroupItem = (param, title) => {
    const {userInfo} = this.state;
    Actions.fileList({
      param: param,
      title: title,
      userInfo: userInfo,
      callback: this.callGroupList,
    });
  };

  render() {
    const {
      createGroupPopup,
      userInfo,
      myGroupList,
      invitedGroupList,
      inviteView,
      myView,
      col,
    } = this.state;
    console.log(userInfo);

    var myGrid = <View />;
    var inviteGrid = <View />;

    if (myView) {
      myGrid = myView;
    } else {
      myGrid = (
        <Grid
          scrollEnabled={false}
          renderItem={(data, i) => {
            return (
              <GroupItem groupInfo={data} onPress={this.onClickGroupItem} />
            );
          }}
          data={myGroupList}
          numColumns={col}
          keyExtractor={(data, i) => 'myGroupList_' + i.toString()}
        />
      );
    }

    if (inviteView) {
      inviteGrid = inviteView;
    } else {
      inviteGrid = (
        <Grid
          scrollEnabled={false}
          renderItem={(data, i) => {
            return (
              <GroupItem groupInfo={data} onPress={this.onClickGroupItem} />
            );
          }}
          data={invitedGroupList}
          numColumns={col}
          keyExtractor={(data, i) => 'invitedGroupList_' + i.toString()}
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
          <CNavigation isRight>메인</CNavigation>
          <View style={styles.list_frame}>
            <ScrollView style={styles.scroll_frame}>
              <View style={styles.title_frame}>
                <Text style={[CFont.subtext2, {color: Color.cffffff}]}>
                  내 그룹
                </Text>
              </View>
              {myGrid}
              <View style={styles.title_frame}>
                <Text style={[CFont.subtext2, {color: Color.cffffff}]}>
                  초대받은 그룹
                </Text>
              </View>
              {inviteGrid}
            </ScrollView>
          </View>
          <ActionButton buttonColor={Color.floatingActionButton}>
            <ActionButton.Item
              buttonColor={Color.c9b59b6}
              title="그룹 생성"
              onPress={this.onCreateGroup}>
              <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
          <CreateGroupPopup
            isVisible={createGroupPopup}
            onClose={this.closeCreateGroup}
          />
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
  list_frame: {
    flex: 1,
    flexDirection: 'column',
  },
  scroll_frame: {
    flex: 1,
  },
  title_frame: {
    height: Size.height(30),
    backgroundColor: Color.c30d9c8,
    paddingLeft: Size.width(20),
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: Size.height(1),
    marginBottom: Size.height(1),
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
