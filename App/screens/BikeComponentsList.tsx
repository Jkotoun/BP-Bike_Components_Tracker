
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';
import { FAB } from 'react-native-paper';
import Card from '../components/Card';

export default function BikeComponentsHistory({navigation}) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

  const info = { "Distance": "120 km", "Ride Time": '11h 18m', "Condition": "New" }
  const info2 = { "Distance": "548 km", "Ride Time": '36h 10m', "Condition": "Good" }

  const images = {
    chain: require("../assets/images/chain_icon.png"),
    fork: require("../assets/images/bicycle_fork_icon.png")
  };

  
  const componentOptions= [
    {
      text:"Uninstall",
      onPress : () => navigation.navigate("ComponentUninstallFormScreen")
    },
    {
      text: "Edit",
      onPress: ()=>  Alert.alert("Edit")
    },
    {
      text: "Delete",
      onPress: () =>  Alert.alert("Delete")
    }

  ]

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 5, alignItems: 'center', flex: 9 }}>
        <Card options={componentOptions} title="Shimano SLX chain" description="Chain" icon={images.chain} displayInfo={info} onPress={()=> {Alert.alert("TODO show correct component")}}></Card>
      </View>
     <View style={{ position: 'absolute', right: 0, bottom: 0, paddingVertical: 30, paddingHorizontal: 20, zIndex: 99 }}>
        <FAB
    style={{  
    backgroundColor:"#F44336"}}
    icon="plus"
    onPress={() =>navigation.navigate("ComponentInstallListStack")}
  />
      </View>
    </View>
  );
} 
