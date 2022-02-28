
import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getFirestore, doc, getDocs, getDoc, query, collection, where } from 'firebase/firestore';
import Card from '../components/Card';
import { FAB } from 'react-native-paper';
import firebaseApp from '../config/firebase';
import { AuthenticatedUserContext } from '../../context'
async function loadRides(loggedUser)
{
  let ridesArray = []
  let ridesDocRef = await getDocs(query(collection(getFirestore(firebaseApp), "rides"),  where("user", "==", doc(getFirestore(firebaseApp), "users", loggedUser.uid))))
  
  ridesDocRef.forEach(ride => {
    let rideData = ride.data()
    rideData.id = ride.id
    ridesArray.push(rideData)
  })
  const promises = ridesArray.map(async ride =>{
    if(ride.bike)
    {
      ride.bike = (await getDoc(ride.bike)).data()
    }
    return ride
  })
  const ridesWithBikeObj = await Promise.all(promises)
  return ridesWithBikeObj
}


export default function BikesListScreen({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);

  const images = {
    route: require("../assets/images/route_icon.png"),
  };

    React.useEffect(() => {
   
      loadRides(User).then((ridesArray)=>{
        setRides(ridesArray)
        setIsLoaded(true)
      })
    }, [])
    const [rides, setRides] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);
    if (!isLoaded) {
      return (<Text>Loading...</Text>)
    }
    else {
    
  return (
    <View style={styles.mainContainer}>
      <View style={styles.rideCardsContainer}>
        {rides.map(ride => {
          return <Card title={ride.name} description2={"Bike: " + (ride.bike? ride.bike.name : "not assigned")} icon={images.route} displayInfo={{
            "Distance": ride.distance + " km",
            "Ride Time": Math.floor(ride.rideTime/3600) + " h " + Math.floor((ride.rideTime%3600)/60) + " m",
            "Elevation gain": ride.elevationGain + " m"
          }} onPress={() => { navigation.navigate('RideDetail', {
            rideId: ride.id})
          } }></Card>
        })}
      </View>
      <View style={styles.addButtonContainer}>
        <FAB style={styles.addButton} icon="plus" onPress={() => navigation.navigate("AddRideScreen")}/>
      </View>
    </View>
  );
    }
} 

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  rideCardsContainer:{
    marginTop: 5, 
    alignItems: 'center', 
    flex: 9
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
    backgroundColor:"#F44336"
  }
})