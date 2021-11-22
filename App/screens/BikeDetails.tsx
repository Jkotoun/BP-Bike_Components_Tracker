
import * as React from 'react';
import { Text, View, Button , Alert} from 'react-native';
import AuthenticatedContext from '../../context';

import Card from '../components/Card';
import AddButton from "../components/AddButton"



export default function BikeDetails() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

 
  return (
   <Text>Biek details</Text>
  );
} 
