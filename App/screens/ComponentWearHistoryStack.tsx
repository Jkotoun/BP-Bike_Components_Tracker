
import * as React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ComponentWearHistoryScreen from'./ComponentWearHistoryScreen'
export default function ComponentWearHistoryStack({ navigation }) {
 

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
