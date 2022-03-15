import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native'
import CardBase from './CardBase'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface cardProps {
    maintext: string,
    description?: string,
    price: number
    options?: Array<Option>
}
interface Option {
    onPress: () => void,
    text: string
}




export default function ServiceRecordCard(props: cardProps) {
    return (
        <CardBase>
            <View style={Styles.mainContainer}>
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

                {props.options && <Menu style={Styles.menu}>
                    <MenuTrigger text={<Icon name="dots-vertical" size={23} color="#000000" />} />
                    <MenuOptions>
                        {props.options.map((item) => {
                            return (
                                <MenuOption onSelect={item.onPress} text={item.text} style={Styles.menuOption} />
                            )
                        })}
                    </MenuOptions>
                </Menu>}
            </View>

        </CardBase>
    )
}

const Styles = StyleSheet.create({
    cardContent: {
        padding: 5,
        flex:12
    },
    textBlock:
    {
        padding: 10
    },
    mainText: {
        fontSize: 15,
        fontWeight: "bold"
    },
    secondaryTextView: {
        paddingTop: 3
    },
    secondaryText: {
        fontSize: 12,
        color: 'black'
    },
    priceView: {
        alignSelf: 'flex-end',
        paddingBottom: 10,
        paddingRight: 15
    },
    priceText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: 'bold'
    },
    menu:{
        flex:1, 
        paddingTop:5
    },
    menuOption:{
        padding:8
    },
    mainContainer:{
        display: 'flex', 
        flexDirection: 'row',
    },

})