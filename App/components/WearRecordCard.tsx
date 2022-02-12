import * as React from 'react';
import { Text, View, Image, ImageSourcePropType, StyleSheet } from 'react-native'
import CardBase from './CardBase'
interface cardProps{
    maintext: string,
    description?: string,
    image?: ImageSourcePropType,
}

export default function WearHistoryCard(props: cardProps) {
    return (
        <CardBase>
            <View style={Styles.mainContainer}>
                <View style={Styles.textContainer}>
                    <Text style={Styles.mainText}>{props.maintext}</Text>
                    <View style={Styles.secondaryTextContainer}>
                        {props.description && <Text style={Styles.secondaryText}>{props.description}</Text>}
                    </View>
                </View>
                <View style={Styles.imageContainer}>
                    <Image source={props.image} style={Styles.imageStyles}/> 
                </View>
            </View>
        </CardBase>

    )
}

const Styles = StyleSheet.create({
    mainContainer:{
        flexDirection: "row", padding:5
    },
    textContainer:{
        flex: 0.75, 
        padding: 15
    },
    mainText:{
        fontSize: 15, 
        fontWeight: "bold" 
    },
    secondaryTextContainer:{
        paddingTop:3
    },
    secondaryText:{
        fontSize: 12 
    },
    imageContainer:{
        flex: 0.25, 
        padding: 10, 
        paddingRight:20 
    },
    imageStyles:{
        width: 80, 
        height: 80
    }
})