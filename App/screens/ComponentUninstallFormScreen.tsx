import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebaseApp from '../config/firebase';
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';

async function removeKmAndHoursBetweenDates(startDate, endDate, bikeRef, componentRef) {
    let rides = await getDocs(query(collection(getFirestore(firebaseApp), "rides"),
        where("bike", "==", bikeRef),
        where("time", ">=", startDate),
        where("time", "<=", endDate)))

    let ridesArray = []
    rides.forEach(ride => ridesArray.push(ride.data()))

    let kmTotal = ridesArray.reduce((ride1, ride2) => ride1 + (ride2["distance"] || 0), 0)
    let rideTimeTotal = ridesArray.reduce((ride1, ride2) => ride1 + (ride2["rideTime"] || 0), 0)

    return updateDoc(componentRef, {
        rideDistance: increment(-1 * kmTotal),
        rideTime: increment(-1 * rideTimeTotal)
    })
}

async function uninstallComponent(bikeId, componentId, uninstallTime: Date) {

    let bikeRef = doc(getFirestore(firebaseApp), "bikes", bikeId)
    let componentRef = doc(getFirestore(firebaseApp), "components", componentId)
    let newestSwapRecordDoc = (await getDocs(
        query(
            collection(getFirestore(firebaseApp), "bikesComponents"),
            where("bike", "==", bikeRef),
            where("component", "==", componentRef),
            orderBy("installTime", "desc")))).docs[0]


    if (uninstallTime > new Date()) {
        throw new Error("Uninstall time can't be in future")
    }
    if (uninstallTime < newestSwapRecordDoc.data().installTime) {
        throw new Error("Uninstallation of component must be later than installation ")
    }


    let addUninstallTime = updateDoc(newestSwapRecordDoc.ref, {
        uninstallTime: uninstallTime
    })
    let removeBikeRef = updateDoc(doc(getFirestore(firebaseApp), "components", componentId), {
        bike: deleteField()
    })
    let decrementKmAndHours = removeKmAndHoursBetweenDates(uninstallTime, new Date(), bikeRef, componentRef)

    Promise.all([addUninstallTime, removeBikeRef, decrementKmAndHours])

}


export default function ComponentUninstallFormScreen({ navigation, route }) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        if (mode == "date") {
            showMode('time')
        }
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    return (
        <View>
            <View style={styles.contentContainer}>
                <Text style={styles.formTitle}>Uninstallation date and time</Text>
                <TouchableOpacity onPress={() => showMode('date')}>
                    <View style={styles.selectedDateContainer}>
                        <Text style={styles.selectedDate}>{date.toLocaleString()}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ paddingTop: 10 }}>


                    <Button color='#F44336' title='Uninstall' onPress={() => {

                        //TODO započítat kilometry
                        //TODO check referencí - komponenta není na kole, kolo i komponenta je lognuteho usera, 

                        uninstallComponent(route.params.bikeId, route.params.componentId, date).then(() => { navigation.navigate("BikeComponentsList") })
                    }} />
                </View>
            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}

                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20
    },
    formTitle: {
        color: "#6F6F6F"
    },
    selectedDateContainer: {
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginTop: 10,
        borderRadius: 3,

    },
    selectedDate: {
        color: '#F44336'
    }

})