import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebaseApp from '../config/firebase';
import { getFirestore, addDoc, collection, doc, updateDoc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';
import { uninstallComponent } from '../modules/firestoreActions'
import Toast from 'react-native-simple-toast';
import { Button } from 'react-native-paper'
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDateTime } from '../modules/helpers';



export default function ComponentUninstallFormScreen({ navigation, route }) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isSubmitting, setisSubmitting] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        if (mode == "date") {
            showMode('time')
        }
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const submit = () => {
        setisSubmitting(true)
        uninstallComponent(route.params.bikeId, route.params.componentId, date)
            .then(() => { 
                setisSubmitting(false)
                navigation.navigate("BikeComponentsList")
             })
            .catch((error) => 
            {
                setisSubmitting(false)
                Toast.show(error.message)
            })
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if(isSubmitting)
                {
                  return <ActivityIndicator color="white" style={{paddingRight:20}} />
                }
                else
                {                    
                    return <Button theme={{ colors: { primary: 'black' } }} onPress={() => submit()}><Check name="check" size={24} color="white" /></Button>
                }
            }

        });
    }, [navigation, date, isSubmitting]);
    return (
        <View>
            <View style={styles.contentContainer}>
                <Text style={styles.formTitle}>Uninstallation date and time</Text>
                <TouchableOpacity onPress={() => showMode('date')}>
                    <View style={styles.selectedDateContainer}>
                        <Text style={styles.selectedDate}>{formatDateTime(date)}</Text>
                    </View>
                </TouchableOpacity>

            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    maximumDate={new Date()}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}

                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20
    },
    formTitle: {
        color: "#000000",
        fontSize:17,
        fontWeight:'700'
    },
    selectedDateContainer: {
        borderWidth: 1,
        borderColor: '#D1D1D1',
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginTop: 10,
        borderRadius: 3,

    },
    selectedDate: {
        color: '#F44336'
    }

})