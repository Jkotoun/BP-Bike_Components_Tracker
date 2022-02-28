
import * as React from 'react';
import { Text} from 'react-native';
import {Button} from 'react-native-paper'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeDetailScreen from "./BikeTabs"
import ComponentsListScreen from "./AllComponentsListScreen"
import ComponentTabs from "./ComponentTabs"
import AddComponentScreen from './AddComponentScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import firebaseApp from '../config/firebase'
import { getAuth } from 'firebase/auth';
const auth = getAuth(firebaseApp)
export default function BikesListScreen({ navigation }) {
  const Stack = createNativeStackNavigator();
  
  return (

    <Stack.Navigator initialRouteName="ComponentsListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerShadowVisible:false,
      headerRight: () => (
        <Text style={{ color: "white" }} onPress={async () => { await auth.signOut()}}>Logout</Text>
      ),
      animation: 'none',
      headerTintColor: '#ffffff'
    }}>
      <Stack.Group>
        <Stack.Screen name="ComponentsListScreen" options={{ title: "All Components" }} component={ComponentsListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="ComponentDetailTabs" options={{title: "Component xxx"}} component={ComponentTabs} />
        <Stack.Screen name='AddComponentScreen' component={AddComponentScreen}  options={{
          title:"Add component", 
          headerRight:()=>{ return <Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.navigate("ComponentsListScreen")}><Check name="check" size={24} color="white"/></Button>},
          headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={{marginLeft:-20}} onPress={()=>navigation.goBack(null)}><Close name="close" size={24} color="white"/></Button>}
        }}/>
      </Stack.Group>
    </Stack.Navigator>

  );
}
