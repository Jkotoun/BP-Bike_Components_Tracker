
import * as React from 'react';
import { View, Alert, StyleSheet, Text, ActivityIndicator, Button, ScrollView } from 'react-native';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, orderBy, deleteDoc } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import WearRecordCard from '../components/WearRecordCard';
import { FAB } from 'react-native-paper';
import { formatDate, formatDateTime, rideDistanceToString, rideSecondsToString } from "../modules/helpers"
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { getStorage, getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { deleteWearRecord } from '../modules/firestoreActions'


//load wear reacords and its images from cloud storage
async function loadWearRecords(componentId) {
  let wearRecordsArray = []
  let wearRecordsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "componentWearRecords"), where("component", "==", doc(getFirestore(firebaseApp), "components", componentId)), orderBy('date', 'desc')))

  wearRecordsDocRef.forEach(wearRecord => {
    let wearRecordData = wearRecord.data()
    wearRecordData.id = wearRecord.id
    wearRecordData.ref = wearRecord.ref
    wearRecordsArray.push(wearRecordData)
  })

  for (let i = 0; i < wearRecordsArray.length; i++) {
    if (wearRecordsArray[i].image) {
      wearRecordsArray[i].image = await getDownloadURL(ref(getStorage(firebaseApp), wearRecordsArray[i].image))
    }
  }
  return wearRecordsArray
}


export default function ComponentWearHistoryScreen({ route, navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const isFocused = useIsFocused();
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    loadWearRecords(route.params.componentId).then((wearRecordsArray) => {
      setWearRecords(wearRecordsArray)
      setIsLoaded(true)
    })
  }, [isFocused, isLoaded])
  const [wearRecords, setWearRecords] = React.useState([]);

  //delete confirm dialog
  const [showBox, setShowBox] = React.useState(true);
  const showConfirmDialog = (wearRecordId) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete wear record ",
      [
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            deleteWearRecord(wearRecordId).then(() =>
              setIsLoaded(false))
          },
        },
        {
          text: "No",
        },
      ]
    );
  };


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
        <ScrollView>
          <View style={styles.cardsContainer}>
            {wearRecords.length == 0 && <Text style={{ padding: 20, fontSize: 17, fontWeight: '700' }}>No component wear records found</Text>}

            {wearRecords.map(wearRecord => {
              const wearRecordOptions = [
                {
                  text: "Delete",
                  onPress: () => {
                    showConfirmDialog(wearRecord.id)
                  }
                }
              ]
              return <WearRecordCard maintext={rideDistanceToString(wearRecord.rideDistance) + ", " + rideSecondsToString(wearRecord.rideTime)} options={wearRecordOptions} date={formatDate(wearRecord.date.toDate())}
                description={wearRecord.description} image={wearRecord.image ? wearRecord.image : null} />
            })}
          </View>

        </ScrollView>
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
    flex: 1,

  },
  addButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingBottom: 30,
    paddingRight: 20,
    zIndex: 99
  },
  addButton: {
    backgroundColor: "#F44336"
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardsContainer: {
    alignItems: 'center',
    paddingHorizontal: 10

  }
})
