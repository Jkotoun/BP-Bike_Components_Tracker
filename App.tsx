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
import {Button} from 'react-native'

let bottomNavigatorConfigs = {
  tabBarOptions: {
      style: { height: 300 },
  },
};
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



export default function App() {
  const[IsLoggedIn,  setIsLoggedIn] = React.useState(true)
  const[User,  setUser] = React.useState({})
  const value = {IsLoggedIn, setIsLoggedIn, User, setUser}
  return (

      <AuthenticatedContext.Provider value={value}>
    <NavigationContainer>
    {IsLoggedIn ?
    <Tab.Navigator
          screenOptions={({ route }) => ({
           
           
            headerStyle: {
              backgroundColor: '#F44336'
            },
            tabBarLabelStyle:
            {
              fontSize:14,
              fontWeight: "bold",
              paddingBottom:5,
              
            },
            tabBarIconStyle:{
              marginTop:5
            },
            headerShown: false,
            headerTitleStyle: {
              color: 'white'
            },
            tabBarStyle:{
              height:55
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
          
          name="Bikes"  component={BikesListStack}/>
          <Tab.Screen 
          options={{
            tabBarLabel: 'Componennt',
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
          <Stack.Screen name="Login" options={{animation:"none"}} component={LoginScreen} />
          <Stack.Screen name="Register" options={{animation:"slide_from_right" }} component={RegisterScreen} />
        </Stack.Navigator>
      }



    </NavigationContainer>
      </AuthenticatedContext.Provider>


  );
}