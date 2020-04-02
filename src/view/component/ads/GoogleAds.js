import firebase from 'react-native-firebase';
import {Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';

const iosadid = 'ca-app-pub-3940256099942544/1712485313';
// const iosadid = 'ca-app-pub-4617417488766253/1857174593';
const andadid = 'ca-app-pub-7452031807230982/6354902352';
// const andadid = 'ca-app-pub-4617417488766253/6682960013';

export default class GoogleAds {
  constructor(onAdLoaded, onRewarded) {
    this.state = {
      watching: false,
      watchable: false,
      loading: false,
    };
    this.onAdLoaded = onAdLoaded;
    this.onRewarded = onRewarded;

    if (Platform.OS === 'ios') {
      console.log('constructor ios ' + iosadid);
      this.doLoad();
    } else {
      console.log('constructor android ' + andadid);
      this.advert = firebase.admob().rewarded(andadid);
      this.doLoad();
      this.advert.on('onAdLoaded', this.adLoaded);
      this.advert.on('onRewarded', this.rewarded);
      this.advert.on('onAdFailedToLoad', this.adFailedToLoad);
    }
  }

  doLoad = () => {
    if (this.state.loading === true) {
      return;
    }
    this.state.loading = true;
    console.log('doLoad');

    if (Platform.OS === 'ios') {
      console.log('doLoad ios1');
      this.advert = null;
      this.advert = firebase.admob().rewarded(iosadid);
      console.log('doLoad ios2');
      console.log('doLoad ios3');
      const request = new firebase.admob.AdRequest();
      request.addKeyword('foo').addKeyword('bar');
      this.advert.loadAd(request.build());
      console.log('doLoad ios4');
      this.advert.on('onAdLoaded', this.adLoaded);
      this.advert.on('onRewarded', this.rewarded);
      this.advert.on('onAdFailedToLoad', this.adFailedToLoad);
    } else {
      const request = new firebase.admob.AdRequest();
      this.advert.loadAd(request.build());
    }

    this.state.watchable = false;
  };

  adLoaded = () => {
    console.log('adLoaded');
    this.state.watchable = true;
    this.onAdLoaded();
    if (this.state.watching === true) {
      this.state.watching = false;
      this.show();
    }
    this.state.loading = false;
  };
  rewarded = () => {
    console.log('rewarded');
    this.state.watching = false;
    this.onRewarded();
    if (Platform.OS === 'ios') {
      this.state.watching = true;
      this.state.watchable = false;
      this.state.loading = false;
      return;
    }
    this.doLoad();
  };

  adFailedToLoad = errcode => {
    Actions.refresh();
    this.state.watching = true;
    this.state.watchable = false;
    this.state.loading = false;

    console.log('adFailedToLoad ' + errcode);
  };

  show = () => {
    console.log('show');
    if (this.state.watching === true) {
      this.doLoad();
      return;
    }
    if (this.state.watching === false && this.state.watchable === true) {
      this.state.watchable = false;
      this.advert.show();
    } else {
      console.log(JSON.stringify(this.state));
    }
    this.state.watching = true;
  };
}
