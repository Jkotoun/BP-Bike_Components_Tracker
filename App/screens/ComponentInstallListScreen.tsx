
import * as React from 'react';
import {  View, StyleSheet } from 'react-native';
import Card from '../components/Card';
export default function ComponentInstallListScreen({navigation}) {

  const info2 = { "Distance": "548 km", "Ride Time": '36h 10m', "Condition": "Good" }

  const images = {
    chain: require("../assets/images/chain_icon.png"),
    fork: require("../assets/images/bicycle_fork_icon.png")
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.componentCards}>
        <Card title="Fox 34 float rhythm" description="Fork" description2="Not installed" displayInfo={info2} icon={images.fork}  onPress={() => { navigation.navigate('ComponentInstallFormScreen')}}></Card>
      </View>
    </View>
  );
} 
const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  componentCards:{
    marginTop: 5, 
    alignItems: 'center', 
    flex: 9
  }
})

