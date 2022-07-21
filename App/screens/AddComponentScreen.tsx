import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView,  ActivityIndicator } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
import { addComponent, getComponent, updateComponent } from '../modules/firestoreActions'
import { useIsFocused } from "@react-navigation/native";
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper'

export default function AddComponentScreen({ navigation, route }) {
  const componentTypes = [
    { label: 'Brake', value: 'brake' },
    { label: 'Brake disc', value: 'brake_disc' },
    { label: 'Brake pads', value: 'brake_pads' },
    { label: 'Chain', value: 'chain' },
    { label: 'Chainrings', value: 'chainrings' },
    { label: 'Cassette', value: 'cassette' },
    { label: 'Derailleur', value: 'derailleur' },
    { label: 'Fork', value: 'fork' },
    { label: 'Rear suspension', value: 'suspension' },
    { label: 'Rim', value: 'rim' },
    { label: 'Tire', value: 'tire' },
    { label: 'Other', value: 'other' }
  ]
  const [selectedLanguage, setSelectedLanguage] = useState();

  const auth = getAuth(firebaseApp)

  const isFocused = useIsFocused();
  const [isSubmitting, setisSubmitting] = useState(false);

  const [isLoaded, setisLoaded] = useState(false)
  const [componentToEdit, setComponentToEdit] = useState(Object)

  React.useEffect(() => {
    setisLoaded(false)
    if (route.params && route.params.componentId) {

      getComponent(route.params.componentId)
      .then(componentDoc => {
        setComponentToEdit(componentDoc.data())
      })
      .then(() => {
        setisLoaded(true)
      })
    }
    else {
      setisLoaded(true)
    }
  }, [isFocused])





  const { control, setError, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });
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
  }, [navigation, isSubmitting, componentToEdit]);
  const onSubmit = data => {
    setisSubmitting(true)
    data.type = componentTypes.find(biketype => biketype.value == data.type)
    //time to seconds
    data.initialRideTime = Number(data.initialRideTime) * 60 * 60
    //distance to meters
    data.initialRideDistance = Number(data.initialRideDistance) * 1000
    data.user = doc(getFirestore(firebaseApp), "users", auth.currentUser.uid)

    if (route.params && route.params.componentId) //edit
    {
      updateComponent(doc(collection(getFirestore(firebaseApp), "components"), route.params.componentId), data)
      .then(() => {
        setisSubmitting(false)
        navigation.goBack(null)
      })
    }
    else //add new 
    {
      data.state = "active"
      data.rideTime = 0
      data.rideDistance = 0
      addComponent(data).then(() => {
        setisSubmitting(false)
        navigation.goBack(null)
      })
    }


  }
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
          <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{
            alignItems: 'center',
          }}>
            <StatusBar
              backgroundColor="#F44336"
            />
            <Controller

              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Component name is required"
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
                  label='Component name'
                />
              )}
              name="name"
              defaultValue={componentToEdit.name ? componentToEdit.name : ""}
            />
            {errors.name && <Text style={styles.errorMessage}>{errors.name.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Component type is required"
                }
              }}
              render={({ field: { onChange, value } }) => (

                <RNPickerSelect
                  onValueChange={onChange}
                  value={value}
                  placeholder={{ label: 'Component type' }}

                  items={componentTypes}
                  style={pickerStyle}
                />
              )}
              name="type"
              defaultValue={componentToEdit.type ? componentToEdit.type.value : ""}
            />
            {errors.type && <Text style={styles.errorMessage}>{errors.type.message}</Text>}
            <Controller

              control={control}
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
              defaultValue={componentToEdit.brand ? componentToEdit.brand : ""}
            />
            {errors.brand && <Text style={styles.errorMessage}>{errors.brand.message}</Text>}

            <Controller
              control={control}
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
              defaultValue={componentToEdit.model ? componentToEdit.model : ""}
            />
            {errors.model && <Text style={styles.errorMessage}>{errors.model.message}</Text>}

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
              defaultValue={componentToEdit.initialRideDistance !== undefined ? (componentToEdit.initialRideDistance / 1000).toString() : ""}
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
              defaultValue={componentToEdit.initialRideTime !== undefined ? (componentToEdit.initialRideTime / 3600).toString() : ""}
            />
            {errors.initialRideTime && <Text style={styles.errorMessage}>{errors.initialRideTime.message}</Text>}


          </ScrollView >
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    alignItems: 'center',
  },
  formContainer:{
    paddingVertical: 15 ,
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
  formHeader: {
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 50,
    fontSize: 24,
    textAlign: 'left',
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
const pickerStyle = {
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
  }
};