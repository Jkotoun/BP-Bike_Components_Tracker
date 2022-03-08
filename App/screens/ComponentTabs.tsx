
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';

import TopTabBar from '../components/TopTabBar';

import ComponentWearHistoryStack from './ComponentWearHistoryStack';
import ComponentDetails from './ComponentDetails';
import ComponentServicesHistoryScreen from './ComponentServicesHistoryScreen';
import ComponentSwapsHistory from './ComponentSwapsHistory'
export default function ComponentTabs({route}) {
  const tabsObj = [
    {
      "key": "wear_tab",
      "name": "Wear",
      "component": ComponentWearHistoryStack
    },
    {
      "key": "services_tab",
      "name": "Services",
      "component": ComponentServicesHistoryScreen
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
    <TopTabBar Tabs={tabsObj} componentId={route.params.componentId}/>
  );
} 
