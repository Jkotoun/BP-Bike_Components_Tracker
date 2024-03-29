import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, ScrollView,  ActivityIndicator } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { useState } from "react";
import { getFirestore, addDoc,getDoc, collection, doc, updateDoc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { useIsFocused } from "@react-navigation/native";
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper'

async function addServiceRecord(data, componentId){
  let componentRef = await getDoc(doc(getFirestore(firebaseApp), "components", componentId))
  data.component = componentRef.ref
  data.date = new Date()
  data.price = Number(data.price)
  data.rideDistance = componentRef.data().rideDistance + componentRef.data().initialRideDistance
  data.rideTime = componentRef.data().rideTime + componentRef.data().initialRideTime
 return addDoc(collection(getFirestore(firebaseApp), "componentServiceRecords"), data)
}


export default function AddServiceRecord({ navigation, route }) {
  const [isSubmitting, setisSubmitting] = useState(false);

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
  }, [navigation, isSubmitting]);
  const isFocused = useIsFocused();
  const auth = getAuth(firebaseApp)
  const [isLoaded, setisLoaded] = useState(true)


  const { control, register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });

  const onSubmit = data => {
    setisSubmitting(true)
    addServiceRecord(data, route.params.componentId)
    .then(()=>{
      setisSubmitting(false)
      navigation.navigate("ServiceRecords")
    }) 
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
          <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ alignItems: 'center' }}>
            <StatusBar backgroundColor="#F44336" />

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Service record description is required"
                }
              }}

              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  theme={{ colors: { primary: '#F44336' } }}
                  underlineColor="transparent"
                  mode='flat'
                  multiline={true}
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={ value}
                  error={!!errors.name}
                  label='Description'
                />
              )}
              name="description"
              defaultValue={""}
            />
            {errors.description && <Text style={styles.errorMessage}>{errors.description.message}</Text>}



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
                  label='Service price (€)'
                />
              )}
              name="price"
              defaultValue=""
            />
            {errors.price && <Text style={styles.errorMessage}>{errors.price.message}</Text>}

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
  submit_text: {
    color: "#F44336",
    textAlign: 'center',
    fontWeight: "bold",

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




