
import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import Card from '../components/Card';
import { FAB } from 'react-native-paper';
export default function BikesListScreen({ navigation }) {
 

  const info = { "Distance": "43 km", "Ride Time": '11h 18m', "Elevation gain": "872 m" }
  const info2 = { "Distance": "73 km", "Ride Time": "4h 12m", "Elevation gain": '1234 m' }

  const images = {
    route: require("../assets/images/route_icon.png"),
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.rideCardsContainer}>
        <Card title="Traily Jedovnice" description2="Bike: Canyon MTB" icon={images.route} displayInfo={info} onPress={() => { navigation.navigate('RideDetail') }}></Card>
        <Card title="Odpolední projížďka" description2="BIke not assigned" displayInfo={info2} icon={images.route} onPress={() => { navigation.navigate('RideDetail') }}></Card>
      </View>
      <View style={styles.addButtonContainer}>
        <FAB style={styles.addButton} icon="plus" onPress={() => navigation.navigate("AddRideScreen")}/>
      </View>
    </View>
  );
} 

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  rideCardsContainer:{
    marginTop: 5, 
    alignItems: 'center', 
    flex: 9
  },
  addButtonContainer:{
    position: 'absolute', 
    right: 0, 
    bottom: 0, 
    paddingVertical: 30, 
    paddingHorizontal: 20, 
    zIndex: 99
  },
  addButton:{
    backgroundColor:"#F44336"
  }
})