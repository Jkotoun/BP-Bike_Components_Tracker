
import * as React from 'react';
import { Button } from "react-native-paper"
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import activeScreenName from '../modules/helpers';
import { useNavigationState } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ComponentWearHistoryScreen from './ComponentWearHistoryScreen'
import AddWearRecordScreen from './AddWearRecordScreen'
export default function ComponentWearHistoryStack({ navigation, route }) {

  const navigationState = useNavigationState(state => state);

  const Stack = createNativeStackNavigator();
  function topTabBarVisible(state) {
    const routeName = activeScreenName(state);
    return routeName != "AddWearRecordScreen"
  }


  //set top tab bar visibility
  React.useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle:
      {
        display: topTabBarVisible(navigationState) ? "flex" : "none"
      },
      swipeEnabled: topTabBarVisible(navigationState)

    });
  }, [navigationState]);

  return (

    <Stack.Navigator initialRouteName="ComponentWearHistoryScreen" screenOptions={{
      headerStyle: {
        backgroundColor: '#F44336',
      },
      headerShadowVisible: false,
      animation: 'none',
      headerTintColor: '#ffffff',
      headerShown: false
    }}>
      <Stack.Screen name="ComponentWearHistoryScreen" component={ComponentWearHistoryScreen} initialParams={{ componentId: route.params.componentId }} />

      <Stack.Screen name="AddWearRecordScreen" component={AddWearRecordScreen}
        options={{
          title: "Add wear record",
          headerShown: true,
          headerLeft: () => { return <Button theme={{ colors: { primary: 'black' } }} style={{ marginLeft: -20 }} onPress={() => navigation.navigate("ComponentWearHistoryScreen")}><Close name="close" size={24} color="white" /></Button> }
        }}
      />
    </Stack.Navigator>

  );
}
