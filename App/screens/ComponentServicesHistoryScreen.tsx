
import * as React from 'react';
import { Text, View, Alert, StyleSheet, ActivityIndicator , ScrollView} from 'react-native';
import { FAB } from 'react-native-paper';
import ServiceRecordCard from '../components/ServiceRecordCard';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc } from 'firebase/firestore';
import firebaseApp from '../config/firebase'; 3
import { useIsFocused } from "@react-navigation/native";
import {formatDate, rideDistanceToString, rideSecondsToString} from "../modules/helpers"


async function loadServiceRecords(componentId) {
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
      //calculate sum of service prices
      let priceTotal = wearRecordsArray.reduce((a, b) => a + (b.data()['price'] || 0), 0)
      setPriceTotal(priceTotal)
      setIsLoaded(true)
    })
  }, [isFocused, isLoaded])


  //confirm dialog for delete
  const [showBox, setShowBox] = React.useState(true);
  const showConfirmDialog = (serviceRecordRef) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete wear record ",
      [

        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            deleteDoc(serviceRecordRef).then(()=>setIsLoaded(false))

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
        <ScrollView>
       {serviceRecords.length != 0 && <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}><Text style={styles.priceHighlightedText}>Total:</Text> {priceTotal} €</Text>
        </View>}
          <View style={styles.cardsContainer}>
          {serviceRecords.length == 0 && <Text style={{padding:20, fontSize:17, fontWeight:'700'}}>No component service records found</Text>}

        {serviceRecords.map(record => {
        const serviceRecordOptions = [
          {
            text: "Delete",
            onPress: () => {
              showConfirmDialog(record.ref)
            }
          }
        ]
        
          return <ServiceRecordCard options={serviceRecordOptions} 
            
          date={formatDate(record.data().date.toDate())}
            maintext={rideDistanceToString(record.data().rideDistance) + ", " + rideSecondsToString(record.data().rideTime)} 
            description={record.data().description} price={record.data().price} />
        })}
        </View>
        </ScrollView>
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
  cardsContainer:{
    alignItems:'center'
  }
  

})