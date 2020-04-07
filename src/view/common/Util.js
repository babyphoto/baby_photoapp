import moment from 'moment';
import {Dimensions, Platform} from 'react-native';

export const Util = {
  isVideo: function(type) {
    if (String(type).indexOf('mp4') !== -1) {
      return true;
    } else {
      return false;
    }
  },

  numberWithCommas: function(x) {
    return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  currentDateTime: function() {
    return moment(new Date()).format('YYYY.MM.DD. hh:mm:ss');
  },

  currentDate: function() {
    return moment(new Date()).format('YYYYMMDD');
  },

  stringToDateTime: function(dateString) {
    return moment(dateString, 'YYYY-MM-DD hh:mm:ss').toDate();
  },
  //'YYYY-MM-DD hh:mm:ss'
  stringToDateString: function(dateString, format) {
    return moment(moment(dateString, format).toDate()).format(
      'YYYY.MM.DD. hh:mm:ss',
    );
  },
  diffTimeWithCurrent: function(end) {
    var t2 = Util.stringToDateTime(end);
    var t1 = new Date();
    var diff = t2 - t1;
    var diffTime = {
      hour: moment.duration(diff).hours(),
      minute: moment.duration(diff).minutes(),
      second: moment.duration(diff).seconds(),
    };

    return (
      diffTime.hour + '시간 ' + diffTime.minute + '분 ' + diffTime.second + '초'
    );
  },

  clone: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    var copy = obj.constructor();

    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }

    return copy;
  },
  isY: function(str) {
    if (str === 'Y') {
      return true;
    } else {
      return false;
    }
  },
  isIPhoneX: () => {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;

    const XSMAX_WIDTH = 414;
    const XSMAX_HEIGHT = 896;
    const {height, width} = Dimensions.get('window');
    return Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
      ? (width === X_WIDTH && height === X_HEIGHT) ||
          (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
      : false;
  },
};
