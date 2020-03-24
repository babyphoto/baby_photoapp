import moment from 'moment';

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
};
