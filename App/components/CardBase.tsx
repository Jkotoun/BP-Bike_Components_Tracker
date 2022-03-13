import * as React from 'react';
import { View, StyleSheet} from 'react-native'




export default function CardBase(props) {
    return (
        <View style={styles.cardBackground}>
           {props.children}
        </View>


    )
}

const styles = StyleSheet.create({
    cardBackground:{
        width: '96%', 
        backgroundColor: "#FDFDFD", 
        margin: 4, 
        elevation: 2, 
        borderRadius: 3,
    }
})