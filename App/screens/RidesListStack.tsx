
import * as React from 'react';
import { Text} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RidesListScreen from "./RidesListScreen"
import RideDetail from "./RideDetail"
import {Button} from 'react-native-paper'
import AddRideScreen from './AddRideScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import firebaseApp from '../config/firebase'
import { getAuth } from 'firebase/auth';
const auth = getAuth(firebaseApp)
export default function RidesListStack({ navigation }) {
 
  const Stack = createNativeStackNavigator();
  
  return (
    <Stack.Navigator initialRouteName="RidesListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerRight: () => (
        <Text style={{ color: "white" }} onPress={async () => { await auth.signOut(); console.log("log")}}>Logout</Text>
      ),
      headerShadowVisible:false,
      animation: 'none',
      headerTintColor: '#ffffff',
    }} >
      <Stack.Group>
        <Stack.Screen name="RidesListScreen" options={{ title: "Rides" }} component={RidesListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="RideDetail" options={{title: "Ride xxx"}} component={RideDetail} />
        <Stack.Screen component={AddRideScreen} name='AddRideScreen' options={{title:"Add ride", 
          headerRight:()=> { return <Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.navigate("RidesListScreen")}><Check name="check" size={24} color="white"/></Button>},
          headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={{marginLeft:-20}} onPress={()=>navigation.goBack(null)}><Close name="close" size={24} color="white"/></Button>}
        }}  />
      </Stack.Group>
    </Stack.Navigator>

  );
}
