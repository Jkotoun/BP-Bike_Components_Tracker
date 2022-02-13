
import * as React from 'react';
import AuthenticatedContext from '../../context';
import BikeComponentsStack from './BikeComponentsStack';
import BikeComponentsHistoryScreen from './BikeComponentsHistoryScreen';
import BikeDetails from './BikeDetails';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigationState } from '@react-navigation/native';
import activeScreenName from '../modules/screenName';
function topTabBarVisible(state) {
  const routeName = activeScreenName(state);
  const tabBarHiddenPages = ["ComponentInstallListStack", "ComponentUninstallFormScreen"]
  return !tabBarHiddenPages.includes(routeName)
}
const Tab = createMaterialTopTabNavigator();
export default function BikeTabs() {
  const state = useNavigationState(state => state)
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)
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

      <Tab.Screen name="Components" component={BikeComponentsStack} />
      <Tab.Screen name="History" component={BikeComponentsHistoryScreen} />
      <Tab.Screen name="Details" component={BikeDetails} />
    </Tab.Navigator>

   );
} 
