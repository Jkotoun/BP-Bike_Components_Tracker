
import * as React from 'react';
import { View, Alert, ScrollView, StyleSheet, Text } from 'react-native';

import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import { AuthenticatedUserContext } from '../../context'
import { getAuth } from 'firebase/auth';
import firebaseApp from '../config/firebase';
import { collection, getDoc, getDocs, getFirestore, query, where,doc, updateDoc } from 'firebase/firestore';


async function log() {
  // updateDoc(doc(getFirestore(firebaseApp),"users", "J0CSXBukQpgSPuz3dLDhQxUm1Fg1"), {username: "bohuuus"})
  // getDoc().then(result => console.log(result.data()))
  // const bohusQuery = query(collection(getFirestore(firebaseApp), "users"), where("username", "==", "jkotoun"))
  // getDocs(bohusQuery).then(results => 
  // {
  //   results.forEach(userData => 
  //   {
  //     console.log(userData.data())
  //     if (userData.data().strava_info) 
  //     {
  //       console.log("connected")
  //     }
  //     else 
  //     {
  //       console.log("not connected")
  //     }
  //   })
  // })
}

export default function BikesListScreen({ navigation }) {
  navigation.navigationOptions = {}
  const { IsLoggedIn, setIsLoggedIn } = React.useContext(AuthenticatedUserContext);

  const info = { "Distance": "548 km", "Ride Time": '36h 18m' }
  const info2 = { "Distance": "1235 km", "Ride Time": '80h 10m' }
  const info3 = { "Distance": "2453 km", "Ride Time": '113h 43m' }
  const images = {
    mtb_full: require("../assets/images/full_suspension_mtb_icon.png"),
    road: require("../assets/images/road_icon.png")
  };
  const bikeOptions = [
    {
      text: "Edit",
      onPress: () => Alert.alert("edit")
    },
    {
      text: "Delete",
      onPress: () => Alert.alert("delete")
    }

  ]
  log()
  return (
    <View style={styles.mainContainer}>
      <ScrollView >
        <View style={styles.mainContainer}>

          <Card options={bikeOptions} title="Canyon grand canyon 8" description="MTB hardtail" icon={images.mtb_full} displayInfo={info} onPress={() => { navigation.navigate('BikeDetail') }} ></Card>
          <Card options={bikeOptions} title="Specialized" description="Road" displayInfo={info2} icon={images.mtb_full} onPress={() => { navigation.navigate('BikeDetail') }}></Card>
          {IsLoggedIn ? <Text>{getAuth(firebaseApp).currentUser.email}</Text> : <Text>Ne</Text>}

          {/* {IsLoggedIn? (User.strava? "asd" : "asd") : "neprihlasen" } */}
          <Card options={bikeOptions} title="Qayron carma enduro full" description="MTB full suspension" displayInfo={info3} icon={images.mtb_full} onPress={() => { navigation.navigate('BikeDetail') }}></Card>
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
  }
}