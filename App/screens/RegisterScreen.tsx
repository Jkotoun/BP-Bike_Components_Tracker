import * as React from 'react';
import {Text, View, TextInput, StatusBar, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { useForm, Controller } from 'react-hook-form'
import { Headline } from 'react-native-paper';
const styles = StyleSheet.create({
  input: {
    elevation: 5,
    borderRadius: 2,
    color: "black",
    backgroundColor: "#ffffff",
    width: 300,
    margin: 7,
    paddingHorizontal: 7,
    paddingVertical: 10
  },
  submit_text: {
    color: "#F44336",
    textAlign: 'center',
    fontWeight: "bold"
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
    textAlign:'left'
  }
});
export default function RegisterScreen({ navigation }) {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);


  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F44336'
    }}>
      <StatusBar
        backgroundColor="#F44336"
      />
      <Headline style={styles.formHeader}>Bike Components Manager</Headline>
      
      
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            selectionColor={'black'}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Username'
            placeholderTextColor={'#F44336'}
          />
        )}
        name="Username"
        defaultValue=""
      />
      {errors.username && <Text style={{ color: "white" }}>Username is required.</Text>}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            selectionColor={'black'}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Email'
            placeholderTextColor={'#F44336'}
          />
        )}
        name="Email"
        defaultValue=""
      />
      {errors.username && <Text style={{ color: "white" }}>Email is required.</Text>}


      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            selectionColor={'black'}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Country'
            placeholderTextColor={'#F44336'}
          />
        )}
        name="Country"
        defaultValue=""
      />
      {errors.Country && <Text style={{ color: "white" }}>Country is required.</Text>}


      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            selectionColor={'black'}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Gender'
            placeholderTextColor={'#F44336'}
          />
        )}
        name="Gender"
        defaultValue=""
      />
      {errors.Gender && <Text style={{ color: "white" }}>Gender is required.</Text>}


      <Controller
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            selectionColor={'black'}
            secureTextEntry={true}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Password'
            placeholderTextColor={'#F44336'}
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && <Text style={{ color: "white" }}>Password is required</Text>}



      <Controller
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            selectionColor={'black'}
            secureTextEntry={true}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Password again'
            placeholderTextColor={'#F44336'}
          />
        )}
        name="password_repeat"
        defaultValue=""
      />
      {errors.password && <Text style={{ color: "white" }}>Password again is required</Text>}





      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submit_text}>SIGN UP</Text>
      </TouchableOpacity>
    </View>

  );
}
