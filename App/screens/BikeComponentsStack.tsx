
import * as React from 'react';
import { Text, Alert} from 'react-native';
import {Button, Colors} from "react-native-paper"
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeComponentsList from "./BikeComponentsList"
import AllComponentsListScreen from './AllComponentsListScreen';
import ComponentUninstallFormScreen from './ComponentUninstallFormScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentTabs from './ComponentTabs';
import ComponentInstallListStack from './ComponentInstallListStack'
export default function BikesListStack({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="BikeComponentsList" screenOptions={{
      animation: 'none',
      headerShown: false,
      
    }}>
      <Stack.Group>
        <Stack.Screen name="BikeComponentsList" component={BikeComponentsList} />
        <Stack.Screen name='ComponentUninstallFormScreen'
         options={{
           title:"Component YYY uninstall", 
           headerShown:true,
           headerTitleStyle: {
            color: 'white',
            fontSize:16
          }, 
           headerStyle:{
             backgroundColor:"#F44336",
           },
           headerRight:()=> { return <Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.navigate("BikeComponentsList")}><Check name="check" size={24} color="white"/></Button>},
           headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={{marginLeft:-20}} onPress={()=>navigation.navigate("BikeComponentsList")}><Close name="close" size={24} color="white"/></Button>}
          }}
           component={ComponentUninstallFormScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>

        <Stack.Screen name='AllComponentsListScreen' component={AllComponentsListScreen}/>
        <Stack.Screen name="ComponentDetail" options={{title: "Component xxx"}} component={ComponentTabs} />
      

     



        <Stack.Screen name='ComponentInstallListStack'
         options={{
           title:"Add component", 
           headerShown: false
          //  headerRight:()=> { return <Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.navigate("Component")}><Check name="check" size={24} color="white"/></Button>},
          //  headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={{marginLeft:-20}} onPress={()=>navigation.goBack(null)}><Close name="close" size={24} color="white"/></Button>}
           

    
          }}
           
           component={ComponentInstallListStack} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
