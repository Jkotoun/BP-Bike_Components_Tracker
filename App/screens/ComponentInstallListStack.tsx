
import * as React from 'react';
import { Alert, Text } from 'react-native';
import { Button, Colors } from "react-native-paper"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ComponentInstallListScreen from './ComponentInstallListScreen';
import ComponentInstallFormScreen from './ComponentInstallFormScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import AddComponentScreen from './AddComponentScreen';

import Close from 'react-native-vector-icons/MaterialCommunityIcons';
export default function ComponentInstallListStack({ navigation, route }) {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="ComponentInstallListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336',
      },
      headerShadowVisible: false,
      animation: 'none',
      headerTintColor: '#ffffff'
    }}>
      <Stack.Group>
        <Stack.Screen name="ComponentInstallListScreen" component={ComponentInstallListScreen}
          options={{
            title: "Available components",
            headerLeft: () => { return <Button theme={{ colors: { primary: 'black' } }} style={{ marginLeft: -20 }} onPress={() => navigation.goBack(null)}><Close name="close" size={24} color="white" /></Button> }
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>

        <Stack.Screen name='ComponentInstallFormScreen'
          initialParams={{ bikeId: route.params.bikeId }}
          options={{
            title: "Add component",
          }}
          component={ComponentInstallFormScreen} />


        <Stack.Screen name='AddComponentScreen' component={AddComponentScreen} options={{
          title: "Add component",
          headerLeft: () => { return <Button theme={{ colors: { primary: 'black' } }} style={{ marginLeft: -20 }} onPress={() => navigation.navigate("ComponentsListScreen")}><Close name="close" size={24} color="white" /></Button> }
        }} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
