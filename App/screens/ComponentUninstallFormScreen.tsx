import React, { useState } from 'react';
import { View, Button, Platform, TouchableOpacity, Text } from 'react-native';
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
        console.log(currentDate)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const [checked, setChecked] = React.useState('first');
    return (
        <View>
            <View style={{ padding: 20 }}>
                <Text style={{ color: "#6F6F6F" }}>Uninstallation date and time</Text>
                <TouchableOpacity onPress={() => showMode('date')}>

                    <View style={{ borderWidth: 1, borderColor: '#D1D1D1', backgroundColor: '#FFFFFF', padding: 10, marginTop: 10, borderRadius: 3, width: 300 }}>

                        <Text style={{ color: '#F44336' }}>{date.toLocaleString()}</Text>

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