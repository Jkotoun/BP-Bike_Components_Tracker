
import * as React from 'react';
import { View, Alert, StyleSheet, Text, ActivityIndicator, Button } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, orderBy } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import WearRecordCard from '../components/WearRecordCard';
import { FAB } from 'react-native-paper';
import { rideDistanceToString, rideSecondsToString } from "../modules/helpers"
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { getStorage, getDownloadURL, ref } from 'firebase/storage';


async function loadWearRecords(componentId) {
  let wearRecordsArray = []
  let wearRecordsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "componentWearRecords"), where("component", "==", doc(getFirestore(firebaseApp), "components", componentId)), orderBy('date', 'desc')))


  wearRecordsDocRef.forEach(wearRecord => {
    let wearRecordData = wearRecord.data()
    wearRecordData.id = wearRecord.id
    wearRecordsArray.push(wearRecordData)
  })
  for (let i = 0; i < wearRecordsArray.length; i++) {

    wearRecordsArray[i].image = await getDownloadURL(ref(getStorage(firebaseApp), wearRecordsArray[i].image))
  }
  return wearRecordsArray
}



export default function ComponentWearHistoryScreen({ route, navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const isFocused = useIsFocused();
  





  React.useEffect(() => {
    loadWearRecords(route.params.componentId).then((wearRecordsArray) => {
      setWearRecords(wearRecordsArray)
      setIsLoaded(true)
    })
  }, [isFocused])
  const [wearRecords, setWearRecords] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);


  if (!isLoaded) {
    return (
      <View style={styles.loadContainer}>
        <ActivityIndicator size="large" color="#F44336" />
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("AddWearRecordScreen", {
              componentId: route.params.componentId
            })}
          />
        </View>
      </View>)
  }
  else {

    return (
      <View style={styles.mainContainer}>
        {wearRecords.map(wearRecord => {
          // console.log(wearRecord.image)
          return <WearRecordCard maintext={rideDistanceToString(wearRecord.rideDistance) + ", " + rideSecondsToString(wearRecord.rideTime)}
            description={wearRecord.description} image={wearRecord.image} /> //TODO Image
        })}


        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("AddWearRecordScreen", {
              componentId: route.params.componentId
            })}

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
