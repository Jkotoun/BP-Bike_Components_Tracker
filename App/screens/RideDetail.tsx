
import * as React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';






export default function RideDetail() {


  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>


        <Text style={styles.titleText}>Bike: Canyon MTB</Text>
        <Text style={styles.titleText}>17. 7. 2021</Text>
      </View>
      <View style={styles.rideMapContainer}>
        <Image source={require("./../assets/images/ridemap.png")} style={styles.rideMap} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statContainter}>
            <Text style={styles.statValue}>43 km</Text>
            <Text style={styles.statName}>Distance</Text>
          </View>
          <View style={styles.statContainter}>
            <Text style={styles.statValue}>1 148 m</Text>
            <Text style={styles.statName}>Elevation gain</Text>
          </View>
          <View style={styles.statContainter}>
            <Text style={styles.statValue}>5h 11m</Text>
            <Text style={styles.statName}>Ride time</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statContainter}>
            <Text style={styles.statValue}>57 km/h</Text>
            <Text style={styles.statName}>Max speed</Text>
          </View>
          <View style={styles.statContainter}>
            <Text style={styles.statValue}>8.6 km/h</Text>
            <Text style={styles.statName}>Average speed</Text>
          </View>
          <View style={styles.statContainter}>
            <Text style={styles.statValue}>7h 42m</Text>
            <Text style={styles.statName}>Elapsed time</Text>
          </View>
        </View>
          <Text style={styles.stravaLink}>View in strava</Text>
      </View>
    </View>

  )
} 

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  titleContainer:{
    padding: 20, 
    width: "95%" 
  },
  titleText:{
    fontSize: 17, 
    fontWeight: '700'
  },
  rideMapContainer:{
    paddingHorizontal: 20, 
    paddingBottom:5, 
    elevation: 5
  },
  rideMap:{
    width: "100%", 
    height: 200, 
    borderRadius: 4
  },
  statsContainer:{
    width: '90%', 
    padding: 5, 
    flexDirection: 'column', 
    backgroundColor: "#FDFDFD", 
    margin: 4, 
    elevation: 2, 
    borderRadius: 3, 
    display: 'flex', 
    alignSelf: 'center'
  },
  statsRow:{
    flexDirection:'row',
    display:'flex',
    paddingVertical:10
  },
  statContainter:{
    flex: 1, 
    alignItems: 'center' 
  },
  statValue:{
    color: "#F44336", 
    fontSize: 15, 
    fontWeight: 'bold'
  },
  statName:{
    color: "#696969"
  },
  stravaLink:{
    alignSelf:'flex-end', 
    color:"#F44336", 
    fontWeight:"bold", 
    paddingTop:7, 
    paddingBottom:8, 
    fontSize:14, 
    paddingRight:10
  }
})
