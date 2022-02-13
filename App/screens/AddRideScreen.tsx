import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import AuthenticatedContext from '../../context';
import { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';


export default function AddRideScreen({ navigation }) {

  const [selectedLanguage, setSelectedLanguage] = useState();
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)

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
                label='Ride title'
              />
            )}
            name="ridetitle"
            defaultValue=""
          />
          {errors.bikename?.type == 'required' && <Text style={{ color: "white" }}>Bike name is required</Text>}
          <Controller
            control={control}
            rules={{
              required: false,
            }}
            render={({ field: { onChange, value } }) => (
             
              <RNPickerSelect
              onValueChange={onChange}
              value={value}
              placeholder={{label:'Select bike'}}
              
              items={[
                { label: 'Canyon grand canyon 8', value: 'id1' },
                { label: 'Specialized', value: 'id2' },
                { label: 'Qayron carma enduro full', value: 'id3' },
            ]}
              style={pickerStyle}
            />
              )}
              name="bike"
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
                label='Distance (km)'
                keyboardType='numeric'
              />
            )}
            name="distance"
            defaultValue=""
          />
          {errors.distance?.type == 'required' && <Text style={{ color: "white" }}>Distance is required</Text>}

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
                label='Ride time (hours)'
                keyboardType='numeric'
              />
            )}
            name="ridetime"
            defaultValue=""
          />
          {errors.ridetime?.type == 'required' && <Text style={{ color: "white" }}>Ride time is required</Text>}

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
                label='Elevation gain (m)'
                keyboardType='numeric'
              />
            )}
            name="elevgain"
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
                label='Average speed (km/h)'
              />
            )}
            name="avgspeed"
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