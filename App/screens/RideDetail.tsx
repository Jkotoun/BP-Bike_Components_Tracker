
import * as React from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator, StatusBar, TouchableOpacityBase, TouchableOpacity } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { useIsFocused } from "@react-navigation/native";
import { rideSecondsToString, rideDistanceToString, formatDateTime } from '../modules/helpers';


import * as Linking from 'expo-linking';

async function loadRide(rideId) {
  let rideDocRef = await getDoc(doc(getFirestore(firebaseApp), "rides", rideId))
  let rideObj = rideDocRef.data()
  if (rideObj.bike) {
    rideObj.bike = (await getDoc(rideObj.bike)).data()

  }
  return rideObj
}


export default function RideDetail({ route }) {
  const isFocused = useIsFocused();

  React.useEffect(() => {
    loadRide(route.params.rideId).then((ride) => {
      setRide(ride)
      setIsLoaded(true)
    })
  }, [isFocused])
  const [ride, setRide] = React.useState(Object);
  const [isLoaded, setIsLoaded] = React.useState(false);
  if (!isLoaded) {
    return (<View style={styles.loadContainer}>

      <ActivityIndicator size="large" color="#F44336" />

    </View>)
  }
  else {


    return (
      <View style={styles.mainContainer}>
        <StatusBar backgroundColor="#F44336" />
        <View style={styles.titleContainer}>


          <Text style={styles.titleText}>Bike: {ride.bike ? ride.bike.name : "not assigned"}</Text>
          <Text style={styles.dateText}>{formatDateTime(ride.date.toDate())}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statContainter}>
              <Text style={styles.statValue}>{rideDistanceToString(ride.distance)}</Text>
              <Text style={styles.statName}>Distance</Text>
            </View>
            <View style={styles.statContainter}>
              <Text style={styles.statValue}>{rideSecondsToString(ride.rideTime)}</Text>
              <Text style={styles.statName}>Ride time</Text>
            </View>
            {ride.stravaSynced &&
              <View style={styles.statContainter}>
                <Text style={styles.statValue}>{ride.elevationGain} m</Text>
                <Text style={styles.statName}>Elevation gain</Text>
              </View>}
          </View>
          {ride.stravaSynced &&
            <View style={styles.statsRow}>
              <View style={styles.statContainter}>
                <Text style={styles.statValue}>{(ride.maxSpeed).toFixed(2)} km/h</Text>
                <Text style={styles.statName}>Max speed</Text>
              </View>
              <View style={styles.statContainter}>
                <Text style={styles.statValue}>{(ride.avgSpeed).toFixed(2)} km/h</Text>
                <Text style={styles.statName}>Average speed</Text>
              </View>
              <View style={styles.statContainter}>
                <Text style={styles.statValue}>{rideSecondsToString(ride.elapsedTime)}</Text>
                <Text style={styles.statName}>Elapsed time</Text>
              </View>
            </View>
          }
          {ride.stravaSynced && <TouchableOpacity onPress={() => Linking.openURL('https://www.strava.com/activities/' + ride.stravaId )}>
            <Text style={styles.stravaLink}>View in strava</Text>

          </TouchableOpacity>}
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  titleContainer: {
    padding: 20,
    width: "95%"
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700'
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500'
  },
  rideMapContainer: {
    paddingHorizontal: 20,
    paddingBottom: 5,
    elevation: 5
  },
  rideMap: {
    width: "100%",
    height: 200,
    borderRadius: 4
  },
  statsContainer: {
    width: '90%',
    padding: 5,
    flexDirection: 'column',
    backgroundColor: "#FDFDFD",
    margin: 4,
    elevation: 2,
    borderRadius: 3,
    display: 'flex',
    alignSelf: 'center'
  },
  statsRow: {
    flexDirection: 'row',
    display: 'flex',
    paddingVertical: 10
  },
  statContainter: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    color: "#F44336",
    fontSize: 15,
    fontWeight: 'bold'
  },
  statName: {
    color: "#696969"
  },
  stravaLink: {
    alignSelf: 'flex-end',
    color: "#F44336",
    fontWeight: "bold",
    paddingTop: 7,
    paddingBottom: 8,
    fontSize: 14,
    paddingRight: 10
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
