import * as React from 'react';
import { Text, View, Image, Alert, TouchableOpacity, ImageSourcePropType } from 'react-native'

interface cardProps{
    maintext: string,
    description?: string,
    image?: ImageSourcePropType,
}

export default function WearHistoryCard(props: cardProps) {
    return (
        <View style={{ width: '96%', backgroundColor: "#FDFDFD", margin:4, marginTop:10, alignSelf:'center',  elevation: 2, borderRadius: 3 }}>
            <View style={{ flexDirection: "row", padding:5}}>
                <View style={{ flex: 0.75, padding: 15 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{props.maintext}</Text>
                    <View style={{paddingTop:3}}>
                        {props.description && <Text style={{ fontSize: 12 }}>{props.description}</Text>}
                    </View>
                </View>
                <View style={{ flex: 0.25, padding: 10, paddingRight:20 }}>
                    <Image source={props.image} style={{ width: 80, height: 80 }}/> 
                </View>
            </View>
        </View>

    )
}