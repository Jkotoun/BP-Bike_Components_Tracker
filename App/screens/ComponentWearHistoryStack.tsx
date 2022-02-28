
import * as React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ComponentWearHistoryScreen from'./ComponentWearHistoryScreen'
export default function ComponentWearHistoryStack({ navigation, route }) {
 

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="ComponentWearHistoryScreen" screenOptions={{
      animation: 'none',
      headerShown: false
    }}>
    <Stack.Screen name="ComponentWearHistoryScreen" component={ComponentWearHistoryScreen} initialParams={{componentId: route.params.componentId}} />


    </Stack.Navigator>

  );
}
