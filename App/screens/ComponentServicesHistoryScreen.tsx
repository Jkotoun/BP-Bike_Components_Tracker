
import * as React from 'react';
import { Text, View, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { FAB } from 'react-native-paper';
import ServiceRecordCard from '../components/ServiceRecordCard';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
import firebaseApp from '../config/firebase'; 3
import { useIsFocused } from "@react-navigation/native";




async function loadServiceRecords(componentId) {
  let serviceRecordsArray = []
  let serviceRecordsDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "componentServiceRecords"), where("component", "==", doc(getFirestore(firebaseApp), "components", componentId))))


  serviceRecordsDocRef.forEach(serviceRecord => {
    let serviceRecordData = serviceRecord.data()
    serviceRecordData.id = serviceRecord.id
    serviceRecordsArray.push(serviceRecordData)
  })

  return serviceRecordsArray
}

export default function ComponentServicesHistoryScreen({ route }) {
  const isFocused = useIsFocused();
  React.useEffect(() => {

    loadServiceRecords(route.params.componentId).then((wearRecordsArray) => {
      setServiceRecords(wearRecordsArray)
      let priceTotal = wearRecordsArray.reduce((a, b) => a + (b['price'] || 0), 0)
      setPriceTotal(priceTotal)
      setIsLoaded(true)
    })
  }, [isFocused])

  const [serviceRecords, setServiceRecords] = React.useState([]);
  const [priceTotal, setPriceTotal] = React.useState(Number);
  const [isLoaded, setIsLoaded] = React.useState(false);



  if (!isLoaded) {
    return (
      <View style={styles.loadContainer}>
        <ActivityIndicator size="large" color="#F44336" />
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => Alert.alert("TODO add service form")}
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
          return <ServiceRecordCard maintext={record.rideDistance + " km, " + Math.floor(record.rideTime / 3600) + " h " + Math.floor((record.rideTime % 3600) / 60) + " m"} description={record.description} price={record.price} />
        })}
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => Alert.alert("TODO add service form")}
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
  }

})