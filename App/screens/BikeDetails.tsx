
import * as React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import AuthenticatedContext from '../../context';

export default function BikeDetails() {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)
  const historyExample = {
    'Distance': '548 km',
    'Ride Time': "36h 18m",
    'Bike Name': 'Canyon MTB',
    'Purchase date': "8. 7. 2021",
    'Type': 'Mountain Hardtail',
    'Brand': 'Canyon',
    'Model': 'Grand canyon 8'
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {
           Object.entries(historyExample).map((prop, value) => {
            return (
              <View style={styles.detailItemsContainer}>
               
                <View style={styles.propertyNameContainer}>
                  <Text style={styles.propertyNameText}>{prop[0]}</Text>
                </View>
                <View style={styles.propertyValueContainer}>
                  <Text>{prop[1]}</Text>
                </View> 
              </View>
            )
          })
        }
      </View>
    </View>
  );
} 

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  contentContainer:{
    display: 'flex', 
    flexDirection: 'column', 
    padding: 25
  },
  detailItemsContainer:{
    display: 'flex', 
    flexDirection: 'row', 
    paddingBottom: 15
  },
  propertyNameContainer:{
    flex: 1
  },
  propertyNameText:{
    fontSize: 15, 
    fontWeight: 'bold'
  },
  propertyValueContainer:{
    flex: 1
  }
})