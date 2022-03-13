
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
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import activeScreenName  from '../modules/helpers';
import { useNavigationState } from '@react-navigation/native';

function stackHeaderVisible(navigationState) {
    
  const routeName = activeScreenName(navigationState);
  return !["ComponentsListScreen", undefined, "All components"].includes(routeName) 
}

const auth = getAuth(firebaseApp)
export default function BikesListScreen({ navigation }) {
  const Stack = createNativeStackNavigator();
  const navigationState = useNavigationState(state => state);
  return (

    <Stack.Navigator initialRouteName="ComponentsListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerShadowVisible:false,
      headerShown:stackHeaderVisible(navigationState),
      headerRight: () => (
        <Menu>
          <MenuTrigger text={<Icon name="dots-vertical" size={25} color="#ffffff" />} />
          <MenuOptions>
                 <MenuOption onSelect={async () => { await auth.signOut()}} text={"Log out"} style={styles.menuOption}/>
          </MenuOptions>

      </Menu>
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
          // headerRight:()=>{ return <Button  theme={{colors: {primary: 'black'}}} onPress={()=>navigation.navigate("ComponentsListScreen")}><Check name="check" size={24} color="white"/></Button>},
          headerLeft: () => {return <Button theme={{colors: {primary: 'black'}}} style={{marginLeft:-20}} onPress={()=>navigation.navigate("ComponentsListScreen")}><Close name="close" size={24} color="white"/></Button>}
        }}/>
      </Stack.Group>
    </Stack.Navigator>

  );
}
const styles = {
menuOption:{
    padding:8
}
}