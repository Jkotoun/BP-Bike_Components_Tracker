import * as React from 'react';

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
import { StyleSheet, Text, View } from 'react-native';
import activeScreenName from './App/modules/screenName';
import { AuthenticatedUserContext } from './context'
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import firebaseApp from './App/config/firebase';
import { getAuth } from "firebase/auth"
import {syncDataWithStrava} from "./App/modules/firestoreActions";
import { ActivityIndicator } from 'react-native-paper';
const auth = getAuth(firebaseApp)

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//check if tabbar should be visible on current active screen
function tabBarVisible() {
  const currentScreen = activeScreenName(useNavigationState(state => state));
  const tabBarHiddenPages = ["BikeDetail", "ComponentDetail", "RideDetail", "AddBikeScreen"]
  //true if current screen is not in array
  return !tabBarHiddenPages.includes(currentScreen)
}

export default function Root() {
  
  const [isUpdatingAuth, setIsUpdatingAuth] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const { User, setUser, IsLoggedIn, setIsLoggedIn } = React.useContext(AuthenticatedUserContext);
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
    if(IsLoggedIn)
    {
      if(User.stravaAuth || User.stravaConnected)    
      {
        setIsSyncing(true)
        syncDataWithStrava(User, setUser).then(() => {
    
          setIsSyncing(false)
        })
      }
    } 
  }, [IsLoggedIn])
  
  
  // if (initializing) return null;
  if (isUpdatingAuth || isSyncing) {
    return (
    <View style={styles.mainContainer}>
      <ActivityIndicator size='large' color="#ffffff"/>  
      <View style={{padding:20}}>

        {isUpdatingAuth && <Text style={{color:"#ffffff",  fontSize:20, fontWeight:'700'}}>Logging in</Text>}
        {isSyncing && <Text style={{color:"#ffffff", fontSize:20, fontWeight:'700'}}>Syncing with strava</Text>}    

      </View>
    </View>)
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
                headerShown: false,
                headerTitleStyle: styles.headerTitle,
                tabBarStyle: {
                  height: 55,
                  display: tabBarVisible() ? "flex" : "none"
                },
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


})