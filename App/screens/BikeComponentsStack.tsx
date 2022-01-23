
import * as React from 'react';
import { Text} from 'react-native';
import {Button, Colors} from "react-native-paper"
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeComponentsList from "./BikeComponentsList"
import AllComponentsListScreen from './AllComponentsListScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentTabs from './ComponentTabs';
export default function BikesListStack({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="BikeComponentsList" screenOptions={{
      animation: 'none',
      headerShown: false
    }}>
      <Stack.Group>
        <Stack.Screen name="BikeComponentsList" component={BikeComponentsList} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
 
        <Stack.Screen name='AllComponentsListScreen' component={AllComponentsListScreen}/>
        <Stack.Screen name="ComponentDetail" options={{title: "Component xxx"}} component={ComponentTabs} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
