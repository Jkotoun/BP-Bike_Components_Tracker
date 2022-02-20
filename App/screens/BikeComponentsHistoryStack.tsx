
import * as React from 'react';
import { Text } from 'react-native';
import { Button, Colors } from "react-native-paper"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeComponentsHistoryScreen from './BikeComponentsHistoryScreen'
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentTabs from './ComponentTabs';
export default function BikeComponentsHistoryStack({ navigation }) {


  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="BikeComponentsHistoryScreen" screenOptions={{
      animation: 'none',
      headerShown: false
    }}>
      <Stack.Group>
        <Stack.Screen name="BikeComponentsHistoryScreen" component={BikeComponentsHistoryScreen} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
