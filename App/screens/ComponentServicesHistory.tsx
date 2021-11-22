
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';


export default function ComponentServicesHistory() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

 
  return (
   <Text>Component services history</Text>
  );
} 
