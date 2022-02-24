
import * as React from 'react';
import { View, Alert, ScrollView, StyleSheet, Text , TouchableOpacity, Image} from 'react-native';

import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import { AuthenticatedUserContext } from '../../context'
import { getAuth } from 'firebase/auth';
import firebaseApp from '../config/firebase';
import { collection, getDoc, getDocs, getFirestore, query, where,doc, updateDoc } from 'firebase/firestore';
import Constants from 'expo-constants';
import * as stravaApi from '../modules/stravaApi';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from 'expo-auth-session';

async function log() {
  // updateDoc(doc(getFirestore(firebaseApp),"users", "J0CSXBukQpgSPuz3dLDhQxUm1Fg1"), {username: "bohuuus"})
  // getDoc().then(result => console.log(result.data()))
  // const bohusQuery = query(collection(getFirestore(firebaseApp), "users"), where("username", "==", "jkotoun"))
  // getDocs(bohusQuery).then(results => 
  // {
  //   results.forEach(userData => 
  //   {
  //     console.log(userData.data())
  //     if (userData.data().strava_info) 
  //     {
  //       console.log("connected")
  //     }
  //     else 
  //     {
  //       console.log("not connected")
  //     }
  //   })
  // })
}
// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
  revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
};
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

async function connectAccWithStrava(tokens, user)
{
  updateDoc(doc(getFirestore(firebaseApp),"users", user.uid), 
  {
    stravaConnected: true,
    stravaInfo:{
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiration: tokens.issuedAt +tokens.expiresIn 
    }
  })
}
const auth = getAuth(firebaseApp)
export default function BikesListScreen({ navigation }) {
  navigation.navigationOptions = {}
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);

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
      getTokens(code).then(tokens => {
        connectAccWithStrava(tokens, User)
        return tokens
      }).then(tokens => {
        setUser({...User, ...{stravaConnected: true,
          stravaInfo:{
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            accessTokenExpiration: tokens.issuedAt +tokens.expiresIn }
          }})
      }).then(() => console.log(User))

    }
  }, [response]);




  const info = { "Distance": "548 km", "Ride Time": '36h 18m' }
  const info2 = { "Distance": "1235 km", "Ride Time": '80h 10m' }
  const info3 = { "Distance": "2453 km", "Ride Time": '113h 43m' }
  const images = {
    mtb_full: require("../assets/images/full_suspension_mtb_icon.png"),
    road: require("../assets/images/road_icon.png")
  };
  const bikeOptions = [
    {
      text: "Edit",
      onPress: () => Alert.alert("edit")
    },
    {
      text: "Delete",
      onPress: () => Alert.alert("delete")
    }

  ]
  log()
  return (
    <View style={styles.mainContainer}>
      <ScrollView >
        <View style={styles.mainContainer}>

          <Card options={bikeOptions} title="Canyon grand canyon 8" description="MTB hardtail" icon={images.mtb_full} displayInfo={info} onPress={() => { navigation.navigate('BikeDetail') }} ></Card>
          <Card options={bikeOptions} title="Specialized" description="Road" displayInfo={info2} icon={images.mtb_full} onPress={() => { navigation.navigate('BikeDetail') }}></Card>
          {IsLoggedIn ? <Text>{User && User.email}</Text> : <Text>Ne</Text>}
  <Text>          {IsLoggedIn? ((User.stravaAuth || User.stravaConnected)? "pohoda" : "propoj si toooo") : "neprihlasen" }</Text>
          <Card options={bikeOptions} title="Qayron carma enduro full" description="MTB full suspension" displayInfo={info3} icon={images.mtb_full} onPress={() => { navigation.navigate('BikeDetail') }}></Card>
        </View>
      </ScrollView>
      <View style={styles.addButtonContainer}>
        <FAB
          style={styles.addButton}
          icon="plus"
          onPress={() => navigation.navigate("AddBikeScreen")}
        />
      </View>
      {!(User.stravaConnected ||User.stravaAuth)  &&  
      <TouchableOpacity onPress={() => {
          promptAsync();
        }}>
          <Image source={require('../assets/images/btn_strava_connectwith_light.png')} />
        </TouchableOpacity>
        }
    </View>

  );
}

const styles = {
  mainContainer: {
    flex: 1
  },
  bikeCardsContainer: {
    alignItems: 'center',
    marginTop: 5,
    flex: 9,
    zIndex: 0
  },
  addButtonContainer: {
    right: 0,
    bottom: 0,
    paddingVertical: 30,
    paddingHorizontal: 20,
    zIndex: 99,
    position: 'absolute',
  },
  addButton: {
    backgroundColor: "#F44336"
  }
}