import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, ScrollView,  ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { useState } from "react";
import { getFirestore, addDoc,getDoc, collection, doc } from 'firebase/firestore';
import * as firestorage from 'firebase/storage';
import firebaseApp from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper'

async function AddWearRecord(formData, image, componentId){
  let componentRef = await getDoc(doc(getFirestore(firebaseApp), "components", componentId))
  formData.component = componentRef.ref
  formData.date = new Date()
  formData.rideDistance = componentRef.data().rideDistance + componentRef.data().initialRideDistance 
  formData.rideTime = componentRef.data().rideTime + componentRef.data().initialRideTime
  //upload image if user set any
  if(image)
  {
    let filename = image.uri.substring(image.uri.lastIndexOf('/')+1);
    let uploadResult = await uploadImageAsync(image.uri, filename)
    formData.image = uploadResult.ref.fullPath
  }

   return addDoc(collection(getFirestore(firebaseApp), "componentWearRecords"), formData)
}

//upload image to cloud storage
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
  const [isLoaded, setisLoaded] = useState(true)
  const [isSubmitting, setisSubmitting] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection:false,
      aspect: [4, 3],
      quality: 0.5,
    });


    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };


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
  }, [navigation, image, isSubmitting]);

  const { control, register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });

  const onSubmit = data => {
    setisSubmitting(true)
    AddWearRecord(data, image, route.params.componentId).then(()=>{
      setisSubmitting(false)
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
                  multiline={true}
                />

              )}
              
              name="description"
              defaultValue={""}
            />
            {errors.description && <Text style={styles.errorMessage}>{errors.description.message}</Text>}
            <TouchableOpacity style={styles.imgInputTouchable} onPress={pickImage}>
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
            <View style={styles.imgContainer}>
            {image && <Image style={styles.imgStyles} source={{ uri: image.uri }}  />}
            </View>

          </ScrollView >
        </View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  imgContainer:
  {
    flexDirection:'row',
    padding:8
  },
  imgStyles:{
    resizeMode: 'contain',
    flex: 1,
    aspectRatio: 1
  },
  imgInputTouchable:{
    width:"100%",
    alignItems:'center'
  },
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

