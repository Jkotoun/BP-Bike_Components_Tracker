
import * as React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import AuthenticatedContext from '../../context';
import WearRecordCard from '../components/WearRecordCard';
import { FAB } from 'react-native-paper';
export default function ComponentWearHistoryScreen() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const image = require("../assets/images/default.jpg")
  return (
    <View style={{ flex: 1 }}>
      <WearRecordCard maintext='410 km, 50 h' description='40% wear' image={image} />
      <WearRecordCard maintext='200 km, 50 h' description='10% wear' image={image} />
      <WearRecordCard maintext='5 km, 0 h' description='1% wear' image={image} />
      <View style={{ position: 'absolute', right: 0, bottom: 0, paddingVertical: 30, paddingHorizontal: 20, zIndex: 99 }}>
        <FAB
          style={{
            backgroundColor: "#F44336"
          }}
          icon="plus"
          onPress={() => Alert.alert("TODO add wear history form")}
        />
      </View>
    </View>


  );
} 
