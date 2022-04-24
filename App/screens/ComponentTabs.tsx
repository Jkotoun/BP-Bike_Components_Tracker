
import * as React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useNavigationState } from '@react-navigation/native';

import ComponentWearHistoryStack from './ComponentWearHistoryStack';
import ComponentDetails from './ComponentDetails';
import ComponentServicesHistoryStack from './ComponentServicesHistoryStack';
import ComponentSwapsHistory from './ComponentSwapsHistory'


import activeScreenName from '../modules/helpers';


function stackHeaderVisible(state) {
  const routeName = activeScreenName(state);
  const tabBarHiddenPages = ["AddServiceRecord", "AddWearRecordScreen"]
  return !tabBarHiddenPages.includes(routeName)
}


export default function ComponentTabs({ route, navigation }) {
  const navigationState = useNavigationState(state => state);


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: stackHeaderVisible(navigationState),
      title: route.params.componentName

    });
  }, [navigationState]);


  const Tab = createMaterialTopTabNavigator();

  const tabsObj = [
    {
      "key": "wear_tab",
      "name": "Wear",
      "component": ComponentWearHistoryStack
    },
    {
      "key": "services_tab",
      "name": "Services",
      "component": ComponentServicesHistoryStack
    },
    {
      "key": "installation_history_tab",
      "name": "Swaps",
      "component": ComponentSwapsHistory
    },
    {
      "key": "details_tab",
      "name": "Details",
      "component": ComponentDetails
    }
  ]

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#fbb4af',
        tabBarIndicatorContainerStyle: { backgroundColor: "#F44336" },
        tabBarIndicatorStyle: { backgroundColor: 'white' },

      })}>
      {tabsObj.map(item => {
        return (<Tab.Screen name={item.name} component={item.component} initialParams={{ componentId: route.params.componentId }} />)
      })}
    </Tab.Navigator>
  );
} 
