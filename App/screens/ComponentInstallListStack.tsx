
import * as React from 'react';
import { Alert, Text} from 'react-native';
import {Button, Colors} from "react-native-paper"
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ComponentInstallListScreen from './ComponentInstallListScreen';
import ComponentInstallFormScreen from './ComponentInstallFormScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
export default function ComponentInstallListStack({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="ComponentInstallListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336',
      },
      headerShadowVisible:false,
      animation: 'none',
      headerTintColor: '#ffffff'
    }}>
      <Stack.Group>
        <Stack.Screen name="ComponentInstallListScreen" options={{ title: "Available components",
        
     headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={{marginLeft:-20}} onPress={()=>navigation.goBack(null)}><Close name="close" size={24} color="white"/></Button>}
      }} 
      
      
      
      component={ComponentInstallListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name='ComponentInstallFormScreen'
         options={{
           title:"Add component", 
           
           headerRight:()=> { return <Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.goBack(null)}><Check name="check" size={24} color="white"/></Button>},
           headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={{marginLeft:-20}} onPress={()=>navigation.goBack(null)}><Close name="close" size={24} color="white"/></Button>}
          }}
           component={ComponentInstallFormScreen} />

      </Stack.Group>
    </Stack.Navigator>

  );
}
