import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, ScrollView,  ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { useState } from "react";
import { getFirestore, addDoc,getDoc, collection, doc } from 'firebase/firestore';
import * as firestorage from 'firebase/storage';
import firebaseApp from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper'

async function AddWearRecord(formData, image, componentId){
  let componentRef = await getDoc(doc(getFirestore(firebaseApp), "components", componentId))
  formData.component = componentRef.ref
  formData.date = new Date()
  formData.rideDistance = componentRef.data().rideDistance
  formData.rideTime = componentRef.data().rideTime

  if(image)
  {
    let filename = image.uri.substring(image.uri.lastIndexOf('/')+1);
    let uploadResult = await uploadImageAsync(image.uri, filename)
    formData.image = uploadResult.ref.fullPath
  }

   return addDoc(collection(getFirestore(firebaseApp), "componentWearRecords"), formData)

  
//  return 
}


async function uploadImageAsync(uri, filename) {
  const blob: any = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
    reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
});
  let storageRef = firestorage.getStorage(firebaseApp)
  return firestorage.uploadBytes(firestorage.ref(storageRef, filename), blob).then((result)=> 
    {
      blob.close() 
      return result
    })
  
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
      allowsMultipleSelection:true,
      aspect: [16, 9],
      quality: 0.5,
    });


    if (!result.cancelled) {
      setImage(result);
    }
  };


  React.useLayoutEffect(() => {
    navigation.setOptions({
        headerRight:()=> 
        { 
          return <Button  theme={{colors: {primary: 'black'}}}  onPress={handleSubmit(onSubmit)}><Check name="check" size={24} color="white"/></Button>
      }

    });
  }, [navigation, image]);




  const { control, register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });

  const onSubmit = data => {
    AddWearRecord(data, image, route.params.componentId).then(()=>{
      navigation.navigate("ComponentWearHistoryScreen")
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


          

            <TouchableOpacity onPress={pickImage}>
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                editable={false}
                pointerEvents="none"
                value={image? image.uri.substring(image.uri.lastIndexOf('/')+1) : ""}
                label='Component image (optional)'
              />
            </TouchableOpacity>


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
