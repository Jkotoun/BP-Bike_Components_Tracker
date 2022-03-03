
import * as React from 'react';
import { StyleSheet} from 'react-native';
import {Button} from "react-native-paper"

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeComponentsList from "./BikeComponentsList"
import AllComponentsListScreen from './AllComponentsListScreen';
import ComponentUninstallFormScreen from './ComponentUninstallFormScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentTabs from './ComponentTabs';
import ComponentInstallListStack from './ComponentInstallListStack'

export default function BikesListStack({ navigation, route }) {


  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="BikeComponentsList" screenOptions={{
      animation: 'none',
      headerShown: false,
      
    }}>
      <Stack.Group>
        <Stack.Screen name="BikeComponentsList" component={BikeComponentsList} initialParams={{bikeId: route.params.bikeId}} />
        <Stack.Screen name='ComponentUninstallFormScreen'
        initialParams={{bikeId: route.params.bikeId}}
         options={{
           title:"Component YYY uninstall", 
           headerShown:true,
           headerTitleStyle: styles.uninstallFormHeaderTitle, 
           headerStyle: styles.uninstallFormHeaderStyles,
           headerRight:()=> { return <Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.navigate("BikeComponentsList")}><Check name="check" size={24} color="white"/></Button>},
           headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={styles.headerBackButton} onPress={()=>navigation.navigate("BikeComponentsList")}><Close name="close" size={24} color="white"/></Button>}
          }}
           component={ComponentUninstallFormScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="ComponentDetail" options={{title: "Component xxx"}} component={ComponentTabs} />
        <Stack.Screen name='ComponentInstallListStack'
        initialParams={{bikeId: route.params.bikeId}}
         options={{
           title:"Add component", 
           headerShown: false
          }}
           component={ComponentInstallListStack} />
      </Stack.Group>


    </Stack.Navigator>

  );
}

const styles = StyleSheet.create({
  uninstallFormHeaderTitle:{
    color: 'white',
    fontSize:16
  },
  uninstallFormHeaderStyles:{
    backgroundColor:"#F44336"
  },
  headerBackButton:{
    marginLeft: -20
  }
})
