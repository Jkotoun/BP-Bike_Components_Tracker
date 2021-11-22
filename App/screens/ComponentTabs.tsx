
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';

import Card from '../components/Card';
import AddButton from "../components/AddButton"
import TopTabBar from '../components/TopTabBar';

import ComponentDetailWearHistory from './ComponentWearHistory';
import ComponentDetails from './ComponentDetails';
import ComponentServicesHistory from './ComponentServicesHistory';

export default function ComponentTabs() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const tabsObj = [
    {
      "key": "wear_tab",
      "name": "Wear history",
      "component": ComponentDetailWearHistory
    },
    {
      "key": "services_tab",
      "name": "Services",
      "component": ComponentServicesHistory
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
