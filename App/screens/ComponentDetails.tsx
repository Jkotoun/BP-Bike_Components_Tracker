
import * as React from 'react';
import { Text, View, StyleSheet} from 'react-native';


export default function ComponentDetails() {
  const historyExample = {
    'Distance': '150 km',
    'Ride Time': "50h 18m",
    'Component Name': 'Shimano SLX chain',
    'Purchase date': "2. 8. 2021",
    'Component type': '12 speed chain',
    'Brand': 'Shimano',
    'Model': 'SLX'
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {
           Object.entries(historyExample).map((prop, value) => {
            return (
              <View style={styles.itemContainer}>
               
                <View style={styles.propertyNameContainer}>
                  <Text style={styles.propertyTextContainer}>{prop[0]}</Text>
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
  mainContainer:{
    flex: 1
  },
  contentContainer:{
    display: 'flex', 
    flexDirection: 'column', 
    padding: 25
  },
  itemContainer:{
    display: 'flex', 
    flexDirection: 'row', 
    paddingBottom: 15
  },
  propertyNameContainer:{
    flex: 1
  },
  propertyTextContainer:{
    fontSize: 15, 
    fontWeight: 'bold'
  },
  propertyValueContainer:{
    flex: 1
  }


})
