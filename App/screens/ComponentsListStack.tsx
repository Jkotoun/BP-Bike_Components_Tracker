
import * as React from 'react';
import { Text} from 'react-native';
import {Button} from 'react-native-paper'
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeDetailScreen from "./BikeTabs"
import ComponentsListScreen from "./AllComponentsListScreen"
import ComponentTabs from "./ComponentTabs"
import AddComponentScreen from './AddComponentScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
export default function BikesListScreen({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="ComponentsListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerShadowVisible:false,
      headerRight: () => (
        <Text style={{ color: "white" }} onPress={() => { setIsLoggedIn(false); setUser({}) }}>Logout</Text>
      ),
      animation: 'none',
      headerTintColor: '#ffffff'
    }}>
      <Stack.Group>
        <Stack.Screen name="ComponentsListScreen" options={{ title: "All Components" }} component={ComponentsListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="ComponentDetail" options={{title: "Component xxx"}} component={ComponentTabs} />
        <Stack.Screen name='AddComponentScreen' options={{title:"Add component", headerRight:()=><Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.navigate("ComponentsListScreen")}><Check name="check" size={24} color="white"/></Button>}} component={AddComponentScreen} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
