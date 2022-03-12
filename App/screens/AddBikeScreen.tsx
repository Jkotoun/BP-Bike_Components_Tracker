import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Platform } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { getAuth } from 'firebase/auth';
import {addBike} from '../modules/firestoreActions'
export default function AddBikeScreen({ navigation }) {
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const datePickerHandler = (selectedDate) => {
    const currentDate = selectedDate || purchaseDate;
    setShow(Platform.OS === 'ios');
    setPurchaseDate(currentDate);

  };
  const auth  = getAuth(firebaseApp)

 

  const { control,register, handleSubmit, formState: { errors, isValid } } = useForm({mode: 'all'});

  const onSubmit = data => {
    data.type = bikeTypes.find(biketype => biketype.value == data.type)
    data.purchaseDate = purchaseDate
    data.rideTime = 0
    data.rideDistance = 0
    data.initialRideTime = Number(data.initialRideTime)*60*60
    data.initialRideDistance = Number(data.initialRideDistance)*1000
    data.state = "active"
    data.user = doc(getFirestore(firebaseApp), "users", auth.currentUser.uid)

    addBike(data).then(() => {
      navigation.navigate("BikesListScreen", {forceReload: true})
    })
  }

  const bikeTypes = [
    { label: 'MTB full suspension', value: 'mtbfull' },
    { label: 'MTB hardtail', value: 'mtbht' },
    { label: 'Gravel', value: 'gravel' },
    { label: 'Road', value: 'road' }
  ]

  return (
    <View style={styles.mainContainer}>
      <View style={styles.formContainer}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ alignItems: 'center' }}>
          <StatusBar backgroundColor="#F44336" />

          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: "Bike name is required"
              }
            }}
            
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.name}
                label='Bike name'
              />
            )}
            name="name"
            defaultValue=""
          />
          {errors.name && <Text style={styles.errorMessage}>{errors.name.message}</Text>}
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: "Bike type is required"
              }
            }}
            render={({ field: { onChange, value } }) => (

              <RNPickerSelect 
                onValueChange={onChange}
                value={value}

                items={bikeTypes}
                style={pickerStyles}
              />
            )}
            name="type"
            defaultValue=""
          />
           {errors.type && <Text style={styles.errorMessage}>{errors.type.message}</Text>}
          <Controller

            control={control}
            rules={{
              required: {
                value: true,
                message: "Brand is required"
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label='Brand'
              />
            )}
            name="brand"
            defaultValue=""
          />
          {errors.brand && <Text style={styles.errorMessage}>{errors.brand.message}</Text>}

          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: "Brand is required"
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput 
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label='Model'
              />
            )}
            name="model"
            defaultValue=""
          />
          {errors.model && <Text style={styles.errorMessage}>{errors.model.message}</Text>}



          {show && (

            <DateTimePicker
              testID="dateTimePicker"
              value={purchaseDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event, value) => {
                datePickerHandler(value)
              }}
            />
            )}
            


              <TouchableOpacity onPress={() => setShow(true)}>
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                editable={false}
                pointerEvents="none"
                value={purchaseDate.toDateString()}
                label='Purchase Date'
                />
              </TouchableOpacity>


          <Controller
            control={control}
            rules={{
              required:{
                value: true,
                message: "Km to date is required"
              }, 
              pattern:{
                value: /^[0-9]*$/,
                message:"Ride distance must be positive number"
              }
            }}
        
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType='numeric'
                label='Km to date'
              />
            )}
            name="initialRideDistance"
          />
          {errors.rideDistance && <Text style={styles.errorMessage}>{errors.rideDistance.message}</Text>}



          <Controller
            control={control}
            rules={{
              required:{
                value: true,
                message: "Ride hours to date is required"
              }, 
              pattern:{
                value: /^[0-9]*$/,
                message:"Ride hours must be positive number"
              }

            }}

            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'

                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType='numeric'
                label='Ride hours to date'
              />
            )}
            name="initialRideTime"
          />
          {errors.rideTime && <Text style={styles.errorMessage}>{errors.rideTime.message}</Text>}
          <View style={{padding:20, width:"100%"}}>
          <Button color={"#F44336"} title="Submit" disabled={!isValid}  onPress={handleSubmit(onSubmit)} />
          </View>
        </ScrollView >
      </View>
    </View>

  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    paddingVertical: 15
  },
  input: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 335,
    margin: 7,
  },
  submit_text: {
    color: "#F44336",
    textAlign: 'center',
    fontWeight: "bold",

  },
  submit: {
    backgroundColor: "#ffffff",
    margin: 15,
    width: 300,
    padding: 10,
    textAlign: 'center'
  },
  formHeader: {
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 50,
    fontSize: 24,
    textAlign: 'left'
  },
  errorMessage:{
    alignSelf: 'flex-start', 
    paddingLeft:10, 
    color:'red'
  }
});

const pickerStyles = {
  inputIOS: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 335,
    margin: 7,
    padding: 30,
  },
  inputAndroid: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 335,
    margin: 7,
    padding: 30,

  },
  placeholder: {
    color: "grey"
  },

}
