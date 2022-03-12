
import * as React from 'react';
import { AuthenticatedUserContext} from '../../context' 
import BikeComponentsStack from './BikeComponentsStack';
import BikeComponentsHistoryScreen from './BikeComponentsHistoryScreen';
import BikeDetails from './BikeDetails';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigationState } from '@react-navigation/native';
import activeScreenName from '../modules/screenName';
function topTabBarVisible(state) {
  const routeName = activeScreenName(state);
  const tabBarHiddenPages = ["ComponentInstallListStack", "ComponentInstallFormScreen", "ComponentUninstallFormScreen", "ComponentDetailTabs"]
  return !tabBarHiddenPages.includes(routeName)
}
const Tab = createMaterialTopTabNavigator();


export default function BikeTabs({route}) {
  const state = useNavigationState(state => state)
  return (
    <Tab.Navigator
    screenOptions={() => ({
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
      display: topTabBarVisible(state)? "flex":"none"
      },
    
    })}>

      <Tab.Screen name="Components" initialParams={{bikeId: route.params.bikeId}}component={BikeComponentsStack} />
      <Tab.Screen name="History" initialParams={{bikeId: route.params.bikeId}} component={BikeComponentsHistoryScreen} />
      <Tab.Screen name="Details" initialParams={{bikeId: route.params.bikeId}} component={BikeDetails} />
    </Tab.Navigator>

   );
} 
