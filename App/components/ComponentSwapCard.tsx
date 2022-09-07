import * as React from 'react';
import { Text, View, Image, ImageSourcePropType, StyleSheet } from 'react-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import CardBase from './CardBase'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface cardProps{
    maintext: string,
    installationDateString: string,
    uninstallationDateString: string,
    installationNote: string,
    options?: Array<Option>
}
interface Option{
    onPress: () => void,
    text: string
}

export default function ComponentSwapCard(props: cardProps) {
    return (
        <CardBase>
            <View style={Styles.mainContainer}>
                <View style={Styles.textContainer}>
                    <Text style={Styles.mainText}>{props.maintext}</Text>
                    <View style={Styles.secondaryTextContainer}>
                        <Text style={Styles.secondaryText}><Text style={{fontWeight:'bold'}}>Installed: </Text>{props.installationDateString}</Text>
                        <Text style={Styles.secondaryText}><Text style={{fontWeight:'bold'}}>Uninstalled: </Text>{props.uninstallationDateString}</Text>
                        {props.installationNote !== "" && <Text style={Styles.description}><Text style={{fontWeight:'bold'}}>Note: </Text>{props.installationNote} </Text>}
                    </View>
                </View>
                { props.options && <Menu style={Styles.menu}>
                    <MenuTrigger text={<Icon name="dots-vertical" size={23} color="#000000" />} />
                    <MenuOptions>
                        {props.options.map((item) => {return (
                           <MenuOption onSelect={item.onPress} text={item.text} style={Styles.menuOption}/>
                        )})}
                    </MenuOptions>
                </Menu>}
            </View>
        </CardBase>

    )
}

const Styles = StyleSheet.create({
    mainContainer:{
        flexDirection: "row", 
        display: 'flex', 
        padding:5
    },
    textContainer:{
        flex: 12, 
        padding: 15
    },
    mainText:{
        fontSize: 15, 
        fontWeight: "bold" 
    },
    secondaryTextContainer:{
        paddingTop:3
    },
    description:{
        fontSize: 12 ,
        paddingVertical:5
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
    },
    menu:{
        flex:1, 
        paddingTop:5
    },
    menuOption:{
        padding:8
    }
})