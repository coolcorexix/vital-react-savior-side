import { AppRegistry } from 'react-native';
import MainPage from './CustomPages/MainPage';
import LogInPage from './CustomPages/LogInPage';
import HistoryPage from './CustomPages/HistoryPage';
import App from './App';

AppRegistry.registerComponent('LogIn', () => LogInPage);
AppRegistry.registerComponent('Main', () => MainPage);
AppRegistry.registerComponent('History', () => HistoryPage);
AppRegistry.registerComponent('VitalReactSaviorSide', () => App);
