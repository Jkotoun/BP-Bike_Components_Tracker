import * as React from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, Picker } from 'react-native';
import { TextInput } from "react-native-paper"
import { useForm, Controller } from 'react-hook-form'
import AuthenticatedContext from '../../context';


//TODO vytahnout do stylu jako form styles
const styles = StyleSheet.create({
  input: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 300,
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




export default function AddBikeScreen({ navigation }) {
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
      <View style={{ paddingVertical: 25 }}>
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
                label='Bike name'
              />
            )}
            name="bikename"
            defaultValue=""
          />
          {errors.bikename?.type == 'required' && <Text style={{ color: "white" }}>Bike name is required</Text>}

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
                label='Brand'
              />
            )}
            name="brand"
            defaultValue=""
          />
          {errors.brand?.type == 'required' && <Text style={{ color: "white" }}>Brand is required</Text>}

          {/* <Text style={{ color: "white" }}>{errors.password?.type=='authentication' &&  errors.password.message}</Text> */}


          {/* <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submit_text}>Odeslat</Text>
      </TouchableOpacity> */}

        </ScrollView >
      </View>
    </View>

  );
}
