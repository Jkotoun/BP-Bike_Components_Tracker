
import * as React from 'react';
import { View, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import { AuthenticatedUserContext } from '../../context'
import { getAuth } from 'firebase/auth';
import firebaseApp from '../config/firebase';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc } from 'firebase/firestore';
import Constants from 'expo-constants';
import * as stravaApi from '../modules/stravaApi';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from 'expo-auth-session';
import { useIsFocused } from "@react-navigation/native";
import {retireBike} from "../modules/firestoreActions";

//TODO mozna presunout do firestore func modelu
//add strava account info to firestore doc in users collection
async function connectAccWithStrava(tokens, user) {
  updateDoc(doc(getFirestore(firebaseApp), "users", user.uid),
    {
      stravaConnected: true,
      stravaInfo: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiration: tokens.issuedAt + tokens.expiresIn
      }
    })
}


export default function BikesListScreen({ navigation, route }) {
  navigation.navigationOptions = {}
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const [isLoaded, setIsLoaded] = React.useState(false);
  //strava auth request
  const [request, response, promptAsync] = stravaApi.authReq()

  const isFocused = useIsFocused();



  // connect account with strava on authorization success
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      stravaApi.getTokens(code).then(tokens => {
        connectAccWithStrava(tokens, User)
        return tokens
      }).then(tokens => {
        setUser({
          ...User, ...{
            stravaConnected: true,
            stravaInfo: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              accessTokenExpiration: tokens.issuedAt + tokens.expiresIn
            }
          }
        })
      })
    }
  }, [response]);
  //bikes loading
  React.useEffect(() => {
      getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("user", "==", doc(getFirestore(firebaseApp), "users", User.uid)), where("state", "==", "active"))).then(bikesDocRef => {
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
    road: require("../assets/images/road_icon.png")
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
        <StatusBar
              backgroundColor="#F44336"
            />
          <View style={styles.bikeCardsContainer}>
          
          {bikes.length == 0 && <Text style={{padding:20, fontSize:17, fontWeight:'700'}}>Sync bikes from strava or add bike using '+' button</Text>}

            {bikes.map(bike => {

              const bikeOptions = [
                {
                  text: "Retire",
                  onPress: () =>{ 
                    retireBike(bike.bikeId).then(() => 
                    setIsLoaded(false)
                    )
                  }
                }

              ]

              return <Card options={bikeOptions} title={bike.name} description={bike.type.label} icon={images[bike.type.value]} displayInfo={{
                "Distance": bike.rideDistance + " km",
                "Ride Time": Math.floor(bike.rideTime / 3600) + " h " + Math.floor((bike.rideTime % 3600) / 60) + " m"
              }} onPress={() => {
                navigation.navigate('BikeDetailTabs', {
                  bikeId: bike.bikeId
                })
              }} ></Card>
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
        {!(User.stravaConnected || User.stravaAuth) &&
          <TouchableOpacity onPress={() => {
            promptAsync();
          }}>
            <Image source={require('../assets/images/btn_strava_connectwith_light.png')} />
          </TouchableOpacity>
        }
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
    paddingVertical: 30,
    paddingHorizontal: 20,
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