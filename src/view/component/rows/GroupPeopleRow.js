import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import PropTypes from 'prop-types';
import {Size} from '../../common/Size';
import {Color} from '../../common/Color';
import {CFont} from '../../common/CFont';
import {Util} from '../../common/Util';

export default class GroupPeopleRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  returnfunc = type => {
    const {data, modifyUser} = this.props;
    var tmp = {
      groupNum: data.GroupNum,
      userNum: data.UserNum,
      IsAdmin: data.IsAdmin,
      AbleUpload:
        type === 1 ? (!Util.isY(data.AbleUpload) ? 'Y' : 'N') : data.AbleUpload,
      AbleDelete:
        type === 2 ? (!Util.isY(data.AbleDelete) ? 'Y' : 'N') : data.AbleDelete,
      AbleView:
        type === 3 ? (!Util.isY(data.AbleView) ? 'Y' : 'N') : data.AbleView,
    };
    if (modifyUser) {
      modifyUser(tmp);
    }
  };

  exitUser = () => {
    const {data, exitUser} = this.props;
    if (exitUser) {
      exitUser(data);
    }
  };

  render() {
    const {data, loginUserInfo} = this.props;
    console.log(data);
    var profile = data.UserProfile
      ? {uri: data.UserProfile}
      : require('../../../assets/images/account.png');
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={1} style={styles.touchable}>
          <View style={styles.profile_frame}>
            <Image style={styles.profile} source={profile} />
          </View>
          <View style={styles.name_frame}>
            <Text style={[CFont.body2, {color: Color.c0a214b}]}>
              {data.UserName}
            </Text>
          </View>
          <View style={styles.grant_frame}>
            <View style={styles.grant_item}>
              <TouchableOpacity
                style={styles.grant_item}
                onPress={() => {
                  this.returnfunc(1);
                }}>
                <Image
                  style={styles.grant_image}
                  source={
                    data.AbleUpload === 'Y'
                      ? require('../../../assets/images/toggle_on.png')
                      : require('../../../assets/images/toggle_off.png')
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.grant_item}>
              <TouchableOpacity
                style={styles.grant_item}
                onPress={() => {
                  this.returnfunc(2);
                }}>
                <Image
                  style={styles.grant_image}
                  source={
                    data.AbleDelete === 'Y'
                      ? require('../../../assets/images/toggle_on.png')
                      : require('../../../assets/images/toggle_off.png')
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.grant_item}>
              <TouchableOpacity
                style={styles.grant_item}
                onPress={() => {
                  this.returnfunc(3);
                }}>
                <Image
                  style={styles.grant_image}
                  source={
                    data.AbleView === 'Y'
                      ? require('../../../assets/images/toggle_on.png')
                      : require('../../../assets/images/toggle_off.png')
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.grant_item}>
              <TouchableOpacity
                style={styles.grant_item}
                onPress={this.exitUser}>
                <Image
                  style={styles.grant_image}
                  source={require('../../../assets/images/exit.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Size.height(60),
    flexDirection: 'row',
    borderBottomColor: Color.c30d9c8,
    borderBottomWidth: Size.height(1),
    borderStyle: 'solid',

    position: 'relative',
  },
  touchable: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: Size.width(10),
    marginRight: Size.width(10),
  },
  disable: {
    height: '100%',
    width: '100%',
    backgroundColor: Color.modal,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  profile_frame: {
    width: Size.width(50),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: Size.width(40),
    height: Size.width(40),
    borderRadius: Size.width(20),
  },
  name_frame: {
    width: Size.width(70),
    flexDirection: 'row',
    alignItems: 'center',
  },
  grant_frame: {
    flex: 1,
    flexDirection: 'row',
  },
  grant_item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grant_image: {
    width: Size.width(30),
    height: Size.height(20),
  },
});
