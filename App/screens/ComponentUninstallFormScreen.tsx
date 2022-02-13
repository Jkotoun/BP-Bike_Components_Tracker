import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function ComponentUninstallFormScreen({ navigation }) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

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

    return (
        <View>
            <View style={styles.contentContainer}>
                <Text style={styles.formTitle}>Uninstallation date and time</Text>
                <TouchableOpacity onPress={() => showMode('date')}>
                    <View style={styles.selectedDateContainer}>
                        <Text style={styles.selectedDate}>{date.toLocaleString()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}

                />
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    contentContainer:{
        padding: 20
    },
    formTitle:{
        color: "#6F6F6F"
    },
    selectedDateContainer:{
        borderWidth: 1, 
        borderColor: '#D1D1D1', 
        backgroundColor: '#FFFFFF', 
        padding: 10, 
        marginTop: 10, 
        borderRadius: 3, 
        width: 300 
    },
    selectedDate:{
        color: '#F44336'
    }

})