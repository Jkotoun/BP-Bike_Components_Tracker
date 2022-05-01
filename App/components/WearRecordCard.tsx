import * as React from 'react';
import { Text, View, Image, ImageSourcePropType, StyleSheet, Modal, Button, Pressable } from 'react-native'
// import ImageViewer from 'react-native-image-zoom-viewer';
import ImageView from "react-native-image-viewing";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CardBase from './CardBase'
interface cardProps {
    maintext: string,
    description?: string,
    date: string,
    image?: string | null,
    options?: Array<Option>
}
interface Option {
    onPress: () => void,
    text: string
}
export default function WearHistoryCard(props: cardProps) {
    const [visible, setIsVisible] = React.useState(false);

    const images = [{ uri: props.image }]
    return (
        <>
            <CardBase>
                <View style={Styles.mainContainer}>
                    <View style={Styles.cardContent}>
                        <View style={Styles.contentContainer}>
                            <View style={Styles.textContainer}>
                                <Text style={Styles.date}>{props.date}</Text>
                                <Text style={Styles.mainText}>{props.maintext}</Text>
                                <View style={Styles.secondaryTextContainer}>
                                    {props.description && <Text style={Styles.secondaryText}>{props.description}</Text>}
                                </View>
                            </View>
                            {props.image &&
                                <View style={Styles.imageContainer}>
                                    <Pressable onPress={() => setIsVisible(true)}>
                                        <Image source={{ uri: props.image }} style={Styles.imageStyles} />
                                    </Pressable>
                                </View>
                            }
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

            <ImageView
                images={images}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
        </>
    )
}

const Styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
    },
    textContainer: {
        flex: 0.65,
        paddingLeft: 10,
        paddingTop:5
    },
    mainText: {
        fontSize: 12,
        fontWeight: "bold"
    },
    date: {
        fontSize: 15,
        fontWeight: "bold"
    },
    secondaryTextContainer: {
        paddingTop: 3
    },
    secondaryText: {
        fontSize: 12
    },
    imageContainer: {
        flex: 0.35,
        padding: 5,
        paddingRight: 25
    },
    imageStyles: {
        width: 108,
        height: 81
    },
    menu: {
        flex: 1,
        paddingTop: 5
    },
    menuOption: {
        padding: 8
    },
    cardContent: {
        flex: 12,
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding:3

    }
})