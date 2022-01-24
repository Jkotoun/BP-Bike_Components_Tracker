
import * as React from 'react';
import { Text} from 'react-native';
import {Button, Colors} from "react-native-paper"
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ComponentWearHistoryScreen from'./ComponentWearHistoryScreen'
export default function ComponentWearHistoryStack({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="ComponentWearHistoryScreen" screenOptions={{
      animation: 'none',
      headerShown: false
    }}>
      <Stack.Group>
        <Stack.Screen name="ComponentWearHistoryScreen" component={ComponentWearHistoryScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
      </Stack.Group>
    </Stack.Navigator>

  );
}
