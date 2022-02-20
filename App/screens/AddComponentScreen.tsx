import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'

import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';

export default function AddComponentScreen({ navigation }) {

  const [selectedLanguage, setSelectedLanguage] = useState();


  const { control, setError, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {
    navigation.back()
  }

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
    }}>
      <View style={{ paddingVertical: 15 }}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{
          alignItems: 'center',
        }}>
          <StatusBar
            backgroundColor="#F44336"
          />
          <Controller

            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label='Component name'
              />
            )}
            name="componentname"
            defaultValue=""
          />
          {errors.component?.type == 'required' && <Text style={{ color: "white" }}>Component name is required</Text>}
          <Controller
            control={control}
            rules={{
              required: false,
            }}
            render={({ field: { onChange, value } }) => (
             
              <RNPickerSelect
              onValueChange={onChange}
              value={value}
              placeholder={{label:'Component type'}}
              
              items={[
                { label: 'Fork', value: 'fork' },
                { label: 'Chain', value: 'chain' },
                { label: 'Cassette', value: 'cassette' },
                { label: 'Rear suspension', value: 'suspension' },
                { label: 'todo dalsi', value: 'dalsi' }
            ]}
              style={pickerStyle}
            />
              )}
              name="Type"
              defaultValue=""
            />
          <Controller

            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label='Brand'
              />
            )}
            name="brand"
            defaultValue=""
          />
          {errors.brand?.type == 'required' && <Text style={{ color: "white" }}>Brand is required</Text>}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label='Model'
              />
            )}
            name="model"
            defaultValue=""
          />
          {errors.model?.type == 'required' && <Text style={{ color: "white" }}>Model is required</Text>}

          <Controller
            control={control}
            rules={{
              required: false,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                label='Purchase date'
              />
            )}
            name="buy_date"
            defaultValue=""
          />

          <Controller
            control={control}
            rules={{
              required: false,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType='numeric'
                label='Km to date'
              />
            )}
            name="km_to_date"
            defaultValue=""
          />


          <Controller
            control={control}
            rules={{
              required: false,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType='numeric'
                label='Ride hours to date'
              />
            )}
            name="hours_to_date"
            defaultValue=""
          />
        </ScrollView >
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  input: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 335,
    margin: 7,
  },
  submit_text: {
    color: "#F44336",
    textAlign: 'center',
    fontWeight: "bold",

  },
  submit: {
    backgroundColor: "#ffffff",
    margin: 15,
    width: 300,
    padding: 10,
    textAlign: 'center'
  },
  formHeader: {
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 50,
    fontSize: 24,
    textAlign: 'left'
  }
});
const pickerStyle = {
  inputIOS: {
          elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 335,
    margin: 7,
    padding:30,
  },
  inputAndroid: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 335,
    margin: 7,
    padding:30,
    
  },
  placeholder:{
    color:"grey"
  }
};