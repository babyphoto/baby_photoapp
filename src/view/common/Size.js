import {Dimensions} from 'react-native';

const viewHeight = Dimensions.get('window').height;
const viewWidth = Dimensions.get('window').width;

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
  viewHeight: viewHeight,
  viewWidth: viewWidth,
};
