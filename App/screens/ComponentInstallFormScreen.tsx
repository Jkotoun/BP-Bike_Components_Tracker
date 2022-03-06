import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text, StyleSheet, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, getDoc, FieldValue, increment } from 'firebase/firestore';


async function installComponent(componentId, bikeId, installTime: Date) {

  let componentSwaps = await getDocs(
    query(collection(getFirestore(firebaseApp), "bikesComponents"),
      where("bike", "==", doc(getFirestore(firebaseApp), "bikes", bikeId)),
      where("component", "==", doc(getFirestore(firebaseApp), "components", componentId))))

  let correctInstallDate = componentSwaps.docs.every((value) => {
    return value.data().uninstallTime.seconds < Math.round(installTime.getTime() / 1000)
  })

  if (correctInstallDate) {
    let bikeDoc = (await getDoc(doc(getFirestore(firebaseApp), "bikes", bikeId)))
    if (installTime > new Date()) {
      throw new Error("Installation time can not be set in future")
    }
    else if (installTime < bikeDoc.data().purchaseDate.toDate()) {
      throw new Error("Installation time can not be earlier than bike purchase date")
    }
    else {

      let componentRef = doc(getFirestore(firebaseApp), "components", componentId)
      await  addDoc(collection(getFirestore(firebaseApp), "bikesComponents"), {
        bike: bikeDoc.ref,
        component: componentRef,
        installTime: installTime
      })
      await updateDoc(doc(getFirestore(firebaseApp), "components", componentId), {
        bike: doc(getFirestore(firebaseApp), "bikes", bikeId)
      })



      let rides = await getDocs(query(collection(getFirestore(firebaseApp), "rides"),
        where("bike", "==", bikeDoc.ref),
        where("time", ">=", installTime)))

      let ridesArray = []
      rides.forEach(ride => ridesArray.push(ride.data()))

      let kmTotal = ridesArray.reduce((ride1, ride2) => ride1 + (ride2["distance"] || 0), 0)
      let rideTimeTotal = ridesArray.reduce((ride1, ride2) => ride1 + (ride2["rideTime"] || 0), 0)
      await updateDoc(componentRef, {
        rideDistance: increment(kmTotal),
        rideTime: increment(rideTimeTotal)
      })

      // return Promise.all([addSwapRecord, addBikeRef, incrementDistance])

    }

  }
  else {
    throw new Error("You can not set installation time, which is earlier than existing component installation record")
  }
}




export default function ComponentInstallFormScreen({ navigation, route }) {
  
  
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [checked, setChecked] = React.useState('default');

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

  //TODO pridat moznost rovnou specifikovat odinstalaci, secist kilometry z jizd mezi vybranymi daty, check na prekryvani datumu, znemoznit datumy v budoucnu
  //installtime1 se snazim ulozit
  //   installtime1 < installtime2 && uninstalltime1 > installtime2 - chyba1
  //installtime1 > installtime2 && installtime1 < uninstalltime2 - chyba 2
  //installtime1 a uninstalltime 1 v budoucnu - chyba 3
  return (
    <View>
      <View style={styles.formTitleContainer}>
        <Text style={styles.formTitle}>Installation date and time</Text>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />)}

      <RadioButton.Group
        onValueChange={value => {
          setChecked(value)
          if (value == "selected") {
            showMode('date')
          }
        }
        } value={checked}>

        <RadioButton.Item label="Since beggining" value="default" color="#F44336" style={styles.radioItem} />
        <RadioButton.Item
          style={styles.radioItem}
          color='#F44336'
          label={
            <TouchableOpacity onPress={() => showMode('date')}>
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>{date.toLocaleDateString('cs-CZ').split('T')[0] + " " + date.getHours() + ":" + date.getMinutes()}</Text>
              </View>
            </TouchableOpacity>} value="selected" />
      </RadioButton.Group>

      <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
        <Button title='Save' color='#F44336' onPress={() => {

          let installTime: Date;

          if (checked == "default") {
            getDoc(doc(getFirestore(firebaseApp), "bikes", route.params.bikeId))
            .then(bikeRef => {
              installComponent(route.params.componentId, route.params.bikeId, bikeRef.data().purchaseDate.toDate()).then(() => {
                navigation.navigate("BikeComponentsList", {
                  forceReload: true
                })
              })
            })
          }
          else {
            installComponent(route.params.componentId, route.params.bikeId, date).then(() => {
              navigation.navigate("BikeComponentsList", {
                forceReload: true
              })
            })
          }


        }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formTitleContainer: {
    padding: 10
  },
  formTitle: {
    color: "#6F6F6F"
  },
  radioItem: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-start'
  },
  selectedDateContainer: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 3

  },
  selectedDateText: {
    color: '#F44336'
  }
})