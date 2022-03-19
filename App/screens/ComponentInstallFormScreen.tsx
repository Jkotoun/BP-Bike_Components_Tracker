import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text, StyleSheet, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, getDoc, FieldValue, increment } from 'firebase/firestore';
import { installComponent } from '../modules/firestoreActions'
import Toast from 'react-native-simple-toast';

export default function ComponentInstallFormScreen({ navigation, route }) {


  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [checked, setChecked] = React.useState('selected');

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

        <RadioButton.Item
          style={styles.radioItem}
          color='#F44336'
          label={
            <TouchableOpacity onPress={() => showMode('date')}>
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>{date.toLocaleDateString('cs-CZ').split('T')[0] + " " + date.getHours() + ":" + date.getMinutes()}</Text>
              </View>
            </TouchableOpacity>} value="selected" />
        <RadioButton.Item label="Since beggining" value="default" color="#F44336" style={styles.radioItem} />
      </RadioButton.Group>

      <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
        <Button title='Save' color='#F44336' onPress={() => {

          if (checked == "default") {
            getDoc(doc(getFirestore(firebaseApp), "bikes", route.params.bikeId))
              .then(bikeRef => {
                installComponent(route.params.componentId, route.params.bikeId, bikeRef.data().purchaseDate.toDate()).then(() => {
                  navigation.navigate("BikeComponentsList")
                })
                  .catch((error) => {
                    Toast.show(error)
                  })
              })
          }
          else {
            installComponent(route.params.componentId, route.params.bikeId, date)
              .then(() => {
                navigation.navigate("BikeComponentsList", {
                })
              })
              .catch((error) => {
                Toast.show(error)
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