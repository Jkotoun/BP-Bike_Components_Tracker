
import * as React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import firebaseApp from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import {rideSecondsToString} from '../modules/helpers';


async function loadComponent(componentId) {
  let component = await getDoc(doc(getFirestore(firebaseApp), "components", componentId))
  return component.data()
}

export default function ComponentDetails({ route }) {

  React.useEffect(() => {
    loadComponent(route.params.componentId).then((component) => {
      setComponent(component)
      setIsLoaded(true)
    })
  }, [])

  const [component, setComponent] = React.useState(Object);
  const [isLoaded, setIsLoaded] = React.useState(false);

  if (!isLoaded) {
    return (
      <View style={styles.loadContainer}>

        <ActivityIndicator size="large" color="#F44336" />

      </View>
    )
  }
  else {
    const componentInfo = {
      'Component Name': component.name,
      'Component type': component.type.label,
      'Brand': component.brand,
      'Model': component.model,
      'Distance': ((component.rideDistance+component.initialRideDistance)/1000).toFixed(2) + " km",
      'Ride Time':rideSecondsToString(component.rideTime + component.initialRideTime)
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          {
            Object.entries(componentInfo).map((prop, value) => {
              return (
                <View style={styles.itemContainer}>

                  <View style={styles.propertyNameContainer}>
                    <Text style={styles.propertyTextContainer}>{prop[0]}</Text>
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
    );
  }
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
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 15
  },
  propertyNameContainer: {
    flex: 1
  },
  propertyTextContainer: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  propertyValueContainer: {
    flex: 1
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }


})
