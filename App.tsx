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
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



export default function App() {
  const[IsLoggedIn,  setIsLoggedIn] = React.useState(false)
  const[User,  setUser] = React.useState({})
  const value = {IsLoggedIn, setIsLoggedIn, User, setUser}
  return (

      <AuthenticatedContext.Provider value={value}>
    <NavigationContainer>
    {IsLoggedIn && <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Bikes') {
                iconName = 'bike';
              } else if (route.name === 'All components') {
                iconName = 'cog-outline';
              }
              else if (route.name === 'Rides') {
                iconName = 'map-marker';
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            headerStyle: {
              backgroundColor: '#F44336'
            },
            headerShown: false,
            headerTitleStyle: {
              color: 'white'
            },
            // headerShown: ()=>{
            //   route.name === 'Bikes' ? true : false
            // },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          
          })}>
          <Tab.Screen name="Bikes" component={BikesListStack}/>
          <Tab.Screen name="All components" component={ComponentsListStack} />
          <Tab.Screen name="Rides" component={RidesListStack} />
          
        </Tab.Navigator> }
     

        {!IsLoggedIn && <Stack.Navigator initialRouteName="Login" screenOptions={{
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