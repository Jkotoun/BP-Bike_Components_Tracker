import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, ScrollView, Button, ActivityIndicator, Image } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { useState } from "react";
import { getFirestore, addDoc,getDoc, collection, doc, updateDoc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
async function AddWearRecord(data, componentId){
  let componentRef = await getDoc(doc(getFirestore(firebaseApp), "components", componentId))
  data.component = componentRef.ref
  data.date = Date.now()
  data.rideDistance = componentRef.data().rideDistance
  data.rideTime = componentRef.data().rideTime
 return addDoc(collection(getFirestore(firebaseApp), "componentWearRecords"), data)
}


export default function AddWearRecordScreen({ navigation, route }) {

  const isFocused = useIsFocused();
  const auth = getAuth(firebaseApp)
  const [isLoaded, setisLoaded] = useState(true)

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };







  const { control, register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });

  const onSubmit = data => {
    console.log(route.params.componentId)
    // addServiceRecord(data, route.params.componentId).then(()=> navigation.navigate("ServiceRecords"))
    // console.log(route.params.componentId)
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


            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>

{/* 
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
                  label='Service price'
                />
              )}
              name="price"
              defaultValue=""
            />
            {errors.price && <Text style={styles.errorMessage}>{errors.price.message}</Text>} */}




            <View style={{ padding: 20, width: "100%" }}>
              <Button color={"#F44336"} title="Submit" disabled={!isValid} onPress={handleSubmit(onSubmit)} />
            </View>
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
  errorMessage: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
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