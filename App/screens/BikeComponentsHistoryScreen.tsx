
import * as React from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import firebaseApp from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, getDoc, getDocs, query, collection, where, doc, deleteDoc, updateDoc, deleteField, increment , orderBy} from 'firebase/firestore';
import ComponentSwapCard from '../components/ComponentSwapCard';
import { useIsFocused } from "@react-navigation/native";
import { UpdateComponentsStats } from '../modules/firestoreActions'



async function loadBikeComponentSwaps(bikeId) {
  let swaps = await getDocs(query(collection(getFirestore(firebaseApp), "bikesComponents"), where("bike", "==", doc(getFirestore(firebaseApp), "bikes", bikeId)), orderBy("uninstallTime", "desc")))
  let componentsArray = []
  swaps.docs.forEach(comp => {

      let compData = comp.data()
      compData.id = comp.id
      compData.ref = comp.ref
      componentsArray.push(compData)

  })

  const promises = componentsArray.map(async comp => {

      comp.bikeDoc = (await getDoc(comp.bike))
      comp.componentDoc = (await getDoc(comp.component))
      return comp
  })
  let componentsWithBikeObj = await Promise.all(promises)
  componentsWithBikeObj.sort((a, b) => { return b.installTime - a.installTime })
  return componentsWithBikeObj
}

export default function BikeComponentsHistoryScreen({route}) {
  const isFocused = useIsFocused();

  const [componentSwapRecords, setComponentSwapRecords] = React.useState(Array);
  const [isLoaded, setIsLoaded] = React.useState(true);
  React.useEffect(() => {
      loadBikeComponentSwaps(route.params.bikeId).then((componentSwapRecords) => {
          setComponentSwapRecords(componentSwapRecords)
          setIsLoaded(true)
      })
  }, [isLoaded, isFocused])


  if (!isLoaded) {
      return (
          <View style={styles.loadContainer}>

              <ActivityIndicator size="large" color="#F44336" />

          </View>
      )
  }
  else {
      return (
          <View style={styles.mainContainer}>
              <ScrollView>
                  <View style={styles.cardsContainer}>
                      {componentSwapRecords.map((componentSwapRecord: any) => {

                          return <ComponentSwapCard maintext={componentSwapRecord.bikeDoc.data() ? componentSwapRecord.componentDoc.data().name : "Deleted bike"}
                              description={componentSwapRecord.installTime.toDate().getTime() == 0? "Since purchase" : componentSwapRecord.installTime.toDate().toLocaleString()}
                              description2={componentSwapRecord.uninstallTime ? componentSwapRecord.uninstallTime.toDate().toLocaleString() : "Currently installed"} />
                      })}
                  </View>
              </ScrollView>
          </View>
      );
  }
} 


const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    paddingTop:5
  },
  contentContainer:{
    display: 'flex', 
    flexDirection: 'column', 
    padding: 25
  },
  historyItemContainer:{
    display: 'flex', 
    flexDirection: 'row', 
    paddingBottom: 15
  },
  distanceContainer:{
    flex: 1
  },
  distanceText:{
    fontSize: 15, 
    fontWeight: 'bold'
  },
  descriptionContainer:{
    flex: 3
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
},
cardsContainer:{
    alignItems: 'center',
}

})