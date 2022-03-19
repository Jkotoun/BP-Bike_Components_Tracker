import * as React from 'react';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './App/screens/LoginScreen';
import RegisterScreen from './App/screens/RegisterScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentsListStack from './App/screens/ComponentsListStack';
import BikesListStack from './App/screens/BikesListStack';
import RidesListStack from './App/screens/RidesListStack';
import { useNavigationState } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import { StyleSheet, Text, View, StatusBar, Alert, Button } from 'react-native';
import activeScreenName from './App/modules/helpers';
import { AuthenticatedUserContext } from './context'
import { getFirestore, getDoc, doc, updateDoc } from 'firebase/firestore';
import firebaseApp from './App/config/firebase';
import { getAuth } from "firebase/auth"
import { syncDataWithStrava, getLoggedUserData } from "./App/modules/firestoreActions";
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import {isStravaUser, stravaAuthReq} from './App/modules/stravaApi';
import * as stravaApi from './App/modules/stravaApi';

const auth = getAuth(firebaseApp)

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



// //check if tabbar should be visible on current active screen
// function tabBarVisible(): boolean {
//   const currentScreen = activeScreenName(useNavigationState(state => state));
//   const tabBarHiddenPages = ["BikeDetail", "ComponentDetail", "RideDetail", "AddBikeScreen"]
//   //true if current screen is not in array
//   return !tabBarHiddenPages.includes(currentScreen)
// }

function headerVisible(): boolean {
  const currentScreen = activeScreenName(useNavigationState(state => state));
  //undefined is first screen on app launch
  return ["BikesListScreen", "ComponentsListScreen", "RidesListScreen", undefined, "Bikes", "All components", "Rides"].includes(currentScreen)
}

//TODO mozna presunout do firestore func modelu
//add strava account info to firestore doc in users collection
async function connectAccWithStrava(tokens, user) {
  updateDoc(doc(getFirestore(firebaseApp), "users", user.uid),
    {
      stravaConnected: true,
      stravaInfo: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiration: new Date((tokens.issuedAt + tokens.expiresIn)*1000)
      }
    })
}




