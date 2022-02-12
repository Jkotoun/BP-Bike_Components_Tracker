import * as React from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './App/screens/LoginScreen';
import RegisterScreen from './App/screens/RegisterScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentsListStack from './App/screens/ComponentsListStack';
import BikesListStack from './App/screens/BikesListStack';
import RidesListStack from './App/screens/RidesListStack';
import AuthenticatedContext from './context';
import { useNavigationState } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import { StyleSheet } from 'react-native';
import activeScreenName from './App/services/screenName';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//check if tabbar should be visible on current active screen
function tabBarVisible() {
  const currentScreen = activeScreenName(useNavigationState(state => state));
  const tabBarHiddenPages = ["BikeDetail", "ComponentDetail", "RideDetail", "AddBikeScreen"]
  //true if current screen is not in array
  return !tabBarHiddenPages.includes(currentScreen)
}

export default function App() {

  const [IsLoggedIn, setIsLoggedIn] = React.useState(true)
  const [User, setUser] = React.useState({})
  const loggedUserInfo = { IsLoggedIn, setIsLoggedIn, User, setUser }

  return (
    // pass info about logged user to all child screens
    <AuthenticatedContext.Provider value={loggedUserInfo}> 
      <MenuProvider>  {/*needed for vertical dots menu library*/}
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
    </AuthenticatedContext.Provider>
  );
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


})