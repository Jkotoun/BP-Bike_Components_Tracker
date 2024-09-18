
import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, StatusBar, TouchableOpacity, Image, Alert } from 'react-native';
import { getFirestore, doc, getDocs, getDoc, query, collection, where, deleteDoc, orderBy } from 'firebase/firestore';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
import { useIsFocused } from "@react-navigation/native";
import { deleteRide, syncDataWithStrava, getLoggedUserData, connectAccWithStrava } from "../modules/firestoreActions";
import { rideSecondsToString, rideDistanceToString, formatDate, strToSearchFormat } from '../modules/helpers'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { isStravaUser, stravaAuthReq, getTokens } from '../modules/stravaApi';
import Toast from 'react-native-simple-toast';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';
import { Searchbar } from 'react-native-paper';


const auth = getAuth(firebaseApp)

//load all rides and bike reference doc
async function loadRides(loggedUser) {
  let ridesArray = []
  let ridesDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "rides"), where("user", "==", doc(getFirestore(firebaseApp), "users", loggedUser.uid)), orderBy('date', "desc")))
  ridesDocRef.forEach(ride => {
    let rideData = ride.data()
    rideData.id = ride.id
    ridesArray.push(rideData)
  })
  const promises = ridesArray.map(async ride => {
    if (ride.bike) {
      ride.bike = (await getDoc(ride.bike)).data()
    }
    return ride
  })
  const ridesWithBikeObj = await Promise.all(promises)
  return ridesWithBikeObj
}




export default function BikesListScreen({ navigation, route }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const isFocused = useIsFocused();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const images = {
    route: require("../assets/images/route_icon.png"),
  };
  function runStravaSync() {
    setIsSyncing(true)
    syncDataWithStrava(User, setUser).then(() => {
      setIsSyncing(false)
      setIsLoaded(false)
    })
      .catch(() => {
        Toast.show("Strava synchronization failed")
        setIsSyncing(false)

      })
  }


  const [request, response, promptAsync] = stravaAuthReq()
  // connect account with strava on authorization success
  React.useEffect(() => {
    if (response?.type === 'success') {
      try {
        //check scopes
        let authResponseScopes = response.params.scope.split(',')
        let requiredScopes = ["activity:read_all", "profile:read_all"]
        if (!requiredScopes.every(scope => authResponseScopes.includes(scope))) {
          throw new Error("Authorization failed, permission to activities or profile info denied")
        }
        const { code } = response.params;
        //add strava api access tokens to database and update user react context
        getTokens(code).then(tokens => {
          return connectAccWithStrava(tokens, User)
        }).then(() => {
          return getLoggedUserData()
        }).then((loggedUserData) => {
          let currentUser = getAuth().currentUser
          setIsLoggedIn(false)
          setUser({ ...loggedUserData, ...currentUser })
          setIsLoggedIn(true)
        })
      }
      catch (error) {
        Toast.show(error.message, Toast.LONG);

      }
    }
  }, [response]);


  //set stack header menu options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger text={<Icon name="dots-vertical" size={25} color="#ffffff" />} />
          <MenuOptions>
            {(isStravaUser(User) && <MenuOption onSelect={() =>
              runStravaSync()
            } text={"Resync strava"} style={styles.menuOption} />)}

            <MenuOption onSelect={async () => { await auth.signOut() }} text={"Log out"} style={styles.menuOption} />
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation]);


  React.useEffect(() => {
    loadRides(User).then((ridesArray) => {
      setRides(ridesArray)
      setfilteredRides(ridesArray)
      setIsLoaded(true)
    })

  }, [isFocused, isLoaded])

  const [rides, setRides] = React.useState([]);
  const [filteredRides, setfilteredRides] = React.useState([])


  //ride delete confirm dialog
  const [showBox, setShowBox] = React.useState(true);
  const showConfirmDialog = (rideId, rideName) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete ride " + rideName + " ?",
      [
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            deleteRide(rideId).then(() =>
              setIsLoaded(false))
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  const [searchQuery, setsearchQuery] = React.useState('')


  const filterRides = (query) => {
    setsearchQuery(query);
    if(searchQuery === ''){
      setfilteredRides(rides)
    }
    else{
      
      let filtered = rides.filter(ride => strToSearchFormat(ride.name).includes(strToSearchFormat(query)))
      setfilteredRides(filtered)
    }

  }

  if (!isLoaded || isSyncing) {
    return (<View style={styles.loadContainer}>

      <ActivityIndicator size="large" color="#F44336" />
      {isSyncing && <Text style={{ color: '#F44336', fontSize: 16, fontWeight: '700' }}>Syncing strava data</Text>}

      <View style={styles.addButtonContainer}>
        <FAB style={styles.addButton} icon="plus" onPress={() => navigation.navigate("AddRideScreen")} />
      </View>
    </View>)
  }
  else {

    return (
      <View style={styles.mainContainer}>
        <StatusBar backgroundColor="#F44336" />
        <ScrollView>
          <View style={styles.rideCardsContainer}>
            <Searchbar style={styles.searchBar} placeholder='Vyhledat...' value={searchQuery} onChangeText={(query)=>filterRides(query)} ></Searchbar>
            {rides.length == 0 && <Text style={{ padding: 20, fontSize: 17, fontWeight: '700' }}>Sync rides from strava or add ride using '+' button</Text>}

            {filteredRides.map(ride => {

              let infoObj = {
                "Distance": rideDistanceToString(ride.distance),
                "Total time": rideSecondsToString(ride.rideTime),
                "Activity date": formatDate(ride.date.toDate())
              }

              if (ride.stravaSynced) {
                return <Card title={ride.name} stravaIcon={true} description2={"Bike: " + (ride.bike ? ride.bike.name : "not assigned")} icon={images.route} displayInfo={infoObj} onPress={() => {
                  navigation.navigate('RideDetail', {
                    rideId: ride.id,
                    rideName: ride.name
                  })
                }} />
              }
              else {
                const rideOptions = [
                  {
                    text: "Edit",
                    onPress: () => {
                      navigation.navigate("AddRideScreen", {
                        rideId: ride.id
                      })
                    }
                  },
                  {
                    text: "Delete",
                    onPress: () => {
                      showConfirmDialog(ride.id, ride.name)
                    }
                  }
                ]
                
                return <Card key={ride.id} options={rideOptions} title={ride.name} description2={"Bike: " + (ride.bike ? ride.bike.name : "not assigned")} icon={images.route} displayInfo={infoObj} onPress={() => {
                  navigation.navigate('RideDetail', {
                    rideId: ride.id,
                    rideName: ride.name
                  })
                }} />
              }
            })}
          </View>
        </ScrollView>
        {!isStravaUser(User) &&
          <View style={styles.stravaConnectContainer}>
            <TouchableOpacity onPress={() => {
              promptAsync({useProxy: Constants.expoConfig.extra.useProxyAuthServer});

            }}>
              <Image source={require('../assets/images/btn_strava_connectwith_light.png')} />
            </TouchableOpacity>
          </View>}
        <View style={styles.addButtonContainer}>
          <FAB style={styles.addButton} icon="plus" onPress={() => navigation.navigate("AddRideScreen")} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stravaConnectContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1
  },
  searchBar:{
    marginVertical:5
  },
  rideCardsContainer: {
    marginTop: 5,
    alignItems: 'center',
    flex: 9,
    paddingHorizontal: 10

  },
  addButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingBottom: 30,
    paddingRight: 20,
    zIndex: 99
  },
  addButton: {
    backgroundColor: "#F44336"
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuOption: {
    padding: 8
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
  },
})