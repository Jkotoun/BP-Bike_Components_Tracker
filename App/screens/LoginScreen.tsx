import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { TextInput } from "react-native-paper"
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

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
  revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
};

function saveUserData(userId, userData){
  setDoc(doc(getFirestore(firebaseApp), "users", userId), userData);
}
const auth = getAuth(firebaseApp)
const redirectUri = makeRedirectUri({
  native: "bikecomponentsmanager://stravaAuth"
})
async function getTokens(code) {
  const tokens = await exchangeCodeAsync(
    {
      clientId: Constants.manifest.extra.stravaClientId,
      redirectUri: redirectUri,
      code: code,
      extraParams: {
        // You must use the extraParams variation of clientSecret.
        // Never store your client secret on the client.
        client_secret: Constants.manifest.extra.stravaSecret
      },
    },
    { tokenEndpoint: 'https://www.strava.com/oauth/token' }
  );
  return tokens

}

WebBrowser.maybeCompleteAuthSession();

async function createStravaAuthAccount(authTokens, athlete)
{
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    String(athlete.id+Constants.manifest.stravaAccPwdSec)
  );
  console.log(authTokens)
  createUserWithEmailAndPassword(auth, athlete.id+"@stravauser.com", hash).then(userObj => saveUserData(userObj.user.uid, {
    username: athlete.username,
    stravaAuth: true,
    stravaInfo: {
      accessToken: authTokens.accessToken,
      refreshToken: authTokens.refreshToken,
      accessTokenExpiration: authTokens.issuedAt +authTokens.expiresIn 
    }

  }));
}

async function loginWithStravaAcc(athlete)
{
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    String(athlete.id+Constants.manifest.stravaAccPwdSec)
  );
  signInWithEmailAndPassword(auth,athlete.id + "@stravauser.com", hash)
}

export default function LoginScreen({ navigation }) {

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: Constants.manifest.extra.stravaClientId,
      scopes: ['profile:read_all'],

      redirectUri: redirectUri
      // makeRedirectUri({
      // For usage in bare and standalone
      // the "redirect" must match your "Authorization Callback Domain" in the Strava dev console.
      //   useProxy: true
      // }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      let authAthlete, authStravaTokens;
      getTokens(code).then(tokens => {
        authStravaTokens = tokens
        return stravaApi.getAthlete(tokens.accessToken)

      }).then(athlete => {
        authAthlete = athlete;
        return fetchSignInMethodsForEmail(auth, athlete.id + "@stravauser.com");
      }).then(authMethods => 
        {
          if(authMethods.length == 0)
          {
            createStravaAuthAccount(authStravaTokens, authAthlete)
          }
          else
          {
            loginWithStravaAcc(authAthlete)
            // console.log("TODO checknout, jestli je to strava authenticated user, jinak chyba")
          }
        }
        )

    }
  }, [response]);


  const { User, setUser } = React.useContext(AuthenticatedUserContext)
  const { control, setError, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {


    try {
      if (data.email !== '' && data.password !== '') {
        signInWithEmailAndPassword(auth, data.email, data.password);
      }
    } catch (error) {
      setError('password', { type: "authentication", message: "chybaaaa" });
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
          <Text style={styles.submit_text}>SIGN IN</Text>
        </TouchableOpacity>

        <Text onPress={() => navigation.navigate('Register')} style={styles.registerFormRedirect}>Don't have account? <Text style={{ fontWeight: 'bold' }}>Sign Up! </Text></Text>
        <Text style={styles.orText}>Or</Text>
        <TouchableOpacity onPress={() => {
          promptAsync();
        }}>
          <Image source={require('../assets/images/btn_strava_connectwith_light.png')} />
        </TouchableOpacity>
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
    backgroundColor: '#F44336'
  },
  scrollViewContainer: {
    alignItems: 'center'
  }
});