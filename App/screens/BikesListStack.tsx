
import * as React from 'react';
import { Text } from 'react-native';
import { Button, Colors } from "react-native-paper"
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeTabs from "./BikeTabs"
import BikesListScreen from "./BikesListScreen"
import AddBikeScreen from './AddBikeScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


import { useNavigationState } from '@react-navigation/native';


function getCurrentRoute(nav) {  
  if (nav) {

    if (nav.routes[nav.index].state) {
      return getCurrentRoute(nav.routes[nav.index].state)
    }
    else {
      return nav.routes[nav.index].name
    }
  }
}



  function getVisibility(state) {
    
    const routeName = getCurrentRoute(state);
    const headerHiddenPages = ["ComponentInstallListStack", "ComponentInstallFormScreen", "ComponentUninstallFormScreen"]
    if (headerHiddenPages.includes(routeName)) {
      return false
    }
    else {
      return true;
    }
  }

export default function BikesListStack({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)
  const Stack = createNativeStackNavigator();
  const state = useNavigationState(state => state);

  return (

    <Stack.Navigator initialRouteName="BikeListScreen" screenOptions={({ route }) => ({
      headerStyle: {
        backgroundColor: '#F44336',
      },
      headerShadowVisible: false,
      headerRight: () => (
        <Text style={{ color: "white" }} onPress={() => { setIsLoggedIn(false); setUser({}) }}>Logout</Text>
      ),
      // headerShown: getVisibility(),
      animation: 'none',
      headerTintColor: '#ffffff',
      headerShown: getVisibility(state)

    })}>
      <Stack.Group>
        <Stack.Screen name="BikesListScreen" options={{ title: "Bikes" }} component={BikesListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="BikeDetail" options={{ title: "Bike xxx" }} component={BikeTabs} />
        <Stack.Screen name='AddBikeScreen'
          options={{
            title: "Add bike",

            headerRight: () => { return <Button theme={{ colors: { primary: 'black' } }} onPress={() => navigation.navigate("BikesListScreen")}><Check name="check" size={24} color="white" /></Button> },
            headerLeft: () => { return <Button theme={{ colors: { primary: 'black' } }} style={{ marginLeft: -20 }} onPress={() => navigation.goBack(null)}><Close name="close" size={24} color="white" /></Button> }


          }}

          component={AddBikeScreen} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
