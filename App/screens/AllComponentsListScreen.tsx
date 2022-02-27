
import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection } from 'firebase/firestore';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import firebaseApp from '../config/firebase';

async function loadBikes()
{
  let componentsArray = []
  let componentsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "components")))
  
  componentsDocRef.forEach(component => {
    componentsArray.push(component.data())
  })


  const promises = componentsArray.map(async comp =>{
    if(comp.bike)
    {
      comp.bike = (await getDoc(comp.bike)).data()
    }
    return comp
  })
  const componentsWithBikeObj = await Promise.all(promises)
  return componentsWithBikeObj
}

export default function AllComponentsListScreen({ navigation }) {
  //bikes loading
  React.useEffect(() => {
   
    loadBikes().then((componentsArray)=>{
      setComponents(componentsArray)
      setIsLoaded(true)
    })
  }, [])
  const [components, setComponents] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const info = { "Distance": "120 km", "Ride Time": '11h 18m', "Condition": "New" }
  const info2 = { "Distance": "548 km", "Ride Time": '36h 10m', "Condition": "Good" }

  const images = {
    chain: require("../assets/images/chain_icon.png"),
    fork: require("../assets/images/bicycle_fork_icon.png")
  };

  if (!isLoaded) {
    return (<Text>Loading...</Text>)
  }
  else {
    return (

      <View style={Styles.mainContainer}>
        <View style={Styles.cardsContainer}>
          {components.map(component => {
            return  <Card title={component.name} description={component.type.displayName} description2={"Bike: " + (component.bike? component.bike.name : "Not assigned")} icon={images[component.type.value]} displayInfo={{
              "Distance": component.rideDistance + " km",
              "Ride Time": Math.floor(component.rideTime/3600) + " h " + Math.floor((component.rideTime%3600)/60) + " m"
            }}  onPress={() => { navigation.navigate('ComponentDetail') }}  ></Card>
          })}
          
          {/* <Card title="Fox 34 float rhythm" description="Fork" description2="Not installed" displayInfo={info2} icon={images.fork} onPress={() => { navigation.navigate('ComponentDetail') }}></Card> */}
        </View>
        <View style={Styles.addButtonContainer}>
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

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  cardsContainer: {
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
  }
})