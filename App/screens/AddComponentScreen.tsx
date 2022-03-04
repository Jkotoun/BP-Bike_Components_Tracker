import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, Button } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';

export default function AddComponentScreen({ navigation }) {
  const componentTypes = [
    { label: 'Fork', value: 'fork' },
    { label: 'Chain', value: 'chain' },
    { label: 'Cassette', value: 'cassette' },
    { label: 'Rear suspension', value: 'suspension' },
    { label: 'todo dalsi', value: 'dalsi' }
  ]
  const [selectedLanguage, setSelectedLanguage] = useState();

  const auth = getAuth(firebaseApp)
  const { control, setError, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });
  const onSubmit = data => {

    console.log(data)
    data.type = componentTypes.find(biketype => biketype.value == data.type)
    data.rideTime = Number(data.rideTime) * 60 * 60
    data.rideDistance = Number(data.rideDistance)
    data.user = doc(getFirestore(firebaseApp), "users", auth.currentUser.uid)
    addDoc(collection(getFirestore(firebaseApp), "components"), data).then(() => {
      navigation.navigate("ComponentsListScreen", { forceReload: true })
    })


  }

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
    }}>
      <View style={{ paddingVertical: 15 }}>
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
                message: "Compnent name is required"
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
            defaultValue=""
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
            defaultValue=""
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
                value: /^[0-9]*$/,
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
            name="rideDistance"
            defaultValue=""
          />
          {errors.rideDistance && <Text style={styles.errorMessage}>{errors.rideDistance.message}</Text>}


          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: "Ride hours to date is required"
              },
              pattern: {
                value: /^[0-9]*$/,
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
            name="rideTime"
            defaultValue=""
          />
          {errors.rideTime && <Text style={styles.errorMessage}>{errors.rideTime.message}</Text>}

          <View style={{ padding: 20, width: "100%" }}>
            <Button color={"#F44336"} title="Submit" disabled={!isValid} onPress={handleSubmit(onSubmit)} />
          </View>
        </ScrollView >
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
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
  errorMessage: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    color: 'red'
  }
});
const pickerStyle = {
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
  }
};