
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';
import BikeDetailScreen2 from './BikeDetailScreen2';
import BikeDetailScreen3 from './BikeDetailScreen3';
import BikeDetailScreen4 from './BikeDetailScreen4';
import Card from '../components/Card';
import AddButton from "../components/AddButton"
import TopTabBar from '../components/TopTabBar';




export default function BikeDetailScreen() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const tabsObj = [
    {
      "key": "components_list",
      "name": "Components",
      "component": BikeDetailScreen2
    },
    {
      "key": "components_history",
      "name": "History",
      "component": BikeDetailScreen3
    },
    {
      "key": "bike_details_tab",
      "name": "Details",
      "component": BikeDetailScreen4
    }
  ]
 
  return (
    <TopTabBar Tabs={tabsObj}/>
  );
} 
