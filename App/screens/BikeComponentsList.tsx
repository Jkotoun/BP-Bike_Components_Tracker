
import * as React from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
import { FAB } from 'react-native-paper';
import Card from '../components/Card';
import firebaseApp from '../config/firebase';
async function loadComponents(bikeId) {
  let componentsArray = []
  let componentsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "components"), where("bike", "==", doc(getFirestore(firebaseApp), "bikes", bikeId))))
  componentsDocRef.forEach(component => {
    let componentData = component.data()
    componentData.id = component.id
    componentsArray.push(componentData)
  })


  const promises = componentsArray.map(async comp => {
    if (comp.bike) {
      comp.bike = (await getDoc(comp.bike)).data()
    }
    return comp
  })
  const componentsWithBikeObj = await Promise.all(promises)
  return componentsWithBikeObj
}


export default function BikeComponentsList({ navigation, route }) {
  console.log(route)
  React.useEffect(() => {
 
    loadComponents(route.params.bikeId).then((componentsArray) => {
      setComponents(componentsArray)
      setIsLoaded(true)
    })
  }, [])
  const [components, setComponents] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const images = {
    chain: require("../assets/images/chain_icon.png"),
    fork: require("../assets/images/bicycle_fork_icon.png")
  };


  const componentOptions = [
    {
      text: "Uninstall",
      onPress: () => navigation.navigate("ComponentUninstallFormScreen")
    },
    {
      text: "Edit",
      onPress: () => Alert.alert("Edit")
    },
    {
      text: "Delete",
      onPress: () => Alert.alert("Delete")
    }

  ]
  if (!isLoaded) {
    return (<Text>Loading...</Text>)
  }
  else {

    return (
      <View style={styles.mainContainer}>
        <View style={styles.componentCardsContainer}>
          {components.map(component => {

          return <Card options={componentOptions} title={component.name}  description={component.type.displayName} icon={images[component.type.value]} displayInfo={{
            "Distance": component.rideDistance + " km",
            "Ride Time": Math.floor(component.rideTime/3600) + " h " + Math.floor((component.rideTime%3600)/60) + " m"
          }}  onPress={() => { Alert.alert("TODO show correct component") }}></Card>
          })}
        </View>
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
    flex: 9
  },
  addButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingVertical: 30,
    paddingHorizontal: 20,
    zIndex: 99
  },
  addButton: {
    backgroundColor: "#F44336"
  }
})


