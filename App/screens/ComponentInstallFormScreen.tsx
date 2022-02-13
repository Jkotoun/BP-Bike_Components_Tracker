import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const [checked, setChecked] = React.useState('first');

  return (
    <View>
      <View style={styles.formTitleContainer}>
        <Text style={styles.formTitle}>Installation date and time</Text>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          />)}
      
      <RadioButton.Group
        onValueChange={value => {
          setChecked(value)
          if (value == "second") {
            showMode('date')
          }
        }
        } value={checked}>
        
        <RadioButton.Item label="Since beggining" value="first" color="#F44336" style={styles.radioItem} />
        <RadioButton.Item
          style={styles.radioItem}
          color='#F44336'
          label={
          <TouchableOpacity onPress={() => showMode('date')}>
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>{date.toLocaleString("en-US")}</Text>
            </View>
          </TouchableOpacity>} value="second" />
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  formTitleContainer:{
    padding: 20 
  },
  formTitle:{
    color: "#6F6F6F" 
  },
  radioItem:{
    flexDirection: 'row-reverse', 
    alignSelf: 'flex-start'
  },
  selectedDateContainer:{
    borderWidth: 1, 
    borderColor: '#D1D1D1', 
    backgroundColor: '#FFFFFF', 
    padding: 10, 
    borderRadius: 3, 
    width: 275 
  },
  selectedDateText:{
    color: '#F44336'
  }
})