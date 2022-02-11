
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';
import BikeComponentsStack from './BikeComponentsStack';
import BikeComponentsHistoryScreen from './BikeComponentsHistoryScreen';
import BikeDetails from './BikeDetails';
import Card from '../components/Card';
import TopTabBar from '../components/TopTabBar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

function getVisibility(route) {
  const routeName = getFocusedRouteNameFromRoute(route);
  const tabBarHiddenPages = ["ComponentInstallListStack", "ComponentUninstallFormScreen"]
  if (tabBarHiddenPages.includes(routeName))
  {
    return false
  }
  else
  {
    return true;
  }
}
const Tab = createMaterialTopTabNavigator();
export default function BikeTabs() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)
 
  return (

    <Tab.Navigator
    screenOptions={({route}) => ({
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerShown: false,
      headerTitleStyle: {
        color: 'white'
      }, 
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#fbb4af',
      tabBarIndicatorContainerStyle:{backgroundColor: "#F44336"},
      tabBarIndicatorStyle: {backgroundColor: 'white'},
      tabBarStyle:{
        display: getVisibility(route)? "flex":"none"
      },
    
    })}>

      <Tab.Screen name="Components" component={BikeComponentsStack} />
      <Tab.Screen name="History" component={BikeComponentsHistoryScreen} />
      <Tab.Screen name="Details" component={BikeDetails} />
      
    </Tab.Navigator>

   );
} 
