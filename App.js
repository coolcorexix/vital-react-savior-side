/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';
import MainPage from './CustomPages/MainPage';
import LogInPage from './CustomPages/LogInPage';
import HistoryPage from './CustomPages/HistoryPage';
import store from './store';
import { Provider } from 'react-redux';
import {StackNavigator} from 'react-navigation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  render() {
    const MainStack= StackNavigator({
      Welcome: {screen: LogInPage},
      Main: {screen: MainPage}
    },{
      initialRouteName: "Welcome",
      navigationOptions: ({navigation}) => ({
          header: null})
    });
    return (
      <Provider store={store}>
        <View style={{flex:1}}>
          <StatusBar
            backgroundColor="#34495e"
            barStyle="light-content"
          />
          <MainStack/>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
