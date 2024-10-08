import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { useIsFocused } from "@react-navigation/native";
import {Button} from 'react-native-paper'
import Check from 'react-native-vector-icons/MaterialCommunityIcons';

import { addBike, getBike, updateBike } from '../modules/firestoreActions'
import Toast from 'react-native-simple-toast';
import { formatDateTime } from '../modules/helpers';
export default function AddBikeScreen({ navigation, route }) {
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const isFocused = useIsFocused();
  const [isSubmitting, setisSubmitting] = useState(false);

  const datePickerHandler = (selectedDate) => {
    const currentDate = selectedDate || purchaseDate;
    setShow(Platform.OS === 'ios');
    setPurchaseDate(currentDate);
    
  };
  const auth = getAuth(firebaseApp)
  
  const [isLoaded, setisLoaded] = useState(false)
  const [bikeToEdit, setbikeToEdit] = useState(Object)
  
  React.useEffect(() => {
    setisLoaded(false)
    if (route.params && route.params.bikeId) {
      getBike(route.params.bikeId).then(bikeDoc => {
        setbikeToEdit(bikeDoc.data())
        setPurchaseDate(bikeDoc.data().purchaseDate.toDate())
      }).then(() => {

        setisLoaded(true)
      })
    }
    else {
      setisLoaded(true)
    }
  }, [isFocused])

  React.useLayoutEffect(() => {
    navigation.setOptions({
        headerRight:()=> 
        { 
          if(isSubmitting)
          {
            return <ActivityIndicator color="white" style={{paddingRight:20}} />
          }
          else
          {
            return <Button  theme={{colors: {primary: 'black'}}}  onPress={handleSubmit(onSubmit)}><Check name="check" size={24} color="white"/></Button>
          }
      }

    });
  }, [navigation, isSubmitting, purchaseDate, bikeToEdit]);

  const { control, register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });

  const onSubmit = data => {
    try
    {
      setisSubmitting(true)
      if(purchaseDate > new Date())
      {
        throw new Error("Purchase date can't be in future")
      }
      data.type = bikeTypes.find(biketype => biketype.value == data.type)
      data.purchaseDate = purchaseDate
      //convert time to seconds
      data.initialRideTime = Number(data.initialRideTime) * 60 * 60
      //convert ride distance to meters
      data.initialRideDistance = Number(data.initialRideDistance) * 1000
      data.user = doc(getFirestore(firebaseApp), "users", auth.currentUser.uid)
      
      
      
      if (route.params && route.params.bikeId) {
        updateBike(doc(getFirestore(firebaseApp), "bikes", route.params.bikeId),data).then(() => {
          setisSubmitting(false)
          navigation.goBack(null)
        })
      }
      else {
        data.state = "active"
        data.rideTime = 0
        data.rideDistance = 0
        addBike(data)
        .then(() => {
          setisSubmitting(false)
          navigation.goBack(null)
        })
      }
    }
    catch(error)
    {
      setisSubmitting(false)
      Toast.show(error.message)
    }
  
  }

  
  const bikeTypes = [
    { label: 'Mountain bike', value: 'mtb' },
    { label: 'Gravel', value: 'gravel' },
    { label: 'Road', value: 'road' },
    { label: 'Other', value: 'other' }

  ]
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
                  value={ value}
                  error={!!errors.name}
                  label='Bike name'
                />
              )}
              name="name"
              defaultValue={bikeToEdit.name? bikeToEdit.name : ""}
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
                  placeholder={{ label: 'Select bike type'}}
                />
              )}
              name="type"
              defaultValue={bikeToEdit.type? bikeToEdit.type.value : ""}
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
              defaultValue={bikeToEdit.brand? bikeToEdit.brand: ""}
            />
            {errors.brand && <Text style={styles.errorMessage}>{errors.brand.message}</Text>}

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Model is required"
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
              defaultValue={bikeToEdit.model? bikeToEdit.model: ""}
            />
            {errors.model && <Text style={styles.errorMessage}>{errors.model.message}</Text>}



            {show && (

              <DateTimePicker
                testID="dateTimePicker"
                value={purchaseDate}
                mode="date"
                maximumDate={new Date()}
                is24Hour={true}
                display="default"
                onChange={(event, value) => {
                  datePickerHandler(value)
                }}
              />
            )}



            <TouchableOpacity style={styles.dateInputTouchable} onPress={() => setShow(true)}>
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                editable={false}
                pointerEvents="none"
                value={formatDateTime(purchaseDate)}
                label='Purchase Date'
              />
            </TouchableOpacity>


            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Km to date is required"
                },
                pattern: {
                  value: /^[0-9]*[\.]?[0-9]+$/,
                  message: "Ride distance must be positive number"
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
              defaultValue={bikeToEdit.initialRideDistance != undefined? (bikeToEdit.initialRideDistance/1000).toString(): ""}
            />
            {errors.initialRideDistance && <Text style={styles.errorMessage}>{errors.initialRideDistance.message}</Text>}



            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Ride hours to date is required"
                },
                pattern: {
                  value: /^[0-9]*[\.]?[0-9]+$/,
                  message: "Ride hours must be positive number"
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
              defaultValue={bikeToEdit.initialRideTime != undefined ? (bikeToEdit.initialRideTime/3600).toString(): ""}
            />
            {errors.initialRideTime && <Text style={styles.errorMessage}>{errors.initialRideTime.message}</Text>}
          </ScrollView >
        </View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    paddingVertical: 15,
    width:"90%"
  },
  input: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: "98%",
    margin: 7,
  },
  dateInputTouchable:{
    width:"100%",
    alignItems:'center'
  },

  formHeader: {
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 50,
    fontSize: 24,
    textAlign: 'left'
  },
  errorMessage: {
    alignSelf: 'flex-start',
    paddingLeft: "1%",
    color: 'red'
  },
  loadContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  }
});

const pickerStyles = {
  inputIOS: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width:"98%",
    marginVertical:7,
    marginLeft:"1%",
    padding: 30,
  },
  inputAndroid: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width:"98%",
    marginVertical:7,
    marginLeft:"1%",
    padding: 30,
  },
  placeholder: {
    color: "grey"
  },


}
