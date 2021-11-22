
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//TODO define props interface
const Tab = createMaterialTopTabNavigator();
export default function TopTabBar(props)
{
    return(
        <Tab.Navigator
        screenOptions={() => ({
          headerStyle: {
            backgroundColor: '#F44336'
          },
          headerShown: false,
          headerTitleStyle: {
            color: 'white'
          }, 
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#fbb4af',
          tabBarIndicatorContainerStyle:{backgroundColor: "#F44336"},
          tabBarIndicatorStyle: {backgroundColor: 'white'}
        
        })}>
            {props.Tabs.map(item => {
                return  (<Tab.Screen key={item.key} name={item.name} component={item.component} />)
            })}
        </Tab.Navigator>
    )
}