import {Dimensions, Platform, StatusBar} from 'react-native';
import {Util} from './Util';

const viewHeight = Dimensions.get('window').height;
const viewWidth = Dimensions.get('window').width;
const viewScreenHeight = Dimensions.get('screen').height;
const viewScreenWidth = Dimensions.get('screen').width;
const designHeight = 667;
const designWidth = 375;

export const Size = {
  height: function(value) {
    return (
      (value / designHeight) *
      (viewHeight - (viewWidth * 2 < viewHeight ? 62 : 0))
    );
  },
  width: function(value) {
    return (value / designWidth) * viewWidth;
  },
  navigationHeight:
    (56 / designHeight) * (viewHeight - (viewWidth * 2 < viewHeight ? 62 : 0)),
  group_max_width: viewWidth / 2,
  viewHeight: viewHeight,
  viewWidth: viewWidth,
  viewScreenHeight: viewScreenHeight,
  viewScreenWidth: viewScreenWidth,
  StatusBarHeight: Platform.select({
    ios: Util.isIPhoneX() ? 44 : 20,
    android: StatusBar.currentHeight,
    default: 0,
  }),
};
