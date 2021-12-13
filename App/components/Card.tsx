import * as React from 'react';
import { Text, View, Image, Alert, TouchableOpacity, ImageSourcePropType } from 'react-native'

interface cardProps{
    onPress: () => void,
    displayInfo?: object,
    description?: string,
    description2?: string,
    icon?: ImageSourcePropType,
    title:string
}

export default function Card(props: cardProps) {
    let flexSize: number = 1 / Object.keys(props.displayInfo).length
    return (
        <View style={{ width: '96%', backgroundColor: "#FDFDFD", margin:4,  elevation: 2, borderRadius: 3 }}>
            <TouchableOpacity onPress={props.onPress}>
            <View style={{ flexDirection: "row", }}>
                <View style={{ flex: 0.75, padding: 15 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{props.title}</Text>
                    <View style={{paddingTop:3}}>
                        {props.description && <Text style={{ fontSize: 12 }}>{props.description}</Text>}
                        {props.description2 && <Text style={{ fontSize: 12, fontWeight:"bold" }}>{props.description2}</Text>}
                    </View>
                </View>
                <View style={{ flex: 0.25, paddingTop: 10 }}>
                    <Image source={props.icon} style={{ width: 55, height: 55 }}/> 
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingBottom: 15}}>
                {
                    Object.entries(props.displayInfo).map((prop, value) => {
                        return (
                            <View key={prop[0]} style={{ flex: flexSize,paddingLeft: flexSize>0.4 ? 15:0,  alignItems: flexSize>0.4 ? "flex-start" :"center"  }}>
                                <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>{prop[1]}</Text>
                                <Text style={{ color: "#696969" }}>{prop[0]}</Text>
                            </View>
                        )
                    })
                }
            </View>
            </TouchableOpacity>
        </View>

    )
}