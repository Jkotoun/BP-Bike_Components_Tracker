
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import AuthenticatedContext from '../../context';
import CardItem  from '../components/CardItem';
export default function BikesListScreen() {
  const{authenticated,  setAuthenticated} = React.useContext(AuthenticatedContext)

  const info = {"Distance":"548 km", "Ride Time":'36h 18m'}
  const info2 = {"Distance":"1235 km", "Ride Time":'80h 10m'}
  const info3 = {"Distance":"2453 km", "Ride Time":'113h 43m'}

  const images = {
    mtb_full: require("../assets/images/full_suspension_mtb_icon.png"),
    road: require("../assets/images/road_icon.png")
};

  return (
    <View style={{ flex: 1, marginTop:25, alignItems: 'center' }}>
      <CardItem title="Canyon grand canyon 8" description="MTB hardtail" icon={images.mtb_full}  displayInfo={info}  ></CardItem>
      <CardItem title="Specialized" description="Road"  displayInfo={info2} icon={images.road}></CardItem>
      <CardItem title="Qayron carma enduro full" description="MTB full suspension"  displayInfo={info3} icon={images.mtb_full}></CardItem>
      <Button onPress={() => setAuthenticated(false)}  title="Logout"></Button>
    </View>
  );
} 
