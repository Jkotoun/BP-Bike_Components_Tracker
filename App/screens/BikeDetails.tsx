
import * as React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import firebaseApp from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import {formatDate, rideSecondsToString} from '../modules/helpers';

async function loadBike(bikeId) {
  let bike = await getDoc(doc(getFirestore(firebaseApp), "bikes", bikeId))
  return bike.data()
}

export default function BikeDetails({ route }) {

  React.useEffect(() => {
    loadBike(route.params.bikeId).then((bike) => {
      setBike(bike)
      setIsLoaded(true)
    })
  }, [])

  const [bike, setBike] = React.useState(Object);
  const [isLoaded, setIsLoaded] = React.useState(false);


  if (!isLoaded) {
    return (
 
      <View style={styles.loadContainer}>

      <ActivityIndicator size="large" color="#F44336" />

  </View>
 
    )
  }
  else {
  const bikeInfo = {
    'Distance': ((bike.rideDistance + bike.initialRideDistance)/1000).toFixed(2) + " km ",
    'Ride Time': rideSecondsToString(bike.rideTime + bike.initialRideTime),
    'Bike Name': bike.name,
    'Type': bike.type.label,
    'Brand': bike.brand,
    'Model': bike.model,
    
  }
  if(bike.purchaseDate.toDate().getTime() != 0)
  {
    bikeInfo['Purchase date'] = formatDate(bike.purchaseDate.toDate())
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {
          Object.entries(bikeInfo).map((prop, value) => {
            return (
              <View style={styles.detailItemsContainer}>

                <View style={styles.propertyNameContainer}>
                  <Text style={styles.propertyNameText}>{prop[0]}</Text>
                </View>
                <View style={styles.propertyValueContainer}>
                  <Text>{prop[1]}</Text>
                </View>
              </View>
            )
          })
        }
      </View>
    </View>
  )}
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 25
  },
  detailItemsContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 15
  },
  propertyNameContainer: {
    flex: 1
  },
  propertyNameText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  propertyValueContainer: {
    flex: 1
  },
  loadContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  }
})