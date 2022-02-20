import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import {TextInput} from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { AuthenticatedUserContext} from '../../context' 
import { getAuth, signInWithEmailAndPassword,   FacebookAuthProvider} from "firebase/auth"
import firebaseApp from '../config/firebase';



import { GoogleAuthProvider } from "firebase/auth";
async function loginWithFacebook() {
  
}



const auth = getAuth(firebaseApp)
export default function LoginScreen({ navigation }) {
  const { User, setUser } = React.useContext(AuthenticatedUserContext)
  const { control, setError, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) =>{


    try 
    {
      if (data.email !== '' && data.password !== '') 
      {
        signInWithEmailAndPassword(auth,data.email,data.password);
      }
    } catch (error) {
       setError('password', { type: "authentication", message: "chybaaaa"});
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.scrollViewContainer}>
        <StatusBar backgroundColor="#F44336"/>
      
        <Text style={styles.formHeader}>Bike Components Manager</Text>
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
        {errors.email?.type=='required' && <Text style={{ color: "white" }}>Email is required.</Text>}
        

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
                selectionColor={'black'}
                secureTextEntry={true}
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
        {errors.password?.type=='required' && <Text style={{ color: "white" }}>Password is required</Text>}

        <Text style={{ color: "white" }}>{errors.password?.type=='authentication' &&  errors.password.message}</Text>
        <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submit_text}>SIGN IN</Text>
        </TouchableOpacity>

        <Text onPress={() => navigation.navigate('Register')} style={styles.registerFormRedirect}>Don't have account? <Text style={{ fontWeight: 'bold' }}>Sign Up! </Text></Text>
        <Text style={styles.orText}>Or</Text>
       
        <Image source={require('../assets/images/btn_strava_connectwith_light.png')} />
   
      </ScrollView >
    </View>

  );
}

const styles = StyleSheet.create({
  registerFormRedirect:{
    color: "white", 
    alignSelf:"center"
  },
  orText:{
    color: "white", 
    fontWeight: "bold", 
    padding: 15, 
    fontSize: 17
  },
  input: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 300,
    margin: 7,},
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
    textAlign:'left'
  },
  mainContainer:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F44336'
  },
  scrollViewContainer:{
    alignItems: 'center'
  }
});