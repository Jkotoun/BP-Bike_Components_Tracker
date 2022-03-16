import * as React from 'react';
import {Text, View, StatusBar, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form'
import { Headline } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, setDoc, doc } from 'firebase/firestore';



const auth  =getAuth(firebaseApp)
function saveUserData(userId, userData){
  setDoc(doc(getFirestore(firebaseApp), "users", userId), {
    username: userData.username,
    stravaAuth: false,
    stravaConnected: false
  });
}


export default function RegisterScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const onSubmit =  async (data) => {
    try {
      if (data.email !== '' && data.password !== '' && data.password == data.password_repeat) {
        createUserWithEmailAndPassword(auth,data.email,data.password).then(userObj => saveUserData(userObj.user.uid, data));
        
      }
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <View style={styles.mainContainer}>
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.scrollViewStyles}>
        <StatusBar backgroundColor="#F44336"/>
        <Headline style={styles.formHeader}>Bike Components Manager</Headline>
        
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
            theme={{colors: {primary: 'black'}}}
            underlineColor="transparent"
            mode='flat'
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label='Username'
            />
          )}
          name="username"
          defaultValue=""
        />
        {errors.username && <Text style={{ color: "white" }}>Username is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
            theme={{colors: {primary: 'black'}}}
            underlineColor="transparent"
            mode='flat'
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label='Email'
            />
          )}
          name="email"
          defaultValue=""
        />
        {errors.username && <Text style={{ color: "white" }}>Email is required.</Text>}


        <Controller
          control={control}
          rules={{
            required: true
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
            theme={{colors: {primary: 'black'}}}
            underlineColor="transparent"
            mode='flat'
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label='Password'
            />
          )}
          
          name="password"
          defaultValue=""
        />
        {errors.password && <Text style={{ color: "white" }}>Password is required</Text>}

        <Controller
          control={control}
          rules={{
            required: true
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
            theme={{colors: {primary: 'black'}}}
            underlineColor="transparent"
            mode='flat'
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label='Password again'
            />
          )}
          name="password_repeat"
          defaultValue=""
        />
        {errors.password && <Text style={{ color: "white" }}>Password again is required</Text>}

        <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submit_text}>SIGN UP</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>

  );
}




const styles = StyleSheet.create({
  input: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 300,
    margin: 7,
  },
  submit_text: {
    color: "#F44336",
    textAlign: 'center',
    fontWeight: "bold"
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
    paddingBottom:25,
    fontSize: 24,
    textAlign:'left'
  },
  mainContainer:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F44336'
  },
  scrollViewStyles:{
    alignItems: 'center'
  }
});