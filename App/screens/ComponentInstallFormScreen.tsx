import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, getDoc, FieldValue, increment } from 'firebase/firestore';
import { installComponent } from '../modules/firestoreActions'
import Toast from 'react-native-simple-toast';
import { Button } from 'react-native-paper'
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDateTime } from '../modules/helpers';
import { TextInput } from "react-native-paper"

export default function ComponentInstallFormScreen({ navigation, route }) {


  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [checked, setChecked] = React.useState('selected');
  const [installationNote, setinstallationNote] = React.useState('')
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

  let submit = () => {
    setisSubmitting(true)
    getDoc(doc(getFirestore(firebaseApp), "bikes", route.params.bikeId)).then((bike) => {
      //date is set as since purchase or custom selected
      let installationDate = checked == "default" ? bike.data().purchaseDate.toDate() : date
      installComponent(route.params.componentId, route.params.bikeId, installationDate, installationNote)
        .then(() => {
          navigation.navigate("BikeComponentsList")
          setisSubmitting(false)

        })
        .catch((error) => {
          Toast.show(error.message)
          setisSubmitting(false)
        })
    })
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (isSubmitting) {
          return <ActivityIndicator color="white" style={{ paddingRight: 20 }} />
        }
        else {
          return <Button theme={{ colors: { primary: 'black' } }} onPress={() => submit()}><Check name="check" size={24} color="white" /></Button>
        }
      }

    });
  }, [navigation, date, checked, isSubmitting, installationNote]);
  return (
    <View style={styles.contentContainer}>
      <View style={styles.alignContentContainer}>
        <Text style={styles.formTitle}>Installation date and time</Text>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          maximumDate={new Date()}
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
                <Text style={styles.selectedDateText}>{formatDateTime(date)}</Text>
              </View>
            </TouchableOpacity>} value="selected" />
        <RadioButton.Item label="Since purchase" value="default" color="#F44336" style={styles.radioItem} />
      </RadioButton.Group>
      <View style={styles.alignContentContainer}>
        <TextInput
          theme={{ colors: { primary: '#F44336' } }}
          mode='outlined'
          style={styles.input}
          onChangeText={value => {setinstallationNote(value);}}
          value={installationNote}
          label='Installation note (optional)'
          numberOfLines={4}
          multiline
        />
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop:20,
    paddingBottom:10
  },
  alignContentContainer: {
    paddingLeft: 25,
  },
  input: {
    color: "black",
    backgroundColor: "#ffffff",
    width: "95%",

  },
  formTitle: {
    color: "#000000",
    fontSize: 17,
    fontWeight: '700'
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