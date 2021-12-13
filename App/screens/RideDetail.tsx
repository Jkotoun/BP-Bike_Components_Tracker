
import * as React from 'react';
import { Text, View, Button, Alert, Image } from 'react-native';
import AuthenticatedContext from '../../context';

import Card from '../components/Card';



export default function RideDetail() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20, width: "95%" }}>


        <Text style={{ fontSize: 17, fontWeight: '700' }}>Bike: Canyon MTB</Text>
        <Text style={{ fontSize: 17, fontWeight: '700' }}>17. 7. 2021</Text>
      </View>
      <View style={{ paddingHorizontal: 20, paddingBottom:5, elevation: 5 }}>
        <Image source={require("./../assets/images/ridemap.png")} style={{ width: "100%", height: 200, borderRadius: 4 }} />
      </View>

      <View style={{ width: '90%', padding: 5, flexDirection: 'column', backgroundColor: "#FDFDFD", margin: 4, elevation: 2, borderRadius: 3, display: 'flex', alignSelf: 'center' }}>
        <View style={{flexDirection:'row', display:'flex', paddingVertical:10}}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>43 km</Text>
            <Text style={{ color: "#696969" }}>Distance</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>1 148 m</Text>
            <Text style={{ color: "#696969" }}>Elevation gain</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>5h 11m</Text>
            <Text style={{ color: "#696969" }}>Ride time</Text>
          </View>
        </View>
        <View style={{flexDirection:'row', display:'flex',  paddingVertical:10}}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>57 km/h</Text>
            <Text style={{ color: "#696969" }}>Max speed</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>8.6 km/h</Text>
            <Text style={{ color: "#696969" }}>Average speed</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>7h 42m</Text>
            <Text style={{ color: "#696969" }}>Elapsed time</Text>
          </View>
        </View>
          <Text style={{alignSelf:'flex-end', color:"#F44336", fontWeight:"bold", paddingTop:7, paddingBottom:8, fontSize:14, paddingRight:10}}>View in strava</Text>
      </View>
    </View>

  )
} 
