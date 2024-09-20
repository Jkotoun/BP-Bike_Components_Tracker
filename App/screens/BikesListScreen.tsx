
import * as React from 'react';
import { View, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, Image, StatusBar, ActivityIndicator, Button } from 'react-native';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import { AuthenticatedUserContext } from '../../context'
import firebaseApp from '../config/firebase';
import { getFirestore, doc, updateDoc, getDocs, getDoc, query, collection, where, deleteDoc, orderBy } from 'firebase/firestore';
import { changeBikeState, deactivateBike, getLoggedUserData, connectAccWithStrava, syncDataWithStrava } from "../modules/firestoreActions";
import { useIsFocused } from "@react-navigation/native";
import { rideSecondsToString, rideDistanceToString} from '../modules/helpers';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-simple-toast';
import Constants from 'expo-constants';
import BikeImages from "../modules/bikeIcons";

import { isStravaUser, stravaAuthReq, getTokens } from '../modules/stravaApi';
const auth = getAuth(firebaseApp)


export default function BikesListScreen({ navigation, route }) {
  const [isSyncing, setIsSyncing] = React.useState(false)

  function runStravaSync() {
    setIsSyncing(true)
    syncDataWithStrava(User, setUser).then(() => {
      setIsSyncing(false)
      setIsLoaded(false)
    })
      .catch((error) => {
        Toast.show("Strava synchronization failed")
        setIsSyncing(false)
      })
  }


  const [request, response, promptAsync] = stravaAuthReq()
  
  // connect account with strava on authorization success
  React.useEffect(() => {
    if (response?.type === 'success') {
      try {
        let authResponseScopes = response.params.scope.split(',')
        let requiredScopes = ["activity:read_all", "profile:read_all"]
        if (!requiredScopes.every(scope => authResponseScopes.includes(scope))) {
          throw new Error("Authorization failed, permission to activities or profile info denied")
        }
        const { code } = response.params;
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

  const [viewRetiredChecked, setviewRetiredChecked] = React.useState(false);
  //set stack header menu options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger text={<Icon name="dots-vertical" size={25} color="#ffffff" />} />
          <MenuOptions>
            <MenuOption onSelect={() => {
              setviewRetiredChecked(!viewRetiredChecked);
            }}
              text={
                <>
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Checkbox
                        color={'#F44336'}
                        status={viewRetiredChecked ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setviewRetiredChecked(!viewRetiredChecked);
                        }}
                      />
                      <Text style={{ marginTop: 7.5 }}> View retired</Text>
                    </View>
                  </View>
                </>
              }
              style={styles.menuOption} />

            {(isStravaUser(User) && <MenuOption onSelect={() =>
              runStravaSync()
            } text={"Resync strava"} style={styles.menuOption} />)}

            <MenuOption onSelect={async () => { await auth.signOut() }} text={"Log out"} style={styles.menuOption} />
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation, viewRetiredChecked]);




  navigation.navigationOptions = {}
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const isFocused = useIsFocused();

  //bikes loading
  React.useEffect(() => {
    let bikeStatesQuery = ["active"];
    if (viewRetiredChecked) {
      bikeStatesQuery.push("retired")
    }
    getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("user", "==", doc(getFirestore(firebaseApp), "users", User.uid)), where("state", 'in', bikeStatesQuery), orderBy("name", "asc"))).then(bikesDocRef => {
      const bikesArray = []
      bikesDocRef.forEach(bike => {
        let bikeData = bike.data()
        bikeData.bikeId = bike.id
        bikesArray.push(bikeData)
      })
      setBikes(bikesArray)
      setIsLoaded(true)
    })
  }, [isFocused, isLoaded, viewRetiredChecked])
  const [bikes, setBikes] = React.useState([]);



  
  //confirm dialog for bike delete
  const [showBox, setShowBox] = React.useState(true);
  const showConfirmDialog = (bikeId, bikeName) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete bike " + bikeName + " ?",
      [
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            deactivateBike(bikeId, "deleted").then(() =>
              setIsLoaded(false))
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  if (!isLoaded || isSyncing) {
    return (
      <View style={styles.loadContainer}>
        <StatusBar backgroundColor="#F44336" />

        <ActivityIndicator size="large" color="#F44336" />
        {isSyncing && <Text style={{ color: '#F44336', fontSize: 16, fontWeight: '700' }}>Syncing strava data</Text>}
        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("AddBikeScreen")}
          />
        </View>
      </View>
    )
  }
  else {
    return (
      <View style={styles.mainContainer}>
        <ScrollView >
          <StatusBar backgroundColor="#F44336" />
          <View style={styles.bikeCardsContainer}>

            {bikes.length == 0 && <Text style={{ padding: 20, fontSize: 17, fontWeight: '700' }}>Sync bikes from strava or add bike using '+' button</Text>}

            {bikes.map(bike => {

              if (bike.stravaSynced) {
                return <Card key={bike.bikeId} stravaIcon={true} title={bike.name} description={bike.type.label} icon={BikeImages[bike.type.value]} displayInfo={{
                  "Distance": rideDistanceToString(bike.initialRideDistance + bike.rideDistance),
                  "Ride Time": rideSecondsToString(bike.rideTime + bike.initialRideTime)
                }} onPress={() => {
                  navigation.navigate('BikeDetailTabs', {
                    bikeId: bike.bikeId,
                    bikeName: bike.name
                  })
                }} />
              }
              else {
                const bikeOptions = [
                  {
                    text: "Edit",
                    onPress: () => {
                      navigation.navigate("AddBikeScreen", {
                        bikeId: bike.bikeId
                      })
                    }
                  },
                  {
                    text: "Delete",
                    onPress: () => {
                      showConfirmDialog(bike.bikeId, bike.name)
                    }
                  }
                ]
                if (bike.state == "active") {
                  bikeOptions.push({
                    text: "Retire",
                    onPress: () => {
                      deactivateBike(bike.bikeId, "retired").then(() =>
                        setIsLoaded(false)
                      )
                    }
                  })
                }
                else if (bike.state == "retired") {
                  bikeOptions.push({
                    text: "Reactivate",
                    onPress: () => {
                      changeBikeState(bike.bikeId, "active").then(() =>
                        setIsLoaded(false)
                      )
                    }
                  })
                }

                return <Card key={bike.bikeId} options={bikeOptions} active={bike.state == "active"} title={bike.state == "active" ? bike.name : (bike.name + " - retired")} description={bike.type.label} icon={BikeImages[bike.type.value]} displayInfo={{
                  "Distance": rideDistanceToString(bike.initialRideDistance + bike.rideDistance),
                  "Ride Time": rideSecondsToString(bike.rideTime + bike.initialRideTime)
                }} onPress={() => {
                  navigation.navigate('BikeDetailTabs', {
                    bikeId: bike.bikeId,
                    bikeName: bike.name
                  })
                }} />
              }


            })}


          </View>
        </ScrollView>

        {!isStravaUser(User) &&
          <View style={styles.stravaConnectContainer}>
            <TouchableOpacity onPress={() => {
              promptAsync();
            }}>
              <Image source={require('../assets/images/btn_strava_connectwith_light.png')} />
            </TouchableOpacity>
          </View>}

        <View style={styles.addButtonContainer}>
          <FAB
            style={styles.addButton}
            icon="plus"
            onPress={() => navigation.navigate("AddBikeScreen")}
          />
        </View>

      </View>
    );
  }

}

const styles = {
  stravaConnectContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1
  },
  bikeCardsContainer: {
    alignItems: 'center',
    marginTop: 5,
    flex: 9,
    zIndex: 0,
    paddingHorizontal: 10

  },
  addButtonContainer: {
    right: 0,
    bottom: 0,
    paddingBottom: 30,
    paddingRight: 20,
    zIndex: 99,
    position: 'absolute',
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
}