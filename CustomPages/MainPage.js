import React, {Component} from 'react';
import {StyleSheet, View, Button, Text, TouchableOpacity, Dimensions} from 'react-native';
import firebase from '../Firebase/config/firebase';
import CustomMapView from '../CustomComponents/CustomMapView';
import CustomButton from '../CustomComponents/CustomButton';
import ReactNativeAN from 'react-native-alarm-notification';
import * as operatingAction from '../Redux/Actions/OperatingActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import SlidingUpPanel from 'rn-sliding-up-panel';
import * as VictimActions from '../Redux/Actions/VictimActions';
import * as SaviorActions from '../Redux/Actions/SaviorActions';
import * as MapViewAction from '../Redux/Actions/MapViewAction';
//redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Geocoder from 'react-native-geocoding';

Geocoder.setApiKey('AIzaSyA_hy3y7YHkmBPghmhXam_uKBrnQvcblJk');


const styles = StyleSheet.create({
  container2: {
    borderRadius: 15,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start', backgroundColor:'#34495e'
  }
})

class MainPage extends Component{
  state = {
    victimAccident: '',
    touched: false,
    visible: false
  };
  constructor(){
    super();

  }
  renderVictimDialog(){
    return(
      <View style={{position:'absolute', width:'100%', height:'100%', backgroundColor:'#00000090', justifyContent:'center',alignItems:'center', elevation:10}}>
        <View style={{width:'60%', height:'60%', backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
          <Icon name='exclamation-triangle' size={50}/>
          <Text style={{fontFamily:'helveticaneuelightitalic'}}> {this.props.victimAddress}</Text>
          <View style={{flexDirection:'row'}}>
            <Button color='#2ecc71' style={{margin: 10}} onPress={()=>{
              this.props.alertEnabled(false);
              firebase.database().ref(`OnlineUsers/${this.props.victimId}/status`).off();
              firebase.database().ref(`OnlineUsers/${this.props.victimId}/status`).set('accepted');
              firebase.database().ref(`OnlineUsers/${this.props.victimId}/saviorPhone`).set(this.props.saviorPhone);
              firebase.database().ref(`OnlineSavior/${this.props.assignedKey}/status/`).set('busy');
              firebase.database().ref(`OnlineSavior/${this.props.assignedKey}/status/`).on('value', snapshot=>{
                if (snapshot.val() == 'canceled')
                {
                  alert("Dịch vụ đã bị hủy");
                  firebase.database().ref(`OnlineSavior/${this.props.assignedKey}/Victim/`).set(null);
                  firebase.database().ref(`OnlineSavior/${this.props.assignedKey}/status/`).off();
                  firebase.database().ref(`OnlineSavior/${this.props.assignedKey}/status/`).set('online');
                  this.props.drawMarkerState(false);
                  this.props.retrieveAddressVictim("");
                  this.props.retrieveVictimId(undefined);
                }
              })
              this.props.drawMarkerState(true);
            }} title='Chấp nhận'/>
            <Button color='#e74c3c' style={{margin: 10}} onPress={()=>{this.props.alertEnabled(false);}} title='Bỏ qua'/>
          </View>
        </View>
      </View>
    )
  }
  componentDidMount(){
    // var data={
    //   Victim: {status: 'null', fullDetails: undefined, location: null},
    //   phone: this.props.saviorPhone,
    //   coordinates:{
    //     lat: 10.806568193002388,
    //     long: 106.71885687857866
    //   },
    //   status: 'Online'
    // }
    //
    // assignedObject={
    //   key: this.props.assignedKey,
    //   data: data
    // }
    //console.log('result', ref);
  }
  componentWillMount(){
  }
  render(){
    const{navigate} = this.props.navigation;
    return(
      <View style={{flex:1}}>
        <CustomMapView/>
        <View style={{height:'15%', elevation: 3, backgroundColor:'#2c3e50', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity style={{elevation: 9}} onPress={()=>{
            if (this.props.isOnline)
              this.props.isOff(this.props.assignedKey);
            else
            {
              this.props.isOnl({
                key: this.props.assignedKey,
                data: {
                  id: this.props.assignedKey,
                  phone: this.props.saviorPhone,
                  address: this.props.saviorObject.address,
                  coordinate:this.props.saviorObject.coordinates}});
                firebase.database().ref('OnlineSavior/'+this.props.assignedKey+'/Victim/fullDetails').on('value', snapshot=>{
                    firebase.database().ref('OnlineSavior/'+this.props.assignedKey+'/Victim/fullDetails').once('value', snapshot=>{
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
                            alert("Đã có người đảm nhận");
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
            }
          }}>
          <View style={{borderRadius: 10, borderWidth: 2, borderColor:this.props.isOnline?'#2ecc71':'#e74c3c', backgroundColor:this.props.isOnline?'#2c3e50':'#e74c3c'}}>
            <Icon name='power-off' style={{margin: 10, marginBottom:2, marginTop:2}} size={30} color={this.props.isOnline?'#2ecc71':'#ecf0f1'}/>
          </View>
          </TouchableOpacity>
          <View style={{backgroundColor: 'white', margin: 2, borderRadius: 2, flexDirection: 'row'}}>
              <Text style={{color: '#34495e', fontFamily:'helveticaneuelight'}}> Sdt: {this.props.saviorPhone} </Text>
          </View>

        </View>
        <SlidingUpPanel
          showBackdrop={false}
          draggableRange={{top: Dimensions.get('window').height/3, bottom: -50}}
          height={Dimensions.get('window').height/3}
          visible={this.state.visible}
          onRequestClose={() => this.setState({visible: false, touched: false})}>
          <View style={styles.container2}>
            <TouchableOpacity onPress={()=>{
              navigator.geolocation.getCurrentPosition(
                position => {
                  Geocoder.getFromLatLng(position.coords.latitude, position.coords.longitude).then(
                    json => {
                      var street_number = json.results[0].address_components[0];
                      var route = json.results[0].address_components[1];
                      this.props.retrieveAddress({address: street_number.long_name + " " + route.long_name})
                    },
                    error => {
                      alert(error);
                    }
                  );
                  this.props.coordinateRetrieve({coordinates: {lat: position.coords.latitude, long: position.coords.longitude}});
                  this.props.saviorCoordinatesUpdate(true);
                  firebase.database().ref('OnlineSavior/'+this.props.assignedKey).update(...this.props.saviorObject);
                })
            }}>
              <View style={{ marginTop:5, borderRadius: 5, justifyContent:'center', alignItems:'center', backgroundColor:'#3498db', flexDirection:'row'}}>
                <Icon style={{margin: 5}} size={25} color='white' name='map-marker'/>
                <Text style={{fontFamily:'helveticaneuelightitalic', fontSize: 35, color:'white'}}> Cập nhật vị trí </Text>
              </View>
            </TouchableOpacity>
            <View style={{  width:'90%', justifyContent:'space-between', borderRadius: 10, margin: 10, flexDirection: 'row'}}>
              <Text style={{fontFamily:'helveticaneuelightitalic', fontSize: 35, color:'#e67e22'}}> Số dư: </Text>
              <Text style={{color:'#2ecc71', fontFamily:'helveticaneuelightitalic', fontSize: 35, marginRight: 5}}> `4$`</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection:'row'}}>
                <Icon name='key' size={20} color={'#f39c12'}/>
                <Text style={{fontFamily:'helveticaneuelight', color: '#f1c40f'}}>:0</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Icon name='wrench' size={20} color={'#f39c12'}/>
                <Text style={{fontFamily:'helveticaneuelight', color: '#f1c40f'}}>:0</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Icon name='plus-square' size={20} color={'#f39c12'}/>
                <Text style={{fontFamily:'helveticaneuelight', color: '#f1c40f'}}>:0</Text>
              </View>
            </View>
          </View>
        </SlidingUpPanel>
        <TouchableOpacity onPress={() => this.setState({visible: true, touched: true})} style={{position:'absolute', elevation: 10, top:'95%', height:'10%', width: '100%'}}>
          <View style={{flex: 1, opacity: this.state.touched?0:1 , backgroundColor:'#2c3e50', borderRadius:15}}>
          </View>
        </TouchableOpacity>
        {this.props.isAlerted&&this.renderVictimDialog()}
      </View>
    )
  }
}

function mapStateToProps(state){
  return {isOnline: state.statusReducer.isOnl,
          victimAddress: state.victimReducer.address,
          victimId: state.victimReducer.id,
          saviorPhone: state.saviorReducer.phone,
          assignedKey: state.saviorReducer.id,
          saviorObject: state.saviorReducer,
          isAlerted: state.statusReducer.isAlerted
          }
}
function mapDispatchToProps(dispatch){
    var mapAct = bindActionCreators(MapViewAction, dispatch);
    var saviorAct = bindActionCreators(SaviorActions, dispatch);
    var victimAct = bindActionCreators(VictimActions, dispatch);
    var operatingAct =bindActionCreators(operatingAction, dispatch);
    return Object.assign({}, mapAct, victimAct, operatingAct, saviorAct);
}
export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
