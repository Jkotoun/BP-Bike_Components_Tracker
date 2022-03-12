
import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc } from 'firebase/firestore';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import { useIsFocused } from "@react-navigation/native";
import { deleteComponent, retireComponent } from "../modules/firestoreActions";
import {rideSecondsToString ,rideDistanceToString} from '../modules/helpers';

async function loadComponents(loggedUser) {
  let componentsArray = []  
  let componentsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "components"), where("user", "==", doc(getFirestore(firebaseApp), "users", loggedUser.uid)), where("state", "==", "active")))
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

export default function AllComponentsListScreen({ navigation, route }) {

  const isFocused = useIsFocused();
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const [isLoaded, setIsLoaded] = React.useState(false);
  //bikes loading
  React.useEffect(() => {
      loadComponents(User).then((componentsArray) => {
        setComponents(componentsArray)
        setIsLoaded(true)
      })
  }, [isFocused, isLoaded])
  const [components, setComponents] = React.useState([]);
  const images = {
    chain: require("../assets/images/chain_icon.png"),
    fork: require("../assets/images/bicycle_fork_icon.png")
  };
  if (!isLoaded) {
    return (
      <View style={Styles.loadContainer}>
        <ActivityIndicator size="large" color="#F44336" />
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
    )
  }
  else {
    return (
      <View style={Styles.mainContainer}>
        <ScrollView >
          <StatusBar
            backgroundColor="#F44336"
          />
          <View style={Styles.cardsContainer}>
          {/* {components.length == 0 && <Text style={{padding:20, fontSize:17, fontWeight:'700'}}>Add components using '+' button</Text>} */}

            {components.map(component => {

              const componentOptions = [
                {
                  text: "Edit",
                  onPress: () => {
                    navigation.navigate("AddComponentScreen", {
                      componentId: component.id
                    })
                  }
                },
                {
                  text: "Retire",
                  onPress: () => {
                    retireComponent(component.id).then(() =>
                    setIsLoaded(false)
                    )
                  }
                },
                {
                  text: "Delete",
                  onPress: () => {
                    deleteComponent(component.id).then(() =>
                      setIsLoaded(false)
                    )
                  }
                },

              ]

              return <Card options={componentOptions} title={component.name} description={component.type.displayName} description2={"Bike: " + (component.bike ? component.bike.name : "Not assigned")} icon={images[component.type.value]} displayInfo={{
                "Distance": rideDistanceToString(component.initialRideDistance+component.rideDistance),
                "Ride Time": rideSecondsToString(component.rideTime + component.initialRideTime)
              }} onPress={() => {
                navigation.navigate('ComponentDetailTabs', {
                  componentId: component.id
                })
              }}  ></Card>
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
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})