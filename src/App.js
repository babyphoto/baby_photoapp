/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Router, Scene, Modal, Overlay, Stack} from 'react-native-router-flux';
import Main from './view/Main';
import {Color} from './view/common/Color';
import Login from './view/Login';
import FileList from './view/group/FileList';
import FileDetailWapper from './view/group/FileDetailWapper';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  stateHandler = (prevState, newState, action) => {
    // console.log('onStateChange: ACTION:', action);
  };

  render() {
    return (
      <Router onStateChange={this.stateHandler} sceneStyle={styles.scene}>
        <Overlay key="overlay">
          <Modal key="modal" hideNavBar>
            <Stack key="home_stack" hideNavBar>
              <Scene key="main" title="main" component={Main} />
              <Scene key="fileList" title="fileList" component={FileList} />
              <Scene
                key="fileDetail"
                title="fileDetail"
                component={FileDetailWapper}
              />
            </Stack>
            <Stack key="login_stack" initial hideNavBar>
              <Scene key="login" title="login" initial component={Login} />
            </Stack>
          </Modal>
        </Overlay>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: Color.cffffff,
  },
  back: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  tabBarStyle: {
    backgroundColor: '#eee',
    height: 56,
  },
});
