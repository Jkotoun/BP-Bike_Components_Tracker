
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';

import TopTabBar from '../components/TopTabBar';

import ComponentWearHistoryStack from './ComponentWearHistoryStack';
import ComponentDetails from './ComponentDetails';
import ComponentServicesHistoryScreen from './ComponentServicesHistoryScreen';

export default function ComponentTabs() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const tabsObj = [
    {
      "key": "wear_tab",
      "name": "Wear history",
      "component": ComponentWearHistoryStack
    },
    {
      "key": "services_tab",
      "name": "Services",
      "component": ComponentServicesHistoryScreen
    },
    {
      "key": "details_tab",
      "name": "Details",
      "component": ComponentDetails
    }
  ]
 
  return (
    <TopTabBar Tabs={tabsObj}/>
  );
} 
