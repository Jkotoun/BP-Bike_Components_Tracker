
import * as React from 'react';
import { Text, View, Button, Alert, ScrollView } from 'react-native';
import AuthenticatedContext from '../../context';
import Card from '../components/Card';
import AddButton from "../components/AddButton"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeDetailScreen from "./BikeDetailScreen"
import ComponentDetailScreen from "./ComponentDetail"
export default function BikesListScreen({ navigation }) {
  navigation.navigationOptions = {}
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const info = { "Distance": "548 km", "Ride Time": '36h 18m' }
  const info2 = { "Distance": "1235 km", "Ride Time": '80h 10m' }
  const info3 = { "Distance": "2453 km", "Ride Time": '113h 43m' }

  const images = {
    mtb_full: require("../assets/images/full_suspension_mtb_icon.png"),
    road: require("../assets/images/road_icon.png")
  };


  return (

    <View style={{ flex: 1 }}>
      <ScrollView >
        <View style={{ alignItems: 'center', marginTop: 25, flex: 9, zIndex: 0 }}>
          <Card title="Canyon grand canyon 8" description="MTB hardtail" icon={images.mtb_full} displayInfo={info} onPress={() => { navigation.navigate('BikeDetail') }} ></Card>
          <Card title="Specialized" description="Road" displayInfo={info2} icon={images.mtb_full} onPress={() => { navigation.navigate('ComponentDetail') }}></Card>
          <Card title="Qayron carma enduro full" description="MTB full suspension" displayInfo={info3} icon={images.mtb_full} onPress={() => { Alert.alert("Redirect bike") }}></Card>
          {/* <Button onPress={() => setAuthenticated(false)} title="Logout"></Button> */}
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', right: 0, bottom: 0, paddingVertical: 30, paddingHorizontal: 20, zIndex: 99 }}>
        <AddButton onPress={() => Alert.alert("Add bike TODO")}></AddButton>
      </View>
    </View>

  );
}
