import * as React from 'react';
import { Text, View, Image, Alert, TouchableOpacity, ImageSourcePropType } from 'react-native'


export default function CardBase(props) {
    return (
        <View style={{ width: '96%', backgroundColor: "#FDFDFD", margin: 4, elevation: 2, borderRadius: 3 }}>
           {props.children}
        </View>


    )
}