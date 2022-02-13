
import * as React from 'react';
import { Text, View, Alert, StyleSheet} from 'react-native';
import AuthenticatedContext from '../../context';
import { FAB } from 'react-native-paper';
import ServiceRecordCard from '../components/ServiceRecordCard';
export default function ComponentServicesHistoryScreen() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)


  return (
    <View style={styles.mainContainer}>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}><Text style={styles.priceHighlightedText}>Total:</Text> 170 CZK</Text>
      </View>
      <ServiceRecordCard maintext='300 km, 40 h' description='Changed quick link' price={80} />
      <ServiceRecordCard maintext='0 km, 0 h' description='Installed new quick link' price={90} />
      <View style={styles.addButtonContainer}>
        <FAB
          style={styles.addButton}
          icon="plus"
          onPress={() => Alert.alert("TODO add service form")}
        />
      </View>
    </View>
  );
} 

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  totalPriceContainer:{
    padding: 15
  },
  totalPriceText:{
    fontSize: 18
  },
  priceHighlightedText:{
    color: '#F44336', 
    fontWeight: 'bold'
  },
  addButtonContainer:{
    position: 'absolute', 
    right: 0, 
    bottom: 0, 
    paddingVertical: 30, 
    paddingHorizontal: 20, 
    zIndex: 99
  },
  addButton:{
    backgroundColor: "#F44336"
  }

})