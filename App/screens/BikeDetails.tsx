
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';

import Card from '../components/Card';
import AddButton from "../components/AddButton"



export default function BikeDetails() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)
  const historyExample = {
    'Distance': '548 km',
    'Ride Time': "36h 18m",
    'Bike Name': 'Canyon MTB',
    'Purchase date': "8. 7. 2021",
    'Type': 'Mountain Hardtail',
    'Brand': 'Canyon',
    'Model': 'Grand canyon 8'
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'column', padding: 25 }}>
        {
           Object.entries(historyExample).map((prop, value) => {
            return (
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 15 }}>
               
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{prop[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{prop[1]}</Text>
                </View> 
              </View>
            )
          })
        }
      </View>
    </View>
  );
} 
