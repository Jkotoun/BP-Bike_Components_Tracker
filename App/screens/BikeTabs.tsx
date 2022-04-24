
import * as React from 'react';
import { AuthenticatedUserContext} from '../../context' 
import BikeComponentsStack from './BikeComponentsStack';
import BikeComponentsHistoryScreen from './BikeComponentsHistoryScreen';
import BikeDetails from './BikeDetails';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigationState } from '@react-navigation/native';
import activeScreenName from '../modules/helpers';

const Tab = createMaterialTopTabNavigator();


function stackHeaderVisible(navigationState) {
  const routeName = activeScreenName(navigationState);
  const tabBarHiddenPages = ["BikeComponentsList", "Components", "History", "Bike Details", "BikeDetailTabs", "BikesListScreen", "Bikes", "AddBikeScreen"]
  return tabBarHiddenPages.includes(routeName)

}




export default function BikeTabs({route, navigation}) {




  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.bikeName
    });
  }, []);
  const navigationState = useNavigationState(state => state);


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: stackHeaderVisible(navigationState)
  
    });
  }, [navigationState]);


  return (
    <Tab.Navigator
    screenOptions={() => ({
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerShown: true,
      headerTitleStyle: {
        color: 'white'
      }, 
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#fbb4af',
      tabBarIndicatorContainerStyle:{backgroundColor: "#F44336"},
      tabBarIndicatorStyle: {backgroundColor: 'white'},

    
    })}>

      <Tab.Screen name="Components" initialParams={{bikeId: route.params.bikeId}}component={BikeComponentsStack} />
      <Tab.Screen name="History" initialParams={{bikeId: route.params.bikeId}} component={BikeComponentsHistoryScreen} />
      <Tab.Screen name="Bike Details"  initialParams={{bikeId: route.params.bikeId}} component={BikeDetails} />
    </Tab.Navigator>

   );
} 