export default function Root() {

  const [Test, setTest] = React.useState(0)
  const [checked, setChecked] = React.useState(false);
  const [isUpdatingAuth, setIsUpdatingAuth] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const [request, response, promptAsync] = stravaAuthReq()
  const { User, setUser, IsLoggedIn, setIsLoggedIn } = React.useContext(AuthenticatedUserContext);

  // connect account with strava on authorization success
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      stravaApi.getTokens(code).then(tokens => {
        return connectAccWithStrava(tokens, User)
      }).then(() => {
       
        return getLoggedUserData()
      }).then((loggedUserData) => {

          let currentUser = getAuth().currentUser
          setIsLoggedIn(false)
          setUser({...loggedUserData, ...currentUser })
          setIsLoggedIn(true)
        })
    }
  }, [response]);


  React.useEffect(() => {
    console.log("loading app")
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(authenticatedUser => {
      try {
        setIsUpdatingAuth(true)
        if (authenticatedUser) {
          getDoc(doc(getFirestore(firebaseApp), "users", authenticatedUser.uid)).then(user => {
            setUser({ ...authenticatedUser, ...user.data() })
            setIsLoggedIn(true)
          });
        }
        else {
          setIsLoggedIn(false)
          setUser(null)
        }
        setIsUpdatingAuth(false);
        // setIsLoading(false);
      } catch (error) {
        console.log("err");
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  React.useEffect(() => {
    if (IsLoggedIn) {
      if (User.stravaAuth || User.stravaConnected) {
        setIsSyncing(true)
        syncDataWithStrava(User, setUser).then(() => {

          setIsSyncing(false)
        })
      }
    }
  }, [IsLoggedIn])


//TODO predelat znovunacitani
  React.useEffect(() => {
    setIsLoaded(true)
  }, [checked]);
  // if (initializing) return null;
  if (isUpdatingAuth || isSyncing) {
    return (
      <>
        <StatusBar
          backgroundColor="#F44336"
        />
        <View style={styles.mainContainer}>
          <ActivityIndicator size='large' color="#ffffff" />
          <View style={{ padding: 20 }}>

            {isUpdatingAuth && <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: '700' }}>Logging in</Text>}
            {isSyncing && <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: '700' }}>Syncing with strava</Text>}

          </View>
        </View>
      </>
    )
  }
  else {
    if (!isLoaded) {
      return (
        <>
          <View style={styles.loadContainer}>
            <StatusBar
              backgroundColor="#F44336"
            />

            <ActivityIndicator size="large" color="#F44336" />
          </View>
        </>
      )
    }
    else {
      return (
        // pass info about logged user to all child screens

        <MenuProvider>
          <NavigationContainer>
            {/* Main 3 tabs if logged in */}
            {IsLoggedIn ?

              <Tab.Navigator
                screenOptions={({ route }) => ({
                  headerStyle: styles.header,
                  tabBarLabelStyle: styles.tabBarLabel,
                  tabBarIconStyle: styles.tabBarIcon,
                  headerShown: headerVisible(), 
                  headerTitleStyle: styles.headerTitle,
                  tabBarStyle: {
                    height: 55,
                  },
                  //TODO refactor
                  headerRight: () => (
                    <Menu style={styles.menu}>
                      <MenuTrigger text={<Icon name="dots-vertical" size={25} color="#ffffff" />} />
                      <MenuOptions>
                        <MenuOption onSelect={() => { setIsLoaded(false); setChecked(!checked); }} text={
                          <>
                            <View style={{ flexDirection: 'column' }}>

                              <View style={{ flexDirection: 'row' }}>

                                <Checkbox

                                  color={customOrange}
                                  status={checked ? 'checked' : 'unchecked'}
                                  onPress={() => {
                                    setIsLoaded(false);
                                    setChecked(!checked);
                                  }} />
                                <Text style={{ marginTop: 7.5 }}> View retired</Text>
                              </View>
                            </View>


                          </>
                        }

                          style={styles.menuOption} />
                                {!(isStravaUser(User)) &&
                        <MenuOption onSelect={() => { promptAsync() }} text={"Connect to Strava"} style={styles.menuOption} />

            
        }
                        <MenuOption onSelect={async () => { await auth.signOut() }} text={"Log out"} style={styles.menuOption} />
                      </MenuOptions>

                    </Menu>
                  ),
                  tabBarActiveTintColor: customOrange,
                  tabBarInactiveTintColor: 'gray',
                })}
              >

                <Tab.Screen name="Bikes" initialParams={{ viewRetired: checked }} component={BikesListStack} options={{
                  tabBarLabel: 'Bikes',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="bike" color={color} size={size} />
                  ),
                }}
                />

                <Tab.Screen name="All components" initialParams={{ viewRetired: checked }} component={ComponentsListStack} options={{
                  tabBarLabel: 'All components',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
                  ),
                }}
                />

                <Tab.Screen name="Rides" component={RidesListStack} options={{
                  tabBarLabel: 'Rides',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="map-marker" color={color} size={size} />
                  ),
                }}
                />

              </Tab.Navigator>
              :

              // Login screen if not logged in 
              <Stack.Navigator initialRouteName="Login" screenOptions={{
                headerShadowVisible: false,
                headerTitle: "",
                headerStyle: styles.header,
              }}
              >
                <Stack.Screen name="Login" options={{ animation: "none" }} component={LoginScreen} />
                <Stack.Screen name="Register" options={{ animation: "slide_from_right" }} component={RegisterScreen} />
              </Stack.Navigator>
            }

          </NavigationContainer>
        </MenuProvider>

      );
    }
  }


}

//styles
const customOrange = '#F44336'
const styles = StyleSheet.create({


  header: {
    backgroundColor: customOrange
  },
  headerTitle: {
    color: 'white'
  },
  tabBarLabel:
  {
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 5,
  },

  tabBarIcon:
  {
    marginTop: 5
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: customOrange,
    justifyContent: 'center'
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
  },
  menuOption: {
    padding:8
    
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})