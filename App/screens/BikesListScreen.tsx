
import * as React from 'react';
import { View, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, Image, StatusBar, ActivityIndicator, Button } from 'react-native';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import { AuthenticatedUserContext } from '../../context'
import firebaseApp from '../config/firebase';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc } from 'firebase/firestore';
import * as stravaApi from '../modules/stravaApi';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from 'expo-auth-session';
import {changeBikeState, retireBike, syncDataWithStrava} from "../modules/firestoreActions";
import { useIsFocused } from "@react-navigation/native";
import {rideSecondsToString ,rideDistanceToString} from '../modules/helpers';



export default function BikesListScreen({ navigation, route }) {
  navigation.navigationOptions = {}
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const [isLoaded, setIsLoaded] = React.useState(false);
  //strava auth request
  
  const isFocused = useIsFocused();



  //bikes loading
  React.useEffect(() => {
      let bikeStatesQuery = ["active"];
      if(route.params.viewRetired == true)
      {
        bikeStatesQuery.push("retired")
      }
      getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("user", "==", doc(getFirestore(firebaseApp), "users", User.uid)), where("state", 'in', bikeStatesQuery))).then(bikesDocRef => {
        const bikesArray = []
        bikesDocRef.forEach(bike => {
          let bikeData = bike.data()
          bikeData.bikeId = bike.id
          bikesArray.push(bikeData)
        })
        setBikes(bikesArray)
        setIsLoaded(true)
      })
  }, [isFocused, isLoaded])
  const [bikes, setBikes] = React.useState([]);
  const images = {
    mtbfull: require("../assets/images/full_suspension_mtb_icon.png"),
    mtbht: require("../assets/images/mtbht.png"),
    road: require("../assets/images/road_icon.png"),
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadContainer}>

      <ActivityIndicator size="large" color="#F44336"/>
      <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("AddBikeScreen")}
          />
        </View>
    </View>
    )
  }
  else {
    return (
      <View style={styles.mainContainer}>
        <ScrollView >
        <StatusBar backgroundColor="#F44336"/>
          <View style={styles.bikeCardsContainer}>
          
          {bikes.length == 0 && <Text style={{padding:20, fontSize:17, fontWeight:'700'}}>Sync bikes from strava or add bike using '+' button</Text>}

            {bikes.map(bike => {

              if(bike.stravaSynced)
              {
                return <Card stravaIcon={true} title={bike.name} description={bike.type.label} icon={images[bike.type.value]} displayInfo={{
                  "Distance": rideDistanceToString(bike.initialRideDistance + bike.rideDistance),
                  "Ride Time": rideSecondsToString(bike.rideTime + bike.initialRideTime)
                }} onPress={() => {
                  navigation.navigate('BikeDetailTabs', {
                    bikeId: bike.bikeId
                  })
                }} />
              }
              else
              {
                const bikeOptions = [
                  {
                    text: "Edit",
                    onPress: () => {
                      navigation.navigate("AddBikeScreen", {
                        bikeId: bike.bikeId
                      })
                    }
                  }
                ]
                if(bike.state == "active")
                {
                  bikeOptions.push({
                    text: "Retire",
                    onPress: () =>{ 
                      retireBike(bike.bikeId).then(() => 
                      setIsLoaded(false)
                      )
                    }
                  })
                }
                else if(bike.state=="retired")
                {
                  bikeOptions.push({
                    text: "Reactivate",
                    onPress: () =>{ 
                      changeBikeState(bike.bikeId, "active").then(() => 
                      setIsLoaded(false)
                      )
                    }
                  })
                } 
                
                return <Card options={bikeOptions} active={bike.state == "active"} title={bike.state=="active"? bike.name : (bike.name + " - retired")} description={bike.type.label} icon={images[bike.type.value]} displayInfo={{
                  "Distance": rideDistanceToString(bike.initialRideDistance + bike.rideDistance),
                  "Ride Time": rideSecondsToString(bike.rideTime + bike.initialRideTime)
                }} onPress={() => {
                  navigation.navigate('BikeDetailTabs', {
                    bikeId: bike.bikeId
                  })
                }} />
              }
              
                
            })}


          </View>
        </ScrollView>
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("AddBikeScreen")}
          />
        </View>

      </View>
    );
  }

}

const styles = {
  mainContainer: {
    flex: 1
  },
  bikeCardsContainer: {
    alignItems: 'center',
    marginTop: 5,
    flex: 9,
    zIndex: 0
  },
  addButtonContainer: {
    right: 0,
    bottom: 0,
    paddingBottom: 30,
    paddingRight: 20,
    zIndex: 99,
    position: 'absolute',
  },
  addButton: {
    backgroundColor: "#F44336"
  },
  loadContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  }
}