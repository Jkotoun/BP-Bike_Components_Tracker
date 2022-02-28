
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';


export default function BikeComponentsHistoryScreen() {

  const historyExample = [{
    'distance': '520',
    'component': 'Shimano slx',
    'action': 'Installed'
  },
  {
    'distance': '235',
    'component': 'Schwalbe nobby nic',
    'action': 'Installed'
  },
  ]

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {
          historyExample.map((item) => {
            return (
              <Text>TODO</Text>
              // <View style={styles.historyItemContainer}>
              //   <View style={styles.distanceContainer}>
              //     <Text style={styles.distanceText}>{item.distance} km</Text>
              //   </View>
              //   <View style={styles.descriptionContainer}>
              //     <Text>{item.action}:  {item.component}</Text>
              //   </View>
              // </View>
            )
          })
        }
      </View>
    </View>
  );
} 


const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  contentContainer:{
    display: 'flex', 
    flexDirection: 'column', 
    padding: 25
  },
  historyItemContainer:{
    display: 'flex', 
    flexDirection: 'row', 
    paddingBottom: 15
  },
  distanceContainer:{
    flex: 1
  },
  distanceText:{
    fontSize: 15, 
    fontWeight: 'bold'
  },
  descriptionContainer:{
    flex: 3
  }
})