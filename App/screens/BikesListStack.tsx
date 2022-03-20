
import * as React from 'react';
import { Alert, Text, View} from 'react-native';
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
import { AuthenticatedUserContext } from '../../context'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const auth = getAuth(firebaseApp)

export default function BikesListStack({ navigation, route }) {


  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);




  const Stack = createNativeStackNavigator();
  const navigationState = useNavigationState(state => state);
  return (
    <Stack.Navigator initialRouteName="BikeListScreen" screenOptions={({ route }) => ({
      headerStyle: {
        backgroundColor: '#F44336',
      },

      headerShadowVisible: false,


      animation: 'none',
      headerTintColor: '#ffffff',

    })}>

      <Stack.Group>
        <Stack.Screen name="BikesListScreen" initialParams={{ viewRetired: true}} options={{
          title: "Bikes",
        }} component={BikesListScreen} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="BikeDetailTabs" options={{
          title: "Bike",
          headerRight: () => (
            <Menu>
              <MenuTrigger text={<Icon name="dots-vertical" size={25} color="#ffffff" />} />
              <MenuOptions>
                <MenuOption onSelect={async () => { await auth.signOut() }} text={"Log out"} style={styles.menuOption} />
              </MenuOptions>

            </Menu>
          ),



        }} component={BikeTabs} />
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
  menuOption: {
    padding: 8
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
  },
}