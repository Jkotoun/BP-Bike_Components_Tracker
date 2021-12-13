
import * as React from 'react';
import { Text} from 'react-native';
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RidesListScreen from "./RidesListScreen"
import RideDetail from "./RideDetail"
import {Button} from 'react-native-paper'
import AddRideScreen from './AddRideScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RidesListStack({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="RidesListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerRight: () => (
        <Text style={{ color: "white" }} onPress={() => { setIsLoggedIn(false); setUser({}) }}>Logout</Text>
      ),
      headerShadowVisible:false,
      animation: 'none',
      headerTintColor: '#ffffff'
    }}>
      <Stack.Group>
        <Stack.Screen name="RidesListScreen" options={{ title: "Rides" }} component={RidesListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="RideDetail" options={{title: "Ride xxx"}} component={RideDetail} />
        <Stack.Screen name='AddRideScreen' options={{title:"Add ride", headerRight:()=><Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.navigate("RidesListScreen")}><Check name="check" size={24} color="white"/></Button>}} component={AddRideScreen} />

      </Stack.Group>
    </Stack.Navigator>

  );
}
