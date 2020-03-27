import {StyleSheet} from 'react-native';
import {Color} from './Color';

export const CStyle = StyleSheet.create({
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
  icon_shadow: {
    shadowColor: Color.shadows,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 12,
  },
  card_shadow: {
    shadowColor: Color.shadows,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.41,
    elevation: 2,
  },
  event_card_shadow: {
    shadowColor: Color.event_card,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  nav_shadow: {
    shadowColor: Color.nav_shadow,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  mypage_button_shadow: {
    shadowColor: Color.shadows,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 7,
  },
});
