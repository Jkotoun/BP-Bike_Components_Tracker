import * as React from 'react';
import { Platform, Text, View, StatusBar, StyleSheet, ScrollView, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import { getFirestore, addDoc, collection, doc, query, where, getDocs, orderBy, deleteField, increment } from 'firebase/firestore';
import firebaseApp from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { AuthenticatedUserContext } from '../../context'
import { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from "@react-navigation/native";
import {addRide} from '../modules/firestoreActions'
export default function AddRideScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [rideDate, setRideDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const datePickerHandler = (selectedDate) => {
    const currentDate = selectedDate || rideDate;
    setShowDatePicker(Platform.OS === 'ios');
    setRideDate(currentDate);
  };


  const [rideTime, setRideTime] = useState(new Date(0,0,0,0,0,0));
  const [showRideTimePicker, setShowRideTimePicker] = useState(false);

  const timePickerHandler = (selectedTime) => {
    const currentTime = selectedTime || rideTime;
    setShowRideTimePicker(Platform.OS === 'ios');
    setRideTime(currentTime);
  };


  const auth = getAuth(firebaseApp)
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedUserContext);
  const [bikes, setBikes] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
      let bikesArray = []
      getDocs(query(collection(getFirestore(firebaseApp), "bikes"), where("user", "==", doc(getFirestore(firebaseApp), "users", User.uid)), where("state","==", "active"))).then(bikesDocRef => {
        bikesDocRef.forEach(bike => {
          bikesArray.push({
            label: bike.data().name,
            value: bike.id
          })
        })
        setBikes(bikesArray)

      }).then(() => {
        setIsLoaded(true)
      })
  }, [isFocused]);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const { control, setError, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'all' });


  const onSubmit = data => {
    data.distance = Number(data.distance)
    data.user = doc(getFirestore(firebaseApp), "users", auth.currentUser.uid)
    data.bike = doc(getFirestore(firebaseApp), "bikes", data.bike)
    data.date = rideDate
    if(rideDate > new Date())
    {
      throw new Error("Date of ride cant be in future")
    }
    data.rideTime = rideTime.getHours()*60*60 + rideTime.getMinutes()*60
    addRide(data).then(() => {
      navigation.navigate("RidesListScreen", { forceReload: true })
    })
  }

  if (!isLoaded) {
    return (
      <View style={styles.loadContainer}>
          <ActivityIndicator size="large" color="#F44336"/>
      </View>
    )
  }
  else {
    return (
      <View style={styles.mainContainer}>
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
                required: {
                  value: true,
                  message: "Ride name is required"
                }
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
                  label='Ride name'
                />
              )}
              name="name"
              defaultValue=""
            />
            {errors.name && <Text style={styles.errorMessage}>{errors.name.message}</Text>}
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Bike is required"
                }
              }}
              render={({ field: { onChange, value } }) => (

                <RNPickerSelect
                  onValueChange={onChange}
                  value={value}
                  placeholder={{ label: 'Select bike' }}
                  items={bikes}
                  style={pickerStyle}
                />
              )}
              name="bike"
              defaultValue=""
            />
            {errors.bike && <Text style={styles.errorMessage}>{errors.bike.message}</Text>}

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Distance is required"
                },
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Distance must be positive number"
                }
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
            {errors.distance && <Text style={styles.errorMessage}>{errors.distance.message}</Text>}



            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={rideDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, value) => {
                  datePickerHandler(value)
                }}
              />
            )}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                editable={false}
                pointerEvents="none"
                value={rideDate.toDateString()}
                label='Ride date'
              />
            </TouchableOpacity>





            

            {showRideTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={rideTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, value) => {
                  timePickerHandler(value)
                }}
              />
            )}
            <TouchableOpacity onPress={() => setShowRideTimePicker(true)}>
              <TextInput
                theme={{ colors: { primary: '#F44336' } }}
                underlineColor="transparent"
                mode='flat'
                style={styles.input}
                editable={false}
                pointerEvents="none"
                value={rideTime.getHours() + ":" + rideTime.getMinutes()}
                label='Total ride time'
              />
            </TouchableOpacity>


            <View style={{ padding: 20, width: "100%" }}>
              <Button color={"#F44336"} title="Submit" disabled={!isValid} onPress={handleSubmit(onSubmit)} />
            </View>
          </ScrollView >
        </View>
      </View>

    );
  }
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
  mainContainer: {
    flex: 1,
    alignItems: 'center',
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
  },
  errorMessage: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    color: 'red'
  },
  loadContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
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
    padding: 30,
  },
  inputAndroid: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 335,
    margin: 7,
    padding: 30,

  },
  placeholder: {
    color: "grey"
  }
};