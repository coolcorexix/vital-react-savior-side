import RNFirebase from 'react-native-firebase'
const configurationOptions = {
  debug: true,
  databaseURL: 'https://vitalreact-87a81.firebaseio.com/'
}
const firebase = RNFirebase.initializeApp();
var firebaseDbh = firebase.database();
module.export = firebaseDbh;
export default firebase;
