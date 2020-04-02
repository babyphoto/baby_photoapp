import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  BackHandler,
  Dimensions,
  Text,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import FileDetail from './FileDetail';
import Swiper from 'react-native-swiper';
export default class FileDetailWapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {fileList, adShowFunc, index} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <Swiper
          style={styles.content_frame}
          showsButtons={true}
          scrollEnabled={false}
          loadMinimal
          loadMinimalSize={1}
          index={(index + 1) % fileList.length}>
          {fileList.map((value, i) => {
            return (
              <FileDetail
                fileInfo={value}
                id={'FileDetail_' + i}
                adShowFunc={adShowFunc}
              />
            );
          })}
        </Swiper>
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
    flexDirection: 'column',
  },
});
