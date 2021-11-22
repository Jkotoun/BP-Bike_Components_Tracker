
import * as React from 'react';
import { Text} from 'react-native';
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeTabs from "./BikeTabs"
import BikesListScreen from "./BikesListScreen"
export default function BikesListStack({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="BikeListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336',
      },
      headerShadowVisible:false,
      headerRight: () => (
        <Text style={{ color: "white" }} onPress={() => { setIsLoggedIn(false); setUser({}) }}>Logout</Text>
      ),
      animation: 'none',
      headerTintColor: '#ffffff'
    }}>
      <Stack.Group>
        <Stack.Screen name="BikesListScreen" options={{ title: "Bikes" }} component={BikesListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="BikeDetail" options={{title: "Bike xxx"}} component={BikeTabs} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
