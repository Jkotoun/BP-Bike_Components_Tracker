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
import { syncDataWithStrava, getLoggedUserData, connectAccWithStrava } from "./App/modules/firestoreActions";
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import { isStravaUser, stravaAuthReq } from './App/modules/stravaApi';
import * as stravaApi from './App/modules/stravaApi';
import Toast from 'react-native-simple-toast';

const auth = getAuth(firebaseApp)

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();





export default function Root() {

  const [isUpdatingAuth, setIsUpdatingAuth] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(true);
  const { User, setUser, IsLoggedIn, setIsLoggedIn } = React.useContext(AuthenticatedUserContext);



  function runStravaSync() {
    setIsSyncing(true)
    syncDataWithStrava(User, setUser).then(() => {

      setIsSyncing(false)
    })
      .catch((error) => {
        Toast.show("Strava synchronization failed")
        setIsSyncing(false)

      })
  }

  React.useEffect(() => {
    // onAuthStateChanged returns an unsubscriber

    const unsubscribeAuth = auth.onAuthStateChanged(authenticatedUser => {
      setIsUpdatingAuth(true)
      if (authenticatedUser) {
      setIsUpdatingAuth(true)

        getDoc(doc(getFirestore(firebaseApp), "users", authenticatedUser.uid)).then(user => {
          setUser({ ...authenticatedUser, ...user.data() })
          setIsLoggedIn(true)
          setIsUpdatingAuth(false);

        });
      }
      else {
        setIsLoggedIn(false)
        setUser(null)
        setIsUpdatingAuth(false);

      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  React.useEffect(() => {
    if (IsLoggedIn) {
      if (User.stravaAuth || User.stravaConnected) {
        runStravaSync()
      }
    }
  }, [IsLoggedIn])



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
            
            {!isUpdatingAuth && isSyncing && <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: '700' }}>Syncing Strava data</Text>}

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


      if (IsLoggedIn) {
        return(
          <MenuProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIconStyle: styles.tabBarIcon,
                headerShown: false,
                tabBarStyle: {
                  height: 55,
                },
                animation:'none',



                tabBarActiveTintColor: customOrange,
                tabBarInactiveTintColor: 'gray',
              })}
            >

              <Tab.Screen name="Bikes" component={BikesListStack} options={{
                tabBarLabel: 'Bikes',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="bike" color={color} size={size} />
                ),
              }}
              />

              <Tab.Screen name="All components" component={ComponentsListStack} options={{
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
          </NavigationContainer>
        </MenuProvider>
        )
       
      }
      else {

        return (
          // pass info about logged user to all child screens

          <MenuProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login" screenOptions={{
                headerShadowVisible: false,
                headerTitle: "",
                headerStyle: styles.header,
                headerTintColor:'white'
              }}
              >
                <Stack.Screen name="Login" options={{ animation: "none", headerShown:false }} component={LoginScreen} />
                <Stack.Screen name="Register" options={{ animation: "slide_from_right" }} component={RegisterScreen} />
              </Stack.Navigator>


            </NavigationContainer>
          </MenuProvider>

        );
      }
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
    padding: 8

  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})