
import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Card from '../components/Card';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
async function loadComponents(loggedUser) {
  let componentsArray = []
  let componentsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "components"), where("user", "==", doc(getFirestore(firebaseApp), "users", loggedUser.uid))))
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

  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  //bikes loading
  React.useEffect(() => {

    loadComponents(User).then((componentsArray) => {
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

  if (!isLoaded) {
    return (
      <View style={styles.loadContainer}>

      <Text style={{fontSize:35, fontWeight:'bold', color: "#F44336" }}>Loading...</Text>
    </View>
    )
  }
  else {
    return (

      <View style={styles.mainContainer}>
        <View style={styles.componentCards}>
          {components.map(component => {
            return <Card title={component.name} description={component.type.displayName}  icon={images[component.type.value]} displayInfo={{
              "Distance": component.rideDistance + " km",
              "Ride Time": Math.floor(component.rideTime / 3600) + " h " + Math.floor((component.rideTime % 3600) / 60) + " m"
            }} onPress={() => {
              navigation.navigate('ComponentInstallFormScreen', {
                componentId: component.id
              })
            }}  ></Card>
          })}
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
    flex: 9
  },
  loadContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  }
})

