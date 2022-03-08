
import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { getFirestore, doc, getDocs, getDoc, query, collection, where, deleteDoc } from 'firebase/firestore';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import { useIsFocused } from "@react-navigation/native";
import { deleteRide } from "../modules/firestoreActions";

async function loadRides(loggedUser) {
  let ridesArray = []
  let ridesDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "rides"), where("user", "==", doc(getFirestore(firebaseApp), "users", loggedUser.uid))))

  ridesDocRef.forEach(ride => {
    let rideData = ride.data()
    rideData.id = ride.id
    ridesArray.push(rideData)
  })
  const promises = ridesArray.map(async ride => {
    if (ride.bike) {
      ride.bike = (await getDoc(ride.bike)).data()
    }
    return ride
  })
  const ridesWithBikeObj = await Promise.all(promises)
  return ridesWithBikeObj
}


export default function BikesListScreen({ navigation, route }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const isFocused = useIsFocused();

  const images = {
    route: require("../assets/images/route_icon.png"),
  };
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
      loadRides(User).then((ridesArray) => {
        setRides(ridesArray)
        setIsLoaded(true)
      })
    
  }, [isFocused, isLoaded])
  const [rides, setRides] = React.useState([]);
  if (!isLoaded) {
    return (<View style={styles.loadContainer}>

      <ActivityIndicator size="large" color="#F44336" />
      <View style={styles.addButtonContainer}>
        <FAB style={styles.addButton} icon="plus" onPress={() => navigation.navigate("AddRideScreen")} />
      </View>
    </View>)
  }
  else {

    return (
      <View style={styles.mainContainer}>
        <StatusBar backgroundColor="#F44336" />
        <ScrollView>
          <View style={styles.rideCardsContainer}>
          {rides.length == 0 && <Text style={{padding:20, fontSize:17, fontWeight:'700'}}>Sync rides from strava or add ride using '+' button</Text>}

            {rides.map(ride => {


              let infoObj = {
                "Distance": ride.distance + " km",
                "Total time": Math.floor(ride.rideTime / 3600) + " h " + Math.floor((ride.rideTime % 3600) / 60) + " m"
              }

              infoObj["Activity date"] = ride.date.toDate().toISOString().split('T')[0]
              if (ride.stravaActivity) {

                return <Card title={ride.name} description2={"Bike: " + (ride.bike ? ride.bike.name : "not assigned")} icon={images.route} displayInfo={infoObj} onPress={() => {
                  navigation.navigate('RideDetail', {
                    rideId: ride.id
                  })
                }} />
              }
              else {

                const rideOptions = [
                  {
                    text: "Delete",
                    onPress: () => {
                      deleteRide(ride.id).then(() =>
                        setIsLoaded(false)
                      )
                    }
                  }

                ]
                return <Card options={rideOptions} title={ride.name} description2={"Bike: " + (ride.bike ? ride.bike.name : "not assigned")} icon={images.route} displayInfo={infoObj} onPress={() => {
                  navigation.navigate('RideDetail', {
                    rideId: ride.id
                  })
                }} />
              }
            })}
          </View>
        </ScrollView>
        <View style={styles.addButtonContainer}>
          <FAB style={styles.addButton} icon="plus" onPress={() => navigation.navigate("AddRideScreen")} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  rideCardsContainer: {
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
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})