
import * as React from 'react';
import { Text, View, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { FAB } from 'react-native-paper';
import ServiceRecordCard from '../components/ServiceRecordCard';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc } from 'firebase/firestore';
import firebaseApp from '../config/firebase'; 3
import { useIsFocused } from "@react-navigation/native";
import {rideDistanceToString, rideSecondsToString} from "../modules/helpers"



async function loadServiceRecords(componentId) {
  let serviceRecordsArray = []
  let serviceRecordsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "componentServiceRecords"), where("component", "==", doc(getFirestore(firebaseApp), "components", componentId))))


  return serviceRecordsDocRef.docs
}

export default function ComponentServicesHistoryScreen({navigation, route }) {
  const [serviceRecords, setServiceRecords] = React.useState([]);
  const [priceTotal, setPriceTotal] = React.useState(Number);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const isFocused = useIsFocused();
  React.useEffect(() => {

    loadServiceRecords(route.params.componentId).then((wearRecordsArray) => {
      setServiceRecords(wearRecordsArray)
      let priceTotal = wearRecordsArray.reduce((a, b) => a + (b.data()['price'] || 0), 0)
      setPriceTotal(priceTotal)
      setIsLoaded(true)
    })
  }, [isFocused, isLoaded])




  if (!isLoaded) {
    return (
      <View style={styles.loadContainer}>
        <ActivityIndicator size="large" color="#F44336" />
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("AddServiceRecord", {
              componentId: route.params.componentId
            }) }
          />
        </View>
      </View>)
  }
  else {

    return (
      <View style={styles.mainContainer}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}><Text style={styles.priceHighlightedText}>Total:</Text> {priceTotal} CZK</Text>
        </View>
        {serviceRecords.map(record => {
        const serviceRecordOptions = [
          {
            text: "Delete",
            onPress: () => {
              deleteDoc(record.ref).then(()=>setIsLoaded(false))
            }
          }
        ]
          return <ServiceRecordCard options={serviceRecordOptions} 
            maintext={rideDistanceToString(record.data().rideDistance) + ", " + rideSecondsToString(record.data().rideTime)} 
            description={record.data().description} price={record.data().price} />
        })}
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("AddServiceRecord", {
              componentId: route.params.componentId
            }) }
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
  totalPriceContainer: {
    padding: 15
  },
  totalPriceText: {
    fontSize: 18
  },
  priceHighlightedText: {
    color: '#F44336',
    fontWeight: 'bold'
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
  },
  

})