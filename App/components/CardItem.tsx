import * as React from 'react';
import { Text, View, Image } from 'react-native'


export default function CardItem(props) {
  
    // let InfoViews = renderInfo(props.displayInfo)
    let flexSize: number = 1 / Object.keys(props.displayInfo).length
    return (
        <View style={{ width: '90%', backgroundColor: "#FDFDFD", margin: 10, elevation: 2, borderRadius: 7 }}>
            <View style={{ flexDirection: "row", }}>
                <View style={{ flex: 0.7, padding: 15 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{props.title}</Text>
                    <View style={{paddingTop:3}}>
                        {props.description != "" && <Text style={{ fontSize: 12 }}>{props.description}</Text>}
                        {props.description2 != "" && <Text style={{ fontSize: 12 }}>{props.description2}</Text>}
                    </View>
                </View>
                <View style={{ flex: 0.3, paddingTop: 15 }}>
                    <Image source={props.icon} style={{ width: 70, height: 41 }}/> 
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: 15, marginLeft: 15 }}>
                {
                    Object.entries(props.displayInfo).map((prop, value) => {
                        return (
                            <View key={prop[0]} style={{ flex: flexSize }}>
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