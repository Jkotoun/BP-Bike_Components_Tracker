import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { ActivityIndicator, TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { AuthenticatedUserContext } from '../../context'
import { getAuth, signInWithEmailAndPassword, fetchSignInMethodsForEmail, createUserWithEmailAndPassword } from "firebase/auth"
import firebaseApp from '../config/firebase';
import Constants from 'expo-constants';
import * as stravaApi from '../modules/stravaApi';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from 'expo-auth-session';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';
import Toast from 'react-native-simple-toast';
import { saveUserData } from '../modules/firestoreActions'
// Endpoint



//create firebase auth account using strava athlete info
async function createStravaAuthAccount(authTokens, athlete) {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    String(
      // athlete.id + 
      Constants.expoConfig.extra.stravaAccPwdSec)
  );

  return createUserWithEmailAndPassword(auth, athlete.id + "@stravauser.com", hash).then(userObj => saveUserData(userObj.user.uid, {
    username: athlete.username,
    stravaAuth: true,
    stravaInfo: {
      accessToken: authTokens.accessToken,
      refreshToken: authTokens.refreshToken,
      accessTokenExpiration: new Date((authTokens.issuedAt + authTokens.expiresIn) * 1000) //new date takes miliseconds
    }
  }),
  );

}

//login to Strava athlete account in firebase auth
async function loginWithStravaAcc(athlete) {
  console.log(athlete.id)
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    String(
      athlete.id + 
      Constants.expoConfig.extra.stravaAccPwdSec)
  );
  return signInWithEmailAndPassword(auth, athlete.id + "@stravauser.com",  hash)
}

const auth = getAuth(firebaseApp)
export default function LoginScreen({ navigation }) {

  const [request, response, promptAsync] = stravaApi.stravaAuthReq()
  const [isLoggingIn, setisLoggingIn] = React.useState(false)
  const [authorizingStrava, setauthorizingStrava] = React.useState(false)
  React.useEffect(() => {
    if (response?.type === 'success') {

      setauthorizingStrava(true)
      const { code } = response.params;
      let authAthlete, authStravaTokens;
      try {
        //check given scopes
        let authResponseScopes = response.params.scope.split(',')
        let requiredScopes = ["activity:read_all", "profile:read_all"]
        if (!requiredScopes.every(scope => authResponseScopes.includes(scope))) {
          setauthorizingStrava(false)
          throw new Error("Authorization failed, permission to activities or profile info denied")
        }
        //get athlete info to log in or register
        stravaApi.getTokens(code).then(tokens => {
          authStravaTokens = tokens
          return stravaApi.getCurrentlyAuthorizedAthlete(authStravaTokens.accessToken)
        }).then(athlete => {
          //check if strava user has account in app
          authAthlete = athlete;
          return fetchSignInMethodsForEmail(auth, athlete.id + "@stravauser.com");
        }).then(authMethods => {
          //user doesnt have account - create one 
          if (authMethods.length == 0) {
            createStravaAuthAccount(authStravaTokens, authAthlete).catch(() => {
              setError('password', { type: "authentication", message: "Strava authentication failed" });
            })
          }
          else {
            //login to acc
            loginWithStravaAcc(authAthlete).catch(() => {
              setError('password', { type: "authentication", message: "Strava authentication failed" });
              setauthorizingStrava(false)

            })
          }
        }
        )
      }
      catch (error) {
        Toast.show(error.message, Toast.LONG);
        setauthorizingStrava(false)
      }
    }
  }, [response]);


  const { User, setUser } = React.useContext(AuthenticatedUserContext)
  const { control, setError, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    setisLoggingIn(true)
    //login on submit
    if (data.email !== '' && data.password !== '') {
      signInWithEmailAndPassword(auth, data.email, data.password).then(() => setisLoggingIn(false)).catch(() => {
        setError('password', { type: "authentication", message: "Wrong email or password" });
        setisLoggingIn(false)
      });
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.scrollViewContainer}>
        <StatusBar backgroundColor="#F44336" />

        <Text style={styles.formHeader}>Bike Components Manager</Text>
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
        {errors.email?.type == 'required' && <Text style={{ color: "white" }}>Email is required.</Text>}


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
        {errors.password?.type == 'required' && <Text style={{ color: "white" }}>Password is required</Text>}

        <Text style={{ color: "white" }}>{errors.password?.type == 'authentication' && errors.password.message}</Text>
        <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submit_text}>
            {isLoggingIn ? <ActivityIndicator color="#F44336" /> : "LOG IN"}

          </Text>
        </TouchableOpacity>

        <Text onPress={() => navigation.navigate('Register')} style={styles.registerFormRedirect}>Don't have account? <Text style={{ fontWeight: 'bold' }}>Sign Up! </Text></Text>
        <Text style={styles.orText}>Or</Text>



        {authorizingStrava ?
          <ActivityIndicator color="white" />


          :
          <TouchableOpacity onPress={() => {
            promptAsync({useProxy: Constants.expoConfig.extra.useProxyAuthServer});
          }}>
            <Image source={require('../assets/images/btn_strava_connectwith_light.png')} />
          </TouchableOpacity>
        }
      </ScrollView >
    </View>

  );
}

const styles = StyleSheet.create({
  registerFormRedirect: {
    color: "white",
    alignSelf: "center"
  },
  orText: {
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
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingTop: 50
  },
  scrollViewContainer: {
    alignItems: 'center'
  }
});