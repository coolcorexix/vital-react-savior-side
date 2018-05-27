import React, {Component} from 'react';
import {View, Button, Text, Dimensions, TouchableOpacity, Image, Keyboard, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../Firebase/config/firebase';
import CustomButton from '../CustomComponents/CustomButton';
import * as operatingAction from '../Redux/Actions/OperatingActions';
import * as SaviorActions from '../Redux/Actions/SaviorActions';
import * as MapviewActions from '../Redux/Actions/MapViewAction';
import * as VictimActions from '../Redux/Actions/VictimActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Geocoder from 'react-native-geocoding';
import ReactNativeAN from 'react-native-alarm-notification';
import AdvancedTextInput from '../CustomComponents/AdvancedTextInput';

Geocoder.setApiKey('AIzaSyA_hy3y7YHkmBPghmhXam_uKBrnQvcblJk');

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#34495e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
    borderRadius: 10,
    flex: 1,
    backgroundColor: '#34495e',
    alignItems: 'center',
    justifyContent: 'center', backgroundColor:'#34495e'
  }
}

class LogInPage extends Component {
  state={
    phoneValue: ''
  }
  checkRegistered =async(keyboardValue) => {
    var registered= false;
    const registeredRef = firebase.database().ref('RegisteredSavior').once('value', snapshot=>{
      for (var k in snapshot.val())
      {
        if (keyboardValue == snapshot.val()[k])
        {
          registered = true;
          return registered;}
      }
    }).then(()=>{return registered});
    return registeredRef;

  }
  render() {
    // <View style={{backgroundColor: 'white', borderRadius: 2, width:'60%',  justifyContent:'center', alignItems:'stretch', margin: 10}}>
    //                    <TextInput keyboardType='numeric' value={this.state.phoneValue} onChangeText={value=>this.setState({phoneValue: value})} underlineColorAndroid='transparent' style={{flex: 1, textAlign:'center'}}
    //                     placeholder='Số điện thoại liên lạc' style={{color:'#34495e',  fontFamily:'helveticaneuelightitalic'}}/>
    // </View>
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Image style={{width:200,
                            height:200,
                            marginBottom: 10,
                            resizeMode:'contain'}} source={{uri :'https://i.imgur.com/bFSaiXY.png'}}/>

         <AdvancedTextInput ref={ref=>this.advInp=ref} placeholder='số điện thoại' expand={40} shrink={10} style={{height:'10%', width:'30%'}}/>
        <CustomButton colorUnpress='#f1c40f' colorPress='#f39c12' fontFamily='helveticaneuelightitalic' text='Đăng nhập'
        //Still need work on the verification
         onPress={()=>{
          Keyboard.dismiss();
          if (this.advInp.state.txtValue== '')
            {
              alert('Xin điền số điện thoại');
              return;
            }



          const keyboardValue = this.advInp.state.txtValue;

          this.props.saviorPhoneRetrieve(keyboardValue);
          if (this.props.toEdit)
          {
            firebase.database().ref('OnlineSavior/'+this.props.id).update({phone: keyboardValue});
            navigate('Main');
            return;
          }
          this.checkRegistered(keyboardValue).then((result)=>
          {
            console.log(result);
            if (result)
            {
            navigator.geolocation.getCurrentPosition(
              position => {
                var ref = firebase.database().ref('OnlineSavior/'+ keyboardValue).set({phone: keyboardValue});
                this.props.saviorIdRetrieve(keyboardValue);
                Geocoder.getFromLatLng(position.coords.latitude, position.coords.longitude).then(
                  json => {
                    var street_number = json.results[0].address_components[0];
                    var route = json.results[0].address_components[1];
                    this.props.retrieveAddress({address: street_number.long_name + " " + route.long_name});
                    this.props.coordinateRetrieve({coordinates: {lat: position.coords.latitude, long: position.coords.longitude}});
                    this.props.saviorCoordinatesUpdate(true);
                    firebase.database().ref('OnlineSavior/'+keyboardValue).update({...this.props.saviorObject});
                    this.props.isOnl({
                      key: keyboardValue,
                      data: {
                        id: keyboardValue,
                        phone: keyboardValue,
                        address: street_number.long_name + " " + route.long_name,
                        coordinate:{
                          long: position.coords.longitude,
                          lat: position.coords.latitude
                        }}});
                      firebase.database().ref('OnlineSavior/'+keyboardValue+'/Victim/fullDetails').on('value', snapshot=>{
                          firebase.database().ref('OnlineSavior/'+keyboardValue+'/Victim/fullDetails').once('value', snapshot=>{
                            console.log(snapshot.val());
                          })
                          if (snapshot.val() != null)
                          {
                            console.log('details', snapshot.val());
                            this.props.alertEnabled(true);
                            this.props.retrieveAccidentVictim(snapshot.val().accident);
                            this.props.retrieveVictimId(snapshot.val().info.id);
                            this.props.retrievePhoneVictim(snapshot.val().info.phone);
                            this.props.retrieveAddressVictim(snapshot.val().address);
                            this.props.retrieveLocationVictim(snapshot.val().coordinates);
                            firebase.database().ref(`OnlineUsers/${snapshot.val().info.id}/status`).on('value', snapshot=>{
                              if (snapshot.val()=='accepted')
                                {
                                  alert("Thông báo","Đã có người đảm nhận");
                                  this.props.alertEnabled(false);
                                }
                              if (snapshot.val()=='online')
                                    {
                                      alert("Đã hết hạn");
                                      this.props.alertEnabled(false);
                                    }
                            });
                            const alarmNotifData = {
                                id: "12345",                                  // Required
                                title: "Vital React",               // Required
                                message: "Có người gặp nạn",           // Required
                                ticker: "My Notification Ticker",
                                auto_cancel: true,                            // default: true
                                vibrate: true,
                                vibration: 100,                               // default: 100, no vibration if vibrate: false
                                small_icon: "ic_launcher",                    // Required
                                large_icon: "ic_launcher",
                                play_sound: true,
                                sound_name: null,                             // Plays custom notification ringtone if sound_name: null
                                color: "red",
                                schedule_once: true,                          // Works with ReactNativeAN.scheduleAlarm so alarm fires once
                                tag: 'some_tag'
                            };
                            ReactNativeAN.sendNotification(alarmNotifData);
                          };

                        })
                    navigate('Main');
                  },
                  error => {
                    alert(error);
                  }
                );
              });
          }
          else alert("số điện thoại chưa được đăng kí, xin hãy liên lạc số điện thoại 0984388497 để đăng kí");}
        )
      }}/>
      </View>
    )
  }
}

function mapStateToProps(state){
  return{
    id: state.saviorReducer.id,
    toEdit: state.statusReducer.editPhone
  }
}
function mapDispatchToProps(dispatch){
    var victimAct = bindActionCreators(VictimActions, dispatch);
    var mapviewAct = bindActionCreators(MapviewActions, dispatch);
    var operatingAct = bindActionCreators(operatingAction, dispatch);
    var saviorAct = bindActionCreators(SaviorActions, dispatch);
    return Object.assign({}, mapviewAct, operatingAct, saviorAct, victimAct);
}
export default connect(mapStateToProps, mapDispatchToProps)(LogInPage);
