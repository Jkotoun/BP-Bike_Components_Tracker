
import * as React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import AuthenticatedContext from '../../context';
import Card from '../components/Card';
import AddButton from "../components/AddButton"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeDetailScreen from "./BikeDetailScreen"
import BikeListScreen from "./BikesListScreen"
import ComponentDetailScreen from "./ComponentDetail"
export default function BikesListScreen({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="BikeListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerRight: () => (
        <Text style={{ color: "white" }} onPress={() => { setIsLoggedIn(false); setUser({}) }}>Logout</Text>
      ),
      animation: 'none',
      headerTintColor: '#ffffff'
    }}>
      <Stack.Group>
        <Stack.Screen name="BikeListScreen" options={{ title: "Bikes" }} component={BikeListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>

        <Stack.Screen name="BikeDetail" component={BikeDetailScreen} />
        <Stack.Screen name="ComponentDetail" component={ComponentDetailScreen} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
