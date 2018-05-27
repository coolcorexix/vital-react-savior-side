import React, {Component} from 'react';
import {Text, TouchableHighlight, View, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';

class CustomButton extends Component{
  constructor(props){
    super(props);
    this.state = {pressStatus: false};
  }
  _onHideUnderlay(){
    this.setState({pressStatus: false});
  }
  _onShowUnderlay(){
    this.setState({pressStatus: true});
  }
  render(){

    const {text, onPress, iconUri,fontFamily} = this.props;
    return(
      <TouchableHighlight style={(this.state.pressStatus==true)?[styles.generalStyle, {backgroundColor:this.props.colorPress}]:[styles.generalStyle,{backgroundColor:this.props.colorUnpress}]}
      activeOpacity={1}
      onPress = {()=>this.props.onPress()}
      onHideUnderlay={this._onHideUnderlay.bind(this)}
      onShowUnderlay={this._onShowUnderlay.bind(this)}>
        <View style={{flexDirection:'row', flex: 1, alignItems:'center'}}>
          <Image style={(this.props.iconUri!=undefined)?(styles.icon):{}} source={{uri: this.props.iconUri}}/>
          <Text style={(this.props.text!=undefined)?[styles.textStyle,{fontFamily: this.props.fontFamily}]:[styles.textStyle, {flex:0}]}>{this.props.text}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

CustomButton.propTypes = {
  fontFamily: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  colorPress: PropTypes.string.isRequired,
  colorUnpress: PropTypes.string.isRequired,
  iconUri: PropTypes.string
}

const styles = StyleSheet.create({
  icon:{
    flex: 1,
    resizeMode: 'contain',
    height:'100%',
    marginLeft: '10%'
  },
  textStyle: {
	  textAlign: 'center',
    color: '#ffffff',
    flex: 6
  },
  generalStyle:{
    alignItems: 'center',
    justifyContent:'center',
    height: 70,
    margin: 15,
    borderRadius: 5,
  },
});

export default CustomButton;
