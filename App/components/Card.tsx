import * as React from 'react';
import { Text, View, Image, TouchableOpacity, ImageSourcePropType, StyleSheet } from 'react-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CardBase from './CardBase';
interface cardProps {
    onPress: () => void,
    displayInfo?: object,
    description?: string,
    description2?: string,
    icon?: ImageSourcePropType,
    title: string
    options?: Array<Option>
    stravaIcon?: boolean,
    active?: boolean
}

interface Option{
    onPress: () => void,
    text: string
}
export default function Card(props: cardProps) {
    const stravaIcon = require("../assets/images/strava_icon_small.png")
    //calc flex for count of stats passed in props to view in card
    let flexSize: number
    if (props.displayInfo)
    {
         flexSize= 1 / Object.keys(props.displayInfo).length
    }
    return (
        <CardBase>
            <View style={(props.active===undefined || props.active===true) ?  Styles.mainContainer : [Styles.mainContainer, Styles.notActiveStyle]}>
                <TouchableOpacity onPress={props.onPress} style={Styles.touchableContainer}>
                    <View style={Styles.upperHalfContainer}>
                        <View style={Styles.textsContainer}>
                            <Text style={Styles.title}>{props.title}</Text>
                            <View style={Styles.descriptionsContainer}>
                                {props.description && <Text style={Styles.description1}>{props.description}</Text>}
                                {props.description2 && <Text style={Styles.description2}>{props.description2}</Text>}
                            </View>
                        </View>
                        <View style={Styles.imageContainer}>
                            <Image source={props.icon} style={Styles.imageStyle} />
                        </View>
                    </View>
                    {props.displayInfo && 
                    <View style={Styles.statsContainer}>
                        {
                            
                            Object.entries(props.displayInfo).map((prop, value) => {
                                
                                return (
                                    // different styles for >2 items (less padding, centering)
                                    <View key={prop[0]} style={{ flex: flexSize, paddingLeft: 15, alignItems: flexSize > 0.4 ? "flex-start" : "flex-start" }}>
                                        <Text style={Styles.statValue}>{prop[1]}</Text>
                                        <Text style={Styles.statDescription}>{prop[0]}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>}
                </TouchableOpacity>
                { props.options && <Menu style={Styles.menu}>
                    <MenuTrigger text={<Icon name="dots-vertical" size={23} color="#000000" />} />
                    <MenuOptions>
                        {props.options.map((item) => {return (
                           <MenuOption key={item.text} onSelect={item.onPress} text={item.text} style={Styles.menuOption}/>
                        )})}
                    </MenuOptions>
                </Menu>}
                {
                    props.stravaIcon &&  <View style={Styles.stravaIconContainer}>
                        <Image source={stravaIcon} style={Styles.stravaIcon} />
                    </View>
                }
            </View>
        </CardBase>
    )
}

const Styles = StyleSheet.create({
    mainContainer:{
        display: 'flex', 
        flexDirection: 'row',
    },
    notActiveStyle:{
        opacity:0.5
    },
    touchableContainer:{
        flex:12
    },
    upperHalfContainer:{
        flexDirection: "row"
    },
    textsContainer:{
        flex: 0.75, 
        padding: 15
    },
    title:{
        fontSize: 15, 
        fontWeight: "bold"
    },
    descriptionsContainer:{
        paddingTop: 3
    },
    description1:{
        fontSize: 12 
    },
    description2:{
        fontSize: 12, 
        fontWeight: "bold"
    },
    imageContainer:{
        flex: 0.25, 
        paddingTop: 10
    },
    imageStyle:{
        width: 55, 
        height: 55
    },
    statsContainer:{
        flexDirection: 'row', 
        paddingBottom: 15
    },
    statDescription:{
        color: "#696969"
    },
    statValue:{
        color: "#F44336", 
        fontSize: 15, 
        fontWeight: 'bold' 
    },
    stravaIconContainer:{
        flex:1, 
        paddingTop:7,
        paddingRight:3
    },
    stravaIcon:{
        width:25, 
        height:25
    },
    menu:{
        flex:1, 
        paddingTop:5
    },
    menuOption:{
        padding:8
    }
})