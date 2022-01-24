
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';


export default function ComponentDetails() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)
  const historyExample = {
    'Distance': '150 km',
    'Ride Time': "50h 18m",
    'Component Name': 'Shimano SLX chain',
    'Purchase date': "2. 8. 2021",
    'Component type': '12 speed chain',
    'Brand': 'Shimano',
    'Model': 'SLX'
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
