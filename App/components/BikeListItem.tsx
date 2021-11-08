import * as React from 'react';
import { Text, View, Image } from 'react-native'

export default function BikeListItem(props) {
    return (
        <View style={{  width: '90%', backgroundColor: "#FDFDFD", margin: 10, elevation: 2, borderRadius: 7 }}>
            <View style={{flexDirection: "row",}}>
                <View style={{ flex: 0.7, padding: 15 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{props.name}</Text>
                    <Text>{props.bikeCategory}</Text>
                </View>
                <View style={{ flex: 0.3 }}>
                    <Image source={require('../assets/images/full_suspension_mtb_icon.png')} style={{ width: 70, height: 70 }} />
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom:15, marginLeft:15 }}>
                <View style={{ flex: 0.35 }}>
                    <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>{props.rideDistance}km</Text>
                    <Text style={{ color: "#696969" }}>Distance</Text>
                </View>
                <View style={{ flex: 0.35 }}>
                    <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>{props.rideTime}</Text>
                    <Text style={{ color: "#696969"}}>Ride Time</Text>
                </View>
            </View>
        </View>

    )
}