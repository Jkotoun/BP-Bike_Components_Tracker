
import * as React from 'react';
import {  View, StyleSheet } from 'react-native';

import Card from '../components/Card';
import { FAB } from 'react-native-paper';
export default function AllComponentsListScreen({navigation}) {


  const info = { "Distance": "120 km", "Ride Time": '11h 18m', "Condition": "New" }
  const info2 = { "Distance": "548 km", "Ride Time": '36h 10m', "Condition": "Good" }

  const images = {
    chain: require("../assets/images/chain_icon.png"),
    fork: require("../assets/images/bicycle_fork_icon.png")
  };

  return (
    <View style={Styles.mainContainer}>
      <View style={Styles.cardsContainer}>
        <Card title="Shimano SLX chain" description="Chain" description2="Installed on: Canyon MTB" icon={images.chain} displayInfo={info}  onPress={() => { navigation.navigate('ComponentDetail') }}  ></Card>
        <Card title="Fox 34 float rhythm" description="Fork" description2="Not installed" displayInfo={info2} icon={images.fork}  onPress={() => { navigation.navigate('ComponentDetail')}}></Card>
      </View>
     <View style={Styles.addButtonContainer}>
        <FAB
    style={{  
    backgroundColor:"#F44336"}}
    icon="plus"
    onPress={() => navigation.navigate("AddComponentScreen")}
  />
      </View>
    </View>
  );
} 

const Styles = StyleSheet.create({
  mainContainer:{
    flex: 1
  },
  cardsContainer:{
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
  }
})