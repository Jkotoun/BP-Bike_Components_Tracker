
import * as React from 'react';
import {  View, Alert } from 'react-native';
import AuthenticatedContext from '../../context';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
export default function ComponentInstallListScreen({navigation}) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const info = { "Distance": "120 km", "Ride Time": '11h 18m', "Condition": "New" }
  const info2 = { "Distance": "548 km", "Ride Time": '36h 10m', "Condition": "Good" }

  const images = {
    chain: require("../assets/images/chain_icon.png"),
    fork: require("../assets/images/bicycle_fork_icon.png")
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 5, alignItems: 'center', flex: 9 }}>
        <Card title="Fox 34 float rhythm" description="Fork" description2="Not installed" displayInfo={info2} icon={images.fork}  onPress={() => { navigation.navigate('ComponentInstallFormScreen')}}></Card>
      </View>
     {/* <View style={{ position: 'absolute', right: 0, bottom: 0, paddingVertical: 30, paddingHorizontal: 20, zIndex: 99 }}>
        <FAB
    style={{  
    backgroundColor:"#F44336"}}
    icon="plus"
    onPress={() => navigation.navigate("AddComponentScreen")}
  />
      </View> */}
    </View>
  );
} 