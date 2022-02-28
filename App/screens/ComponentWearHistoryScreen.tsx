
import * as React from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import WearRecordCard from '../components/WearRecordCard';
import { FAB } from 'react-native-paper';

async function loadWearRecords(componentId) {
  let wearRecordsArray = []
  let wearRecordsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "componentWearRecords"), where("component", "==", doc(getFirestore(firebaseApp), "components", componentId))))


  wearRecordsDocRef.forEach(wearRecord => {
    let wearRecordData = wearRecord.data()
    wearRecordData.id = wearRecord.id
    wearRecordsArray.push(wearRecordData)
  })

  return wearRecordsArray
}



export default function ComponentWearHistoryScreen({ route }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  React.useEffect(() => {

    loadWearRecords(route.params.componentId).then((wearRecordsArray) => {
      setWearRecords(wearRecordsArray)
      setIsLoaded(true)
    })
  }, [])
  const [wearRecords, setWearRecords] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const image = require("../assets/images/default.jpg")


  if (!isLoaded) {
    return (<Text>Loading...</Text>)
  }
  else {

    return (
      <View style={styles.mainContainer}>
        {wearRecords.map(wearRecord => {
          return <WearRecordCard maintext={wearRecord.rideDistance + " km, " + Math.floor(wearRecord.rideTime/3600) + " h " + Math.floor((wearRecord.rideTime%3600)/60) + " m"} 
          description={wearRecord.description} image={image} /> //TODO Image
        })}
        {/*<WearRecordCard maintext='200 km, 50 h' description='10% wear' image={image} />
      <WearRecordCard maintext='5 km, 0 h' description='1% wear' image={image} /> */}
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => Alert.alert("TODO add wear history form")}
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
  }
})
