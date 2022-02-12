import * as React from 'react';
import { Text, View, Image, Alert, TouchableOpacity, ImageSourcePropType } from 'react-native'
import CardBase from './CardBase'
interface cardProps{
    maintext: string,
    description?: string,
    price: number
}

export default function ServiceRecordCard(props: cardProps) {
    return (
        <CardBase>
            <View style={{ padding:5}}>
                <View style={{  padding: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{props.maintext}</Text>
                    <View style={{paddingTop:3}}>
                        {props.description && <Text style={{ fontSize: 12, color:'black' }}>{props.description}</Text>}
                    </View>
                </View>
                <View style={{alignSelf:'flex-end', paddingBottom:10, paddingRight:15}}>
                    <Text style={{color:'#F44336', fontSize:16, fontWeight:'bold'}}>{props.price} CZK</Text>
                </View>
            </View>
        </CardBase>

    )
}