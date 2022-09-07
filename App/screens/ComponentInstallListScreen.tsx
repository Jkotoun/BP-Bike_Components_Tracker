
import * as React from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import Card from '../components/Card';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import { useIsFocused } from "@react-navigation/native";
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
import { rideSecondsToString, rideDistanceToString } from '../modules/helpers'
import ComponentIcons from "../modules/componentIcons";

import { FAB } from 'react-native-paper';

//load components, which are not installed on any bike
async function loadComponents(loggedUser) {
  let componentsArray = []
  let componentsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "components"), where("user", "==", doc(getFirestore(firebaseApp), "users", loggedUser.uid)), where("state", "==", "active")))
  componentsDocRef.forEach(component => {
    let componentData = component.data()
    if (!componentData.bike) {
      componentData.id = component.id
      componentsArray.push(componentData)
    }
  })
  return componentsArray
}




export default function ComponentInstallListScreen({ navigation }) {
  const isFocused = useIsFocused();
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);

  React.useEffect(() => {
    loadComponents(User).then((componentsArray) => {
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

      </View>
    )
  }
  else {
    return (

      <View style={styles.mainContainer}>
        <ScrollView >
          <View style={styles.componentCards}>
            {components.map(component => {
              return <Card title={component.name} description={component.type.displayName} icon={ComponentIcons[component.type.value]} displayInfo={{
                "Distance": rideDistanceToString(component.rideDistance + component.initialRideDistance),
                "Ride Time": rideSecondsToString(component.rideTime + component.initialRideTime)
              }} onPress={() => {
                navigation.navigate('ComponentInstallFormScreen', {
                  componentId: component.id
                })
              }}  ></Card>
            })}
          </View>
        </ScrollView>
        <View style={styles.addButtonContainer}>
          <FAB
            style={{
              backgroundColor: "#F44336"
            }}
            icon="plus"
            onPress={() => navigation.navigate("AddComponentScreen")}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  componentCards: {
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
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

