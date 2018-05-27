import React, {Component} from 'react';
import {View, Button, Text, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SlidingUpPanel from 'rn-sliding-up-panel';

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
    borderRadius: 10,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start', backgroundColor:'#34495e'
  }
}

export default class HistoryPage extends Component {
  state = {
    touched: false,
    visible: false
  }

  render() {
    return (
      <View style={styles.container}>



      </View>
    )
  }
}
