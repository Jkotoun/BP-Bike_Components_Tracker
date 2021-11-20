
import * as React from 'react';
import { View,  Alert } from 'react-native';
import AuthenticatedContext from '../../context';
import Card from '../components/Card';
import AddButton from "../components/AddButton"
export default function BikesListScreen({navigation}) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const info = { "Distance": "43 km", "Ride Time": '11h 18m', "Elevation gain": "872 m"}
  const info2 = { "Distance": "73 km",  "Ride Time": "4h 12m", "Elevation gain": '1234 m' }

  const images = {
    route: require("../assets/images/route_icon.png"),
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 25, alignItems: 'center', flex: 9 }}>
        <Card title="Traily Jedovnice" description2="Bike: Canyon MTB" icon={images.route} displayInfo={info} onPress={() => { navigation.navigate('RideDetail') }}></Card>
        <Card title="Odpolední projížďka" description2="BIke not assigned" displayInfo={info2} icon={images.route}  onPress={() => {navigation.navigate('RideDetail')}}></Card>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end', padding: 20 }}>

      <AddButton onPress={() => Alert.alert("Add ride TODO")}></AddButton>
      </View>
    </View>
  );
} 