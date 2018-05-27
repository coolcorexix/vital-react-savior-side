import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Dimensions,
  PermissionsAndroid,
  Button, Image, Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../Firebase/config/firebase';
import * as OperatingActions from '../Redux/Actions/OperatingActions';

const icons = {
  key: 'key',
  wheel:'wrench'
}

//google map api
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

//redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as VictimActions from '../Redux/Actions/VictimActions';
import * as MapViewActions from '../Redux/Actions/MapViewAction';

Geocoder.setApiKey('AIzaSyA_hy3y7YHkmBPghmhXam_uKBrnQvcblJk');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

let { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 10.762622;
const LONGITUDE = 106.660172;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class CustomMapView extends Component{
  constructor() {
    super();
    this.state = {
      currentPos: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markedSpot: {
        latitude: 0,
        longitude: 0,
      },
      initScreenRegion:{
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    };
  }
  async requestLocationPermission(){
    try {
      const grantedFineLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Vital React Fine Location Requirement',
          'message': 'Vital React need to enable your exact location:' + 'so we can know excatly where you are'
        }
      );
      if (grantedFineLocation === PermissionsAndroid.RESULTS.GRANTED)
      {
        const grantedCoarseLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            'title': 'And coarse location also, please',
            'message': `In case we can't indentify your exact location, at least we can narrow it down`
          }
        )
        if (grantedCoarseLocation===PermissionsAndroid.RESULTS.GRANTED)
          return true;
        else return false;
      };
    } catch (err){
      throw err;
    }
  }
  async componentDidMount() {
    const granted = await this.requestLocationPermission();
    if (granted == true)
    {
      //here
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
          this.setState({
            currentPos: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
          });
        },
      (error) => alert(error.message),
      {timeout: 20000, maximumAge: 10000, DistanceFilter: 50 },
      );
      this.watchID = navigator.geolocation.watchPosition(
        position => {
          this.setState({
            currentPos: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
          });
        }
      );
    }
    else {
      alert ("Location transparency is not enabled");
    }
 }
 renderVictimMarker(){
   setTimeout(()=>{
     this.map.animateToCoordinate(this.props.victimLocation, 500);
   }, 10);
   return (<MapView.Marker coordinate={this.props.victimLocation}>


                <MapView.Callout tooltip={true} onPress={()=>{  alert('Tuyệt vời!!');
                  firebase.database().ref(`OnlineSavior/${this.props.saviorPhone}/status`).set('online');
                  firebase.database().ref(`OnlineSavior/${this.props.saviorPhone}/Victim/`).set(null);
                  firebase.database().ref(`OnlineUsers/${this.props.victimId}/status`).set('finished');
                  this.props.drawMarkerState(false);
                  this.props.retrieveAddressVictim("");
                  this.props.retrieveVictimId(undefined);}}>
                  <View style={{flex:1, elevation: 5, borderRadius: 4, justifyContent:'center', alignItems:'center', borderWidth:2, backgroundColor:'white', backgroundColor:'#2ecc71', borderColor: '#2ecc71'}}>
                    <Text style={{fontSize: 15, color:'white'}}>{this.props.victimAddress}</Text>
                    <Icon name={icons[this.props.victimAccident]?icons[this.props.victimAccident]:'plus-square'} color='white' size={35}/>
                    <Text style={{color: 'white', fontSize: 20, margin:2, fontFamily:'helveticaneuecondensedbold'}}>S.đ.t: {this.props.victimPhone}</Text>
                    <Text style={{color: 'white', margin:2, fontFamily:'helveticaneuelightitalic'}}>Chạm vào để thông báo hoàn tất</Text>
                  </View>
                </MapView.Callout>
            </MapView.Marker>)
 }

 componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  render() {
    // onPress={(event) =>{
    //
    //   this.props.coordinateRetrieve({coordinates: {lat: event.nativeEvent.coordinate.latitude, long: event.nativeEvent.coordinate.longitude}});
    //   this.setState(
    //     {markedSpot:{
    //         latitude: event.nativeEvent.coordinate.latitude,
    //         longitude: event.nativeEvent.coordinate.longitude
    //       },
    //       currentPos: {
    //           latitude: event.nativeEvent.coordinate.latitude,
    //           longitude: event.nativeEvent.coordinate.longitude,
    //           latitudeDelta: LATITUDE_DELTA,
    //           longitudeDelta: LONGITUDE_DELTA
    //         }
    //     });
    //   Geocoder.getFromLatLng(this.state.markedSpot["latitude"], this.state.markedSpot["longitude"]).then(
    //     json => {
    //       var street_number = json.results[0].address_components[0];
    //       var route = json.results[0].address_components[1];
    //       this.props.retrieveAddress({address: street_number.long_name + " " + route.long_name})
    //     },
    //     error => {
    //       alert(error);
    //     }
    //   );
    // }}
              //<MapView.Marker coordinate={this.state.markedSpot}/>

    return (
      <View style ={styles.container}>
          <MapView
            ref={ref=>this.map=ref}
            style={styles.map}
            showsUserLocation={ true }
            initialRegion={this.state.currentPos}
            region={this.state.currentPos}
          >
          {this.props.drawMarker&&this.renderVictimMarker()}

          </MapView>
        </View>
    );
  }
}

function mapStateToProps(state){
  return {
    isOnline: state.statusReducer.isOnl,
    victimPhone: state.victimReducer.phone,
    victimAccident: state.victimReducer.accident,
    victimLocation: state.victimReducer.coordinates,
    victimAddress: state.victimReducer.address,
    victimId: state.victimReducer.id,
    drawMarker: state.statusReducer.drawMarker,
    saviorPhone: state.saviorReducer.phone
  }
}

function mapDispatchToProps(dispatch){
  var operatingAct = bindActionCreators(OperatingActions, dispatch);
  var victimAct = bindActionCreators(VictimActions, dispatch);
  var mapViewAct = bindActionCreators(MapViewActions, dispatch);
  return Object.assign({}, victimAct, mapViewAct, operatingAct);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(CustomMapView);
