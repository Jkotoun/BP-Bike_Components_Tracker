import * as React from 'react';
import { Text, View, Image } from 'react-native'

// function renderInfo(dataObj)
// {
//     console.log(dataObj)
//     console.log(flexSize)
//     dataObj.map((prop,value)=>{
//         console.log(prop + " : " + value)
//         return (
//             <View style={{flex:flexSize}}>
//                 <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>{value}</Text>
//                     <Text style={{ color: "#696969" }}>{value}</Text>
//             </View>
//         )
//     })
// }

export default function BikeListItem(props) {
    // let InfoViews = renderInfo(props.displayInfo)
    const flexSize = 1/Object.keys(props.displayInfo).length 
    return (
        <View style={{  width: '90%', backgroundColor: "#FDFDFD", margin: 10, elevation: 2, borderRadius: 7 }}>
            <View style={{flexDirection: "row",}}>
                <View style={{ flex: 0.7, padding: 15 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{props.name}</Text>
                    <Text>{props.bikeCategory}</Text>
                </View>
                <View style={{ flex: 0.3 , paddingTop:15 }}>
                    { props.bikeCategory=="MTB full suspension" && <Image source={require('../assets/images/full_suspension_mtb_icon.png')} style={{ width: 70, height: 41 }} />}
                    { props.bikeCategory=="MTB hardtail" && <Image source={require('../assets/images/full_suspension_mtb_icon.png')} style={{ width: 70, height: 41 }} />}
                    { props.bikeCategory=="Road" && <Image source={require('../assets/images/road_icon.png')} style={{ width: 70, height: 41 }} />}
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom:15, marginLeft:15 }}>
                {
                    Object.entries(props.displayInfo).map((prop,value)=>{
                        return (
                            <View style={{flex:flexSize}}>
                                <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>{prop[1]}</Text>
                                    <Text style={{ color: "#696969" }}>{prop[0]}</Text>
                            </View>
                        )
                })
                
                }
            </View>
        </View>

    )
}