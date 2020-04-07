import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import PropTypes from 'prop-types';
import {Size} from '../../common/Size';
import {Color} from '../../common/Color';
import {CFont} from '../../common/CFont';
import {Util} from '../../common/Util';

export default class InvitePeopleRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  clickInvite = () => {
    const {data, callInvite} = this.props;
    if (callInvite) {
      callInvite(data);
    }
  };

  render() {
    const {data, loginUserInfo} = this.props;
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
          <View style={styles.divider_items}>
            <View style={styles.divider_item}>
              <Text style={[CFont.body1, {color: Color.c0a214b}]}>
                {data.UserNickName}
              </Text>
            </View>
            <View style={styles.divider_item}>
              <TouchableOpacity
                style={styles.divider_item}
                onPress={this.clickInvite}>
                {data.isInvite ? (
                  <Text style={[CFont.body2, {color: Color.c0a887b}]}>
                    초대완료
                  </Text>
                ) : (
                  <Text style={[CFont.body2, {color: Color.c770bbf}]}>
                    초대
                  </Text>
                )}
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
  grant_image: {
    width: Size.width(35),
    height: Size.height(25),
  },
});
