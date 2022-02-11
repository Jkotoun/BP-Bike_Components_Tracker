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
import { Button } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// function getVisibility(route) {
//   const routeName = getFocusedRouteNameFromRoute(route);
//   console.log(routeName);
//   const tabBarHiddenPages = ["BikeDetail", "ComponentDetail", "RideDetail", "AddBikeScreen"]
//   if (tabBarHiddenPages.includes(routeName))
//   {
//     return false
//   }
//   else
//   {
//     return true;
//   }
// }


function getCurrentRoute(nav) {

  if (nav) {

    if (nav.routes[nav.index].state) {
      return getCurrentRoute(nav.routes[nav.index].state)
    }
    else {
      return nav.routes[nav.index].name
    }
  }
}

function getVisibility() {
  const state = useNavigationState(state => state);
  const routeName = getCurrentRoute(state);
  const headerHiddenPages = ["BikeDetail", "ComponentDetail", "RideDetail", "AddBikeScreen"]
  if (headerHiddenPages.includes(routeName)) {
    return false
  }
  else {
    return true;
  }
}

export default function App() {
  const [IsLoggedIn, setIsLoggedIn] = React.useState(true)
  const [User, setUser] = React.useState({})
  const value = { IsLoggedIn, setIsLoggedIn, User, setUser }
  return (

    <AuthenticatedContext.Provider value={value}>
      <MenuProvider>
        <NavigationContainer>
          {IsLoggedIn ?

            <Tab.Navigator

              screenOptions={({ route }) => ({


                headerStyle: {
                  backgroundColor: '#F44336'
                },

                tabBarLabelStyle:
                {
                  fontSize: 14,
                  fontWeight: "bold",
                  paddingBottom: 5,

                },

                tabBarIconStyle: {
                  marginTop: 5
                },
                headerShown: false,
                headerTitleStyle: {
                  color: 'white'
                },
                tabBarStyle: {
                  height: 55,
                  display: getVisibility() ? "flex" : "none"
                },

                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',

              })}>
              <Tab.Screen

                options={{
                  tabBarLabel: 'Bikes',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="bike" color={color} size={size} />
                  ),


                }}

                name="Bikes" component={BikesListStack} />
              <Tab.Screen
                options={{
                  tabBarLabel: 'All components',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
                  ),
                }}
                name="All components" component={ComponentsListStack} />
              <Tab.Screen
                options={{
                  tabBarLabel: 'Rides',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="map-marker" color={color} size={size} />
                  ),
                }}
                name="Rides" component={RidesListStack} />

            </Tab.Navigator>
            :


            <Stack.Navigator initialRouteName="Login" screenOptions={{
              headerStyle: {
                backgroundColor: '#F44336'
              },
              headerShadowVisible: false,
              headerTitle: "",

              headerTintColor: '#ffffff'
            }}>
              <Stack.Screen name="Login" options={{ animation: "none" }} component={LoginScreen} />
              <Stack.Screen name="Register" options={{ animation: "slide_from_right" }} component={RegisterScreen} />
            </Stack.Navigator>
          }



        </NavigationContainer>
      </MenuProvider>
    </AuthenticatedContext.Provider>


  );
}