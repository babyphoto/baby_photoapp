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
} from 'react-native';
import {Color} from './common/Color';
import {Size} from './common/Size';
import CNavigation from './component/navigation/CNavigation';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import CreateGroupPopup from './popup/CreateGroupPopup';
import {Keys} from './common/Keys';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createGroupPopup: false,
      userInfo: {},
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

  init = () => {
    AsyncStorage.getItem(Keys.userinfo).then(value => {
      this.setState({
        userInfo: value,
      });
    });
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
    const {createGroupPopup} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="dark-content" backgroundColor={Color.cffffff} />
        )}
        <View style={styles.content_frame}>
          <CNavigation>메인</CNavigation>
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item
              buttonColor="#9b59b6"
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
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
