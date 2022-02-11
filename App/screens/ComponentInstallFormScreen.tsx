import React, { useState } from 'react';
import { View, Button, Platform, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';


export default function ComponentInstallFormScreen({ navigation }) {
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
        <Text style={{ color: "#6F6F6F" }}>Installation date and time</Text>
        {/* <TouchableOpacity onPress={() => showMode('date')}>

          <View style={{ borderWidth: 1, borderColor: '#D1D1D1', backgroundColor: '#FFFFFF', padding: 10, marginTop: 10, borderRadius: 3, width: 300 }}>

            <Text style={{ color: '#F44336' }}>{date.toLocaleString()}</Text>

          </View>
        </TouchableOpacity> */}
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




      <RadioButton.Group
        onValueChange={value => {
          setChecked(value)
          if (value == "second") {
            showMode('date')
          }
        }
        } value={checked}>

        <RadioButton.Item label="Since beggining" value="first" color="#F44336" style={{ flexDirection: 'row-reverse', alignSelf: 'flex-start' }} />
        <RadioButton.Item
          style={{ flexDirection: 'row-reverse', alignSelf: 'flex-start' }}
          color='#F44336'
          label={<TouchableOpacity onPress={() => showMode('date')}>

            <View style={{ borderWidth: 1, borderColor: '#D1D1D1', backgroundColor: '#FFFFFF', padding: 10, borderRadius: 3, width: 275 }}>

              <Text style={{ color: '#F44336' }}>{date.toLocaleString("en-US")}</Text>

            </View>
          </TouchableOpacity>} value="second" />

      </RadioButton.Group>





      {/* <RadioButton
        value="first"
        color="#F44336"
        status={checked === 'first' ? 'checked' : 'unchecked'}
        onPress={() => setChecked('first')}
      />
      <RadioButton
        value="second"
        color="#F44336"
        status={checked === 'second' ? 'checked' : 'unchecked'}
        onPress={() => setChecked('second')}
      /> */}
    </View>

  );
};