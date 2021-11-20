
import * as React from 'react';
import { Text} from 'react-native';
import AuthenticatedContext from '../../context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeDetailScreen from "./BikeDetailScreen"
import ComponentsListScreen from "./AllComponentsListScreen"
import ComponentDetailScreen from "./ComponentDetail"
export default function BikesListScreen({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const Stack = createNativeStackNavigator();

  return (

    <Stack.Navigator initialRouteName="ComponentsListScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336'
      },
      headerRight: () => (
        <Text style={{ color: "white" }} onPress={() => { setIsLoggedIn(false); setUser({}) }}>Logout</Text>
      ),
      animation: 'none',
      headerTintColor: '#ffffff'
    }}>
      <Stack.Group>
        <Stack.Screen name="ComponentsListScreen" options={{ title: "All Components" }} component={ComponentsListScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="ComponentDetail" component={ComponentDetailScreen} />
      </Stack.Group>
    </Stack.Navigator>

  );
}
