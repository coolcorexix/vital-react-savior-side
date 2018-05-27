import React, {Component} from 'react'
import {TextInput, Text, View, TouchableOpacity, Animated, Easing, Dimensions} from 'react-native'
import  PropTypes from 'prop-types'
class AdvancedTextInput extends Component{
    constructor(){
      super();
      this.placeholderValue = new Animated.Value(33);
      this.state={
        txtValue:''
      };
    }
    componentDidMount(){
    }

    placeholderShrink(obj){
      Animated.timing(this.placeholderValue,
        {
        toValue: 10,
        duration: 500
      }).start();
    }
    placeholderExpand(obj){
      Animated.timing(this.placeholderValue,
      {
        toValue:33,
        duration: 700
      }).start();
    }
    render(){
      const{placeholder, expand, shrink} = this.props;
      return(
        <TouchableOpacity activeOpacity={1} onPress={()=>{
            this.placeholderShrink();
            this.txtInp.focus();
        }}>
          <View style={{backgroundColor: 'white',alignItems:'stretch', height: Dimensions.get('window').height*0.1, width:Dimensions.get('window').width* 0.6, borderRadius: 2}}>

                <Animated.Text style={{ margin: 5, textAlign:'center', fontFamily:'helveticaneuelight', fontSize: this.placeholderValue}}>{this.props.placeholder}</Animated.Text>
                <TextInput keyboardType='numeric' style={{textAlign:'center', fontSize:20, fontFamily:'helveticaneuelightitalic'}} onBlur={()=>{
                        if(this.state.txtValue=='')
                        {
                        this.placeholderExpand(this)}}}
                        value={this.state.txtValue}
                        onChangeText={text=>this.setState({txtValue: text})}
                        onPress={()=>this.placeholderShrink(this)}
                        ref={ref=>this.txtInp = ref}/>

          </View>
        </TouchableOpacity>
      )
    }
}
AdvancedTextInput.propTypes={
  placeholder: PropTypes.string.isRequired
}
export default AdvancedTextInput;
