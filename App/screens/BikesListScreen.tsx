
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import AuthenticatedContext from '../../context';
import BikeListItem  from '../components/BikeListItem';
export default function BikesListScreen() {
  const{authenticated,  setAuthenticated} = React.useContext(AuthenticatedContext)
  return (
    <View style={{ flex: 1, marginTop:25, alignItems: 'center' }}>
      <BikeListItem name="Canyon grand canyon 8" bikeCategory="MTB hardtail" rideDistance="548" rideTime="36h 18m"></BikeListItem>
      <BikeListItem name="Specialized" bikeCategory="Road" rideDistance="1235" rideTime="80h 10m" ></BikeListItem>
      <BikeListItem name="Qayron carma enduro full" bikeCategory="MTB full suspension" rideDistance="2453" rideTime="113h 43m"></BikeListItem>
      <Button onPress={() => setAuthenticated(false)}  title="Logout"></Button>
    </View>
  );
}
