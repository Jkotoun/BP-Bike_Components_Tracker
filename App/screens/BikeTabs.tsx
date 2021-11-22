
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';
import BikeComponentsList from './BikeComponentsList';
import BikeComponentsHistory from './BikeComponentsHistory';
import BikeDetails from './BikeDetails';
import Card from '../components/Card';
import AddButton from "../components/AddButton"
import TopTabBar from '../components/TopTabBar';




export default function BikeTabs() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const tabsObj = [
    {
      "key": "components_list",
      "name": "Components",
      "component": BikeComponentsList
    },
    {
      "key": "components_history",
      "name": "History",
      "component": BikeComponentsHistory
    },
    {
      "key": "bike_details_tab",
      "name": "Details",
      "component": BikeDetails
    }
  ]
 
  return (
    <TopTabBar Tabs={tabsObj}/>
  );
} 
