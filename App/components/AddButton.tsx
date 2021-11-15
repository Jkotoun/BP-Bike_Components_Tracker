import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';


interface buttonProps{
    onPress: () => void
}

export default function AddButton(props : buttonProps) {

    return (
        <View style={{ flex: 1}}>
            <TouchableOpacity onPress={props.onPress}>
                <Text style={{ 
                    backgroundColor: "#F44336", color: "white", fontSize: 20, width: 50, height: 50, borderRadius: 50, elevation: 1, textAlign: 'center', textAlignVertical: "center" }}>+</Text>
            </TouchableOpacity>
        </View >

    )
}