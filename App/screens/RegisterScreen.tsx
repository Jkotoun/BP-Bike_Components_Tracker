import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form'
import { Headline } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import {saveUserData} from '../modules/firestoreActions'

const auth = getAuth(firebaseApp)


export default function RegisterScreen({ navigation }) {
  const [isRegistering, setisRegistering] = React.useState(false)

  const { control, handleSubmit, setError, formState: { errors }, clearErrors } = useForm();
  const onSubmit = async (data) => {

    setisRegistering(true)
    //create fire auth account and save user data to firestore
    if (data.password == data.password_repeat) {
      createUserWithEmailAndPassword(auth, data.email, data.password).then(userObj => saveUserData(userObj.user.uid, {
        username: data.username,
        stravaAuth: false,
        stravaConnected: false
      }))
      .then(()=>setisRegistering(false))
      .catch((error)=>{
        if(error.code == "auth/weak-password")
        {
          setError('password_repeat', { type: "submit_error", message: "Password should be at least 6 characters" });

        }
        else
        {
          setError('password_repeat', { type: "submit_error", message: "Email already in use" });
        }
        setisRegistering(false)
      })
    }
    else {
      setError('password_repeat', { type: "submit_error", message: "Passwords don't match" });
      setisRegistering(false)
    }
  };


  return (
    <View style={styles.mainContainer}>
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.scrollViewStyles}>
        <StatusBar backgroundColor="#F44336" />
        <Headline style={styles.formHeader}>Bike Components Manager</Headline>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              theme={{ colors: { primary: 'black' } }}
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
              theme={{ colors: { primary: 'black' } }}
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
              theme={{ colors: { primary: 'black' } }}
              underlineColor="transparent"
              mode='flat'
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
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
              theme={{ colors: { primary: 'black' } }}
              underlineColor="transparent"
              mode='flat'
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
              label='Password again'
            />
          )}
          name="password_repeat"
          defaultValue=""
        />
        {errors.password_repeat?.type == 'required' && <Text style={{ color: "white" }}>Password again is required</Text>}
        {errors.password_repeat?.type == 'submit_error'  && <Text style={{ color: "white" }}>{errors.password_repeat.message}</Text>}

        <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)}>
         
          {isRegistering? <ActivityIndicator color="#F44336"/> :  <Text style={styles.submit_text}>SIGN UP</Text> }

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
    paddingBottom: 25,
    fontSize: 24,
    textAlign: 'left'
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F44336'
  },
  scrollViewStyles: {
    alignItems: 'center'
  }
});