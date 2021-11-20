
import * as React from 'react';
import {  View, Alert } from 'react-native';
import AuthenticatedContext from '../../context';
import Card from '../components/Card';
import AddButton from "../components/AddButton"
export default function BikesListScreen() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const info = { "Distance": "120 km", "Ride Time": '11h 18m', "Condition": "New" }
  const info2 = { "Distance": "548 km", "Ride Time": '36h 10m', "Condition": "Good" }

  const images = {
    chain: require("../assets/images/chain_icon.png"),
    fork: require("../assets/images/bicycle_fork_icon.png")
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 25, alignItems: 'center', flex: 9 }}>
        <Card title="Shimano SLX chain" description="Chain" description2="Installed on: Canyon MTB" icon={images.chain} displayInfo={info}  onPress={() => {Alert.alert("Redirect Component")}}  ></Card>
        <Card title="Fox 34 float rhythm" description="Fork" description2="Not installed" displayInfo={info2} icon={images.fork}  onPress={() => {Alert.alert("Redirect component")}}></Card>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end', padding: 20 }}>

      <AddButton onPress={() => Alert.alert("Add component TODO")}></AddButton>
      </View>
    </View>
  );
} 