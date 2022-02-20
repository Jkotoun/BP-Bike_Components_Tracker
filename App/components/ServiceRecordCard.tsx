import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native'
import CardBase from './CardBase'
interface cardProps{
    maintext: string,
    description?: string,
    price: number
}

export default function ServiceRecordCard(props: cardProps) {
    return (
        <CardBase>
            <View style={Styles.cardContent}>                
            <View style={Styles.textBlock}>
                    <Text style={Styles.mainText}>{props.maintext}</Text>
                    <View style={Styles.secondaryTextView}>
                        {props.description && <Text style={Styles.secondaryText}>{props.description}</Text>}
                    </View>
                </View>
                <View style={Styles.priceView}>
                    <Text style={Styles.priceText}>{props.price} CZK</Text>
                </View>
            </View>
        </CardBase>
    )
}

const Styles = StyleSheet.create({
    cardContent:{
        padding:5 
    },
    textBlock:
    {
        padding:10
    },
    mainText:{
        fontSize: 15, 
        fontWeight: "bold" 
    },
    secondaryTextView:{
        paddingTop:3
    },
    secondaryText:{
        fontSize: 12, 
        color:'black' 
    },
    priceView:{
        alignSelf:'flex-end', 
        paddingBottom:10, 
        paddingRight:15
    },
    priceText:{
        color:'#F44336', 
        fontSize:16, 
        fontWeight:'bold'
    }

})