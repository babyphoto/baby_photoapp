import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Color} from '../common/Color';
import {Size} from '../common/Size';
import {CFont} from '../common/CFont';
import CButton from '../component/button/CButton';
import CTextField from '../component/textfleid/CTextField';
import {API} from '../common/Api';
import InvitePeopleRow from '../component/rows/InvitePeopleRow';

export default class InviteFriendPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      people_text: '',
      groupUserList: [],
      userList: [],
    };
  }

  componentDidMount() {
    this.callGroupList();
  }

  close = () => {
    const {onClose} = this.props;
    if (onClose) {
      onClose();
    }
  };

  confirm = () => {
    const {onConfirm} = this.props;
    if (onConfirm) {
      onConfirm();
    }
  };

  onChangeText = text => {
    this.setState({
      people_text: text,
    });
    this.callSearchUser(text);
  };

  callGroupList = callback => {
    const {groupInfo} = this.props;
    API.groupUserDetailList(
      {
        groupNum: groupInfo.GroupNum,
        searchText: '',
      },
      res => {
        if (res.result) {
          if (res.result.userList.length > 0) {
            this.setState(
              {
                groupUserList: res.result.userList,
              },
              () => {
                if (callback) {
                  callback();
                }
              },
            );
          }
        }
      },
    );
  };

  callSearchUser = text => {
    const {groupUserList} = this.state;
    API.userSearch(
      {
        searchText: text,
      },
      res => {
        if (res.result) {
          var checkedList = [];
          res.result.userInfo.forEach((value, index) => {
            if (groupUserList.length > 0) {
              var isExist = false;
              groupUserList.forEach((value2, index2) => {
                if (value.UserNum === value2.UserNum) {
                  isExist = true;
                }
              });
              if (isExist) {
                value.isInvite = true;
                checkedList.push(value);
              } else {
                value.isInvite = false;
                checkedList.push(value);
              }
            } else {
              value.isInvite = false;
              checkedList.push(value);
            }
          });
          this.setState({
            userList: checkedList,
          });
        }
      },
      error => {
        console.log(error);
      },
      false,
    );
  };

  callInvite = param => {
    const {addInvite} = this.props;
    const {people_text} = this.state;
    if (addInvite) {
      addInvite(param, () => {
        this.callGroupList(() => {
          this.callSearchUser(people_text);
        });
      });
    }
  };

  render() {
    const {isVisible, loginUserInfo, context} = this.props;
    const {people_text, userList} = this.state;
    var groupList = userList.map((value, index) => {
      return loginUserInfo.UserNum !== value.UserNum ? (
        <InvitePeopleRow
          data={value}
          id={'InvitePeopleRow' + index}
          loginUserInfo={loginUserInfo}
          callInvite={this.callInvite}
        />
      ) : (
        <View />
      );
    });
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={this.close}>
        <TouchableWithoutFeedback
          onLayout={layout => {}}
          onPress={this.close}
          onFocus={() => console.log('dddd')}>
          <View transparent={true} style={styles.back_view}>
            <ScrollView style={styles.back_scroll}>
              <View style={styles.container}>
                <TouchableHighlight
                  activeOpacity={1}
                  style={[styles.popup_back, styles.shadow]}>
                  <View style={styles.content}>
                    <View style={styles.title_frame}>
                      <Text style={[CFont.body2, {color: Color.navtitle}]}>
                        그룹원 리스트
                      </Text>
                    </View>
                    <View style={styles.input_frame}>
                      <Image
                        style={styles.icon}
                        source={require('../../assets/images/search.png')}
                      />
                      <CTextField
                        initText={people_text}
                        onChangeText={this.onChangeText}
                        style={styles.input}
                      />
                    </View>
                    <View style={styles.divider_title_frame}>
                      <View style={styles.divider_title}>
                        <Text style={[CFont.subtext2, {color: Color.cffffff}]}>
                          사용자정보
                        </Text>
                      </View>
                      <View style={styles.divider_items}>
                        <View style={styles.divider_item}>
                          <Text
                            style={[CFont.subtext2, {color: Color.cffffff}]}>
                            ID
                          </Text>
                        </View>
                        <View style={styles.divider_item}>
                          <Text
                            style={[CFont.subtext2, {color: Color.cffffff}]}>
                            초대
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.list_frame}>
                      <ScrollView style={styles.scroll_frame}>
                        {groupList}
                      </ScrollView>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

InviteFriendPopup.propTypes = {
  onPress: PropTypes.func,
  data: PropTypes.object,
  disable: PropTypes.bool,
};

const styles = StyleSheet.create({
  back_view: {
    flex: 1,
    backgroundColor: Color.modal,
    flexDirection: 'column',
  },
  back_scroll: {
    flex: 1,
  },
  container: {
    height: Size.viewHeight - Size.StatusBarHeight,
    width: Size.viewWidth,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    height: '100%',
    width: '100%',
  },
  popup_back: {
    backgroundColor: Color.cffffff,
    minHeight: Size.height(500),
    width: '90%',
    flexDirection: 'column',
  },
  title_frame: {
    marginRight: Size.width(12),
    marginLeft: Size.width(12),
    height: Size.height(40),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input_frame: {
    marginRight: Size.width(12),
    marginLeft: Size.width(12),
    height: Size.height(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: Size.height(40),
    flex: 1,
  },
  icon: {
    height: Size.width(35),
    width: Size.width(35),
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
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  divider_title_frame: {
    height: Size.height(30),
    backgroundColor: Color.c30d9c8,
    paddingLeft: Size.width(10),
    paddingRight: Size.width(10),
    flexDirection: 'row',
    marginTop: Size.height(10),
    marginBottom: Size.height(1),
  },
  divider_title: {
    width: Size.width(120),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider_items: {
    flex: 1,
    flexDirection: 'row',
  },
  divider_item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list_frame: {
    flex: 1,
    flexDirection: 'column',
  },
  scroll_frame: {
    flex: 1,
  },
});
