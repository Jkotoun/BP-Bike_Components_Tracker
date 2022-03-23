
import * as React from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import firebaseApp from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, getDoc, getDocs, query, collection, where, doc, deleteDoc, updateDoc, deleteField, increment, orderBy } from 'firebase/firestore';
import ComponentSwapCard from '../components/ComponentSwapCard';
import { useIsFocused } from "@react-navigation/native";
import { deleteComponentSwapRecord } from '../modules/firestoreActions'

//TODO refactor, odeccist z komponent km pri smazani recordu


async function loadComponentSwaps(componentId) {
    let component = await getDocs(query(collection(getFirestore(firebaseApp), "bikesComponents"), where("component", "==", doc(getFirestore(firebaseApp), "components", componentId)), orderBy("installTime", "desc")))
    let componentsArray = []
    component.forEach(comp => {

        let compData = comp.data()
        compData.id = comp.id
        compData.ref = comp.ref
        compData.installTime = compData.installTime


        componentsArray.push(compData)

    })

    const promises = componentsArray.map(async comp => {

        comp.bikeDoc = (await getDoc(comp.bike))
        comp.componentDoc = (await getDoc(comp.component))
        return comp
    })
    let componentsWithBikeObj = await Promise.all(promises)
    return componentsWithBikeObj
}

export default function ComponentSwapsHistory({ route }) {

    const isFocused = useIsFocused();

    const [componentSwapRecords, setComponentSwapRecords] = React.useState(Array);
    const [isLoaded, setIsLoaded] = React.useState(true);
    React.useEffect(() => {
        loadComponentSwaps(route.params.componentId).then((componentSwapRecords) => {
            setComponentSwapRecords(componentSwapRecords)
            setIsLoaded(true)
        })
    }, [isLoaded, isFocused])

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
              deleteComponentSwapRecord(wearRecordId).then(() =>
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

            </View>
        )
    }
    else {
        return (
            <View style={styles.mainContainer}>
                <ScrollView>
                    <View style={styles.cardsContainer}>
                        {componentSwapRecords.map((componentSwapRecord: any) => {
                            const swapRecordOptions = [
                                {
                                    text: "Delete",
                                    onPress: () => {
                                        showConfirmDialog(componentSwapRecord.id)
                                    }
                                }

                            ]

                            return <ComponentSwapCard options={swapRecordOptions} maintext={componentSwapRecord.bikeDoc.data() ? componentSwapRecord.bikeDoc.data().name : "Deleted bike"}
                                description={componentSwapRecord.installTime.toDate().getTime() == 0 ? "Since purchase" : componentSwapRecord.installTime.toDate().toLocaleString()}
                                description2={componentSwapRecord.uninstallTime ? componentSwapRecord.uninstallTime.toDate().toLocaleString() : "Currently installed"} />
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 25
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 15
    },
    propertyNameContainer: {
        flex: 1
    },
    propertyTextContainer: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    propertyValueContainer: {
        flex: 1
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
