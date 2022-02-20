
import * as React from 'react';
import {View, Alert, StyleSheet } from 'react-native';

import WearRecordCard from '../components/WearRecordCard';
import { FAB } from 'react-native-paper';
export default function ComponentWearHistoryScreen() {


  const image = require("../assets/images/default.jpg")
  return (
    <View style={styles.mainContainer}>
      <WearRecordCard maintext='410 km, 50 h' description='40% wear' image={image} />
      <WearRecordCard maintext='200 km, 50 h' description='10% wear' image={image} />
      <WearRecordCard maintext='5 km, 0 h' description='1% wear' image={image} />
      <View style={styles.addButtonContainer}>
        <FAB
          style={styles.addButton}
          icon="plus"
          onPress={() => Alert.alert("TODO add wear history form")}
        />
      </View>
    </View>


  );
}

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  addButtonContainer: {
    position: 'absolute', 
    right: 0, 
    bottom: 0, 
    paddingVertical: 30, 
    paddingHorizontal: 20, 
    zIndex: 99 
  },
  addButton:{
    backgroundColor: "#F44336"
  }
})
