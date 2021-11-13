
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import AuthenticatedContext from '../../context';
import BikeListItem  from '../components/BikeListItem';
export default function BikesListScreen() {
  const{authenticated,  setAuthenticated} = React.useContext(AuthenticatedContext)

  const info = {"Distance":"548 km", "Ride Time":'36h 18m'}
  const info2 = {"Distance":"1235 km", "Ride Time":'80h 10m'}
  const info3 = {"Distance":"2453 km", "Ride Time":'113h 43m'}

  return (
    <View style={{ flex: 1, marginTop:25, alignItems: 'center' }}>
      <BikeListItem name="Canyon grand canyon 8" bikeCategory="MTB hardtail" displayInfo={info}  ></BikeListItem>
      <BikeListItem name="Specialized" bikeCategory="Road"  displayInfo={info2} ></BikeListItem>
      <BikeListItem name="Qayron carma enduro full" bikeCategory="MTB full suspension"  displayInfo={info3}></BikeListItem>
      <Button onPress={() => setAuthenticated(false)}  title="Logout"></Button>
    </View>
  );
}
