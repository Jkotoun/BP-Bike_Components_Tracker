
import * as React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import AuthenticatedContext from '../../context';
import { FAB } from 'react-native-paper';
import ServiceRecordCard from '../components/ServiceRecordCard';
export default function ComponentServicesHistoryScreen() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)


  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 18 }}><Text style={{ color: '#F44336', fontWeight: 'bold' }}>Total:</Text> 170 CZK</Text>
      </View>
      <ServiceRecordCard maintext='300 km, 40 h' description='Changed quick link' price={80} />
      <ServiceRecordCard maintext='0 km, 0 h' description='Installed new quick link' price={90} />

      <View style={{ position: 'absolute', right: 0, bottom: 0, paddingVertical: 30, paddingHorizontal: 20, zIndex: 99 }}>
        <FAB
          style={{
            backgroundColor: "#F44336"
          }}
          icon="plus"
          onPress={() => Alert.alert("TODO add service form")}
        />
      </View>
    </View>


  );
} 
