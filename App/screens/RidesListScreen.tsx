import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
export default function RidesListScreen({navigation }) {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Rides!</Text>
       {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />  */}
    </View>
  );
}
