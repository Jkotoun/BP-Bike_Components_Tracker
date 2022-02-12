import * as React from 'react';
import { Text, View, Image, Alert, TouchableOpacity, ImageSourcePropType } from 'react-native'
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
    let flexSize: number = 1 / Object.keys(props.displayInfo).length
    return (
        <CardBase>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <TouchableOpacity onPress={props.onPress} style={{flex:12}}>
                    <View style={{ flexDirection: "row", }}>
                        <View style={{ flex: 0.75, padding: 15 }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{props.title}</Text>
                            <View style={{ paddingTop: 3 }}>
                                {props.description && <Text style={{ fontSize: 12 }}>{props.description}</Text>}
                                {props.description2 && <Text style={{ fontSize: 12, fontWeight: "bold" }}>{props.description2}</Text>}
                            </View>
                        </View>
                        <View style={{ flex: 0.25, paddingTop: 10 }}>
                            <Image source={props.icon} style={{ width: 55, height: 55 }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 15 }}>
                        {
                            Object.entries(props.displayInfo).map((prop, value) => {
                                return (
                                    <View key={prop[0]} style={{ flex: flexSize, paddingLeft: flexSize > 0.4 ? 15 : 0, alignItems: flexSize > 0.4 ? "flex-start" : "center" }}>
                                        <Text style={{ color: "#F44336", fontSize: 15, fontWeight: 'bold' }}>{prop[1]}</Text>
                                        <Text style={{ color: "#696969" }}>{prop[0]}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                </TouchableOpacity>
                { props.options && <Menu style={{flex:1, paddingTop:5}}>
                    <MenuTrigger text={<Icon name="dots-vertical" size={23} color="#000000" />} />
                    <MenuOptions>
                        {props.options.map((item) => {return (
                           <MenuOption onSelect={item.onPress} text={item.text} style={{padding:8}}/>
                        )})}
                    </MenuOptions>
                </Menu>}
            </View>
        </CardBase>


    )
}