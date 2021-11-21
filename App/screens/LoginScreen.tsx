import * as React from 'react';
import { Text, View, TextInput, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form'
import { Headline } from 'react-native-paper';
import AuthenticatedContext from '../../context';
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
export default function LoginScreen({ navigation }) {
  const { IsLoggedIn, setIsLoggedIn, User, setUser } = React.useContext(AuthenticatedContext)
  const { control, setError, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data =>{
    if(data.username == "test" && data.password == "test"){
      setIsLoggedIn(true)
      setUser({"username": "testname"})
    }
    else{
        setError('password', { type: "authentication", message: "Wrong username or password", });
     
    }
  }

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F44336'
    }}>
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{
      alignItems: 'center',
    }}>
      <StatusBar
        backgroundColor="#F44336"
      />
     
      <Text style={styles.formHeader}>Bike Components Manager</Text>
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
            placeholder='Username or email'
            placeholderTextColor={'#F44336'}
          />
        )}
        name="username"
        defaultValue=""
      />
      {errors.username?.type=='required' && <Text style={{ color: "white" }}>Username or email is required.</Text>}
      

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
      {errors.password?.type=='required' && <Text style={{ color: "white" }}>Password is required</Text>}
      <Text style={{ color: "white" }}>{errors.password?.type=='authentication' &&  errors.password.message}</Text>
      <TouchableOpacity style={styles.submit} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submit_text}>SIGN IN</Text>
      </TouchableOpacity>


      <Text onPress={() => navigation.navigate('Register')} style={{ color: "white", alignSelf:"center" }}>Don't have account? <Text style={{ fontWeight: 'bold' }}>Sign Up! </Text></Text>
      <Text style={{ color: "white", fontWeight: "bold", padding: 15, fontSize: 17 }}>Or</Text>
      <Image source={require('../assets/images/btn_strava_connectwith_light.png')} />
       </ScrollView >
    </View>

  );
}
