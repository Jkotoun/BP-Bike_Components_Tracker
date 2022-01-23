
import * as React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import AuthenticatedContext from '../../context';


export default function BikeComponentsHistoryScreen() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)
  const historyExample = [{
    'distance': '520',
    'component': 'Shimano slx',
    'action': 'Installed'
  },
  {
    'distance': '235',
    'component': 'Schwalbe nobby nic',
    'action': 'Installed'
  },
  ]

  return (
    <View style={{ flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'column', padding: 25 }}>
        {
          historyExample.map((item) => {
            return (
              <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 15 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.distance} km</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Text>{item.action}:  {item.component}</Text>
                </View>
              </View>
            )
          })
        }
      </View>
    </View>
  );
} 
