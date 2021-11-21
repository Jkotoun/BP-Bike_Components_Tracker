
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';

import Card from '../components/Card';
import AddButton from "../components/AddButton"
import TopTabBar from '../components/TopTabBar';


import BikeDetailScreen2 from './BikeDetailScreen2';
import BikeDetailScreen3 from './BikeDetailScreen3';
import BikeDetailScreen4 from './BikeDetailScreen4';


export default function ComponentDetail() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const tabsObj = [
    {
      "key": "wear_tab",
      "name": "Wear history",
      "component": BikeDetailScreen2
    },
    {
      "key": "services_tab",
      "name": "Services",
      "component": BikeDetailScreen3
    },
    {
      "key": "details_tab",
      "name": "Details",
      "component": BikeDetailScreen4
    }
  ]
 
  return (
    <TopTabBar Tabs={tabsObj}/>
  );
} 
