
import * as React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import { useIsFocused } from "@react-navigation/native";
async function loadComponents(loggedUser)
{
  let componentsArray = []
  let componentsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "components"), where("user", "==", doc(getFirestore(firebaseApp), "users", loggedUser.uid))))
  componentsDocRef.forEach(component => {
    let componentData = component.data()
    componentData.id = component.id
    componentsArray.push(componentData)
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

export default function AllComponentsListScreen({ navigation, route }) {
  
  const isFocused = useIsFocused();
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  //bikes loading
  React.useEffect(() => {
    if (!isLoaded || (route.params && route.params.forceReload)) {
    loadComponents(User).then((componentsArray)=>{
      setComponents(componentsArray)
      setIsLoaded(true)
    })}
  }, [isFocused])
  const [components, setComponents] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
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
           <ScrollView >
        <View style={Styles.cardsContainer}>
          {components.map(component => {
            return  <Card title={component.name} description={component.type.displayName} description2={"Bike: " + (component.bike? component.bike.name : "Not assigned")} icon={images[component.type.value]} displayInfo={{
              "Distance": component.rideDistance + " km",
              "Ride Time": Math.floor(component.rideTime/3600) + " h " + Math.floor((component.rideTime%3600)/60) + " m"
            }}  onPress={() => { navigation.navigate('ComponentDetailTabs', {
              componentId: component.id
            }) }}  ></Card>
          })}
                  
        </View>
        </ScrollView>
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