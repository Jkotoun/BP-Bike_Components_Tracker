
import * as React from 'react';
import { Text } from 'react-native';
import { Button, Colors } from "react-native-paper"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeTabs from "./BikeTabs"
import BikesListScreen from "./BikesListScreen"
import AddBikeScreen from './AddBikeScreen';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import activeScreenName from '../modules/helpers';
import { useNavigationState } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../config/firebase';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  function stackHeaderVisible(navigationState) {
    const routeName = activeScreenName(navigationState);
    return ["BikeDetailTabs", "History", "Components", "Bike Details", "AddBikeScreen", "BikeComponentsList"].includes(routeName)
  }
const auth = getAuth(firebaseApp)

export default function BikesListStack({ navigation , route}) {
  const Stack = createNativeStackNavigator();
  const navigationState = useNavigationState(state => state);
  return (
    <Stack.Navigator initialRouteName="BikeListScreen" screenOptions={({ route }) => ({
      headerStyle: {
        backgroundColor: '#F44336',
      },
      headerShadowVisible: false,
      headerRight: () => (
        <Menu>
          <MenuTrigger text={<Icon name="dots-vertical" size={25} color="#ffffff" />} />
          <MenuOptions>
                 <MenuOption onSelect={async () => { await auth.signOut()}} text={"Log out"} style={styles.menuOption}/>
          </MenuOptions>

      </Menu>
      ),
      animation: 'fade',
      headerTintColor: '#ffffff',
      headerShown: stackHeaderVisible(navigationState)

    })}>

      <Stack.Group>
        <Stack.Screen name="BikesListScreen" initialParams={{viewRetired: route.params.viewRetired}} options={{ title: "Bikes" }} component={BikesListScreen} />
      </Stack.Group>
      
      <Stack.Group>
        <Stack.Screen name="BikeDetailTabs"  options={{ title: "Bike", animation:'fade' }}  component={BikeTabs} />
        <Stack.Screen name='AddBikeScreen' 
          options={{
            title: "Add bike",
            headerLeft: () => { return <Button theme={{ colors: { primary: 'black' } }} onPress={() => navigation.goBack(null)} style={{ marginLeft: -20 }}><Close name="close" size={24} color="white" /></Button> }
          }}
          component={AddBikeScreen} />
      </Stack.Group>
    </Stack.Navigator>

  );
}

const styles = {
    menuOption:{
        padding:8
    }
}