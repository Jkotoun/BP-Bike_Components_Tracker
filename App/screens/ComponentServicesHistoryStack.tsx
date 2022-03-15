
import * as React from 'react';
import { Alert, Text} from 'react-native';
import {Button, Colors} from "react-native-paper"
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ComponentServicesHistoryScreen from './ComponentServicesHistoryScreen'
import AddServiceRecord from './AddServiceRecordScreen'
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
export default function ComponentServicesHistoryStack({ navigation, route }) {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="ServiceRecords" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336',
      },
      headerShadowVisible:false,
      animation: 'fade',
      headerTintColor: '#ffffff',
      headerShown:false
    }}>
        <Stack.Screen name="AddServiceRecord"   component={AddServiceRecord} 
        options={{ 
          title: "Add service record",
          headerShown:true,
          headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={{marginLeft:-20}} onPress={()=>navigation.navigate("ServiceRecords")}><Close name="close" size={24} color="white"/></Button>}
        }} 
        />
        
        <Stack.Screen name='ServiceRecords'  component={ComponentServicesHistoryScreen}
         initialParams={{componentId: route.params.componentId}}/>
        
    </Stack.Navigator>

  );
}
