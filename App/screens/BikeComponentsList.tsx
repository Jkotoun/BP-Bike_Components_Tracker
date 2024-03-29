
import * as React from 'react';
import { View, Alert, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
import { FAB } from 'react-native-paper';
import Card from '../components/Card';
import firebaseApp from '../config/firebase';
import { rideSecondsToString, rideDistanceToString } from '../modules/helpers';
import ComponentIcons from "../modules/componentIcons";

import { useIsFocused } from "@react-navigation/native";


async function loadComponents(bikeId) {
  let componentsArray = []
  let componentsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "components"), where("bike", "==", doc(getFirestore(firebaseApp), "bikes", bikeId))))
  componentsDocRef.forEach(component => {
    let componentData = component.data()
    componentData.id = component.id
    componentsArray.push(componentData)
  })
  return componentsArray
}


export default function BikeComponentsList({ navigation, route }) {

  const isFocused = useIsFocused();

  React.useEffect(() => {
    setIsLoaded(false)
    loadComponents(route.params.bikeId).then((componentsArray) => {
      setComponents(componentsArray)
      setIsLoaded(true)
    })

  }, [isFocused])
  
  const [components, setComponents] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);





  if (!isLoaded) {
    return (
      <View style={styles.loadContainer}>

        <ActivityIndicator size="large" color="#F44336" />
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("ComponentInstallListStack")}
          />
        </View>
      </View>)
  }
  else {

    return (
      <View style={styles.mainContainer}>
        <ScrollView >
          <View style={styles.componentCardsContainer}>
          {components.length == 0 && <Text style={{padding:20, fontSize:17, fontWeight:'700'}}>No components currently installed</Text>}
            
            {components.map(component => {
              
              let componentOptions = [
                {
                  text: "Uninstall",
                  onPress: () => navigation.navigate("ComponentUninstallFormScreen", {
                    componentId: component.id,
                    bikeId: route.params.bikeId
                  })
                }
              ]
              return <Card options={componentOptions} title={component.name} description={component.type.displayName} icon={ComponentIcons[component.type.value]} displayInfo={{
                "Distance": rideDistanceToString(component.rideDistance + component.initialRideDistance),
                "Ride Time": rideSecondsToString(component.rideTime + component.initialRideTime)

              }} onPress={() => navigation.navigate("ComponentDetail", { componentId: component.id, componentName: component.name})}></Card>
            })}
          </View>
        </ScrollView>
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("ComponentInstallListStack")}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  componentCardsContainer: {
    marginTop: 5,
    alignItems: 'center',
    flex: 9,
    paddingHorizontal: 10

  },
  addButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingBottom: 30,
    paddingRight: 20,
    zIndex: 99
  },
  addButton: {
    backgroundColor: "#F44336"
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})


