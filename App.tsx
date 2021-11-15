import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './App/screens/LoginScreen';
import RegisterScreen from './App/screens/RegisterScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AllComponentsListScreen from './App/screens/AllComponentsListScreen';
import BikesListScreen from './App/screens/BikesListScreen';
import RidesListScreen from './App/screens/RidesListScreen';
import AuthenticatedContext from './context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



export default function App() {
  const[authenticated,  setAuthenticated] = React.useState(true)
  const value = {authenticated, setAuthenticated}
  return (

      <AuthenticatedContext.Provider value={value}>
    <NavigationContainer>
    {authenticated && <Tab.Navigator
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
            headerTitleStyle: {
              color: 'white'
            },

            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen name="Bikes" component={BikesListScreen} />
          <Tab.Screen name="All components" component={AllComponentsListScreen} />
          <Tab.Screen name="Rides" component={RidesListScreen} />
        </Tab.Navigator> }
     

        {!authenticated && <Stack.Navigator initialRouteName="Login" screenOptions={{
          headerStyle: {
            backgroundColor: '#F44336'
          },
          headerShadowVisible: false,
          headerTitle: "",
          animation: 'slide_from_right',
          headerTintColor: '#ffffff'
        }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      }



    </NavigationContainer>
      </AuthenticatedContext.Provider>


  );
}