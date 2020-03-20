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

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createGroupPopup: false,
      userInfo: {},
      invitedGroupList: [],
      myGroupList: [],
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('exitAppBackPress', this.handleBackButton);
    this.init();
  }

  componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('exitAppBackPress', this.handleBackButton);
  }

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

  render() {
    const {
      createGroupPopup,
      userInfo,
      myGroupList,
      invitedGroupList,
    } = this.state;
    console.log(userInfo);
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="dark-content" backgroundColor={Color.cffffff} />
        )}
        <View style={styles.content_frame}>
          <CNavigation>메인</CNavigation>
          <View style={styles.list_frame}>
            <ScrollView style={styles.scroll_frame}>
              <View style={styles.title_frame}>
                <Text style={[CFont.subtext2, {color: Color.cffffff}]}>
                  내 그룹
                </Text>
              </View>
              <Grid
                scrollEnabled={false}
                renderItem={(data, i) => {
                  return <GroupItem groupInfo={data} />;
                }}
                data={myGroupList}
                numColumns={2}
                keyExtractor={(data, i) => 'myGroupList_' + i.toString()}
              />
              <View style={styles.title_frame}>
                <Text style={[CFont.subtext2, {color: Color.cffffff}]}>
                  초대받은 그룹
                </Text>
              </View>
              <Grid
                scrollEnabled={false}
                renderItem={(data, i) => {
                  return <View />;
                }}
                data={invitedGroupList}
                numColumns={2}
                keyExtractor={(data, i) => 'invitedGroupList_' + i.toString()}
              />
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
