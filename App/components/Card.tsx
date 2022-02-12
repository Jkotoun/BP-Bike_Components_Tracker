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
}

interface Option{
    onPress: () => void,
    text: string
}

export default function Card(props: cardProps) {
    //calc flex for count of stats passed in props to view in card
    let flexSize: number = 1 / Object.keys(props.displayInfo).length
    return (
        <CardBase>
            <View style={Styles.mainContainer}>
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
                    <View style={Styles.statsContainer}>
                        {
                            Object.entries(props.displayInfo).map((prop, value) => {
                                return (
                                    // different styles for >2 items (less padding, centering)
                                    <View key={prop[0]} style={{ flex: flexSize, paddingLeft: flexSize > 0.4 ? 15 : 0, alignItems: flexSize > 0.4 ? "flex-start" : "center" }}>
                                        <Text style={Styles.statValue}>{prop[1]}</Text>
                                        <Text style={Styles.statDescription}>{prop[0]}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                </TouchableOpacity>
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
        display: 'flex', 
        flexDirection: 'row'
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
    menu:{
        flex:1, 
        paddingTop:5
    },
    menuOption:{
        padding:8
    }
})