import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Button,
    Alert,
  } from 'react-native';
  import React, {useContext, useState} from 'react';
  import {AuthContext} from '../context/AuthContext';
  import * as Keychain from 'react-native-keychain';
  import {AxiosContext} from '../context/AxiosContext';
// import SignUp from './SignUp';
import Dashboard from './Dashboard';
  
  const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
  
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext);
    const {publicAxios} = useContext(AxiosContext);

    const onLogin = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        }
        
        console.log({email})
        console.log({password})
        console.log('public axios',JSON.stringify(publicAxios))
        if(!email || !password ){
          return Alert.alert('User Name or passoword Cannot be empty!!')
        }
        const response = await publicAxios.post('login', {
          email,
          password,
        },headers);
        const {accessToken, refreshToken} = response.data.data;
        authContext.setAuthState({
          accessToken,
          refreshToken,
          authenticated: true,
        });
  
        await Keychain.setGenericPassword(
          'token',
          JSON.stringify({
            accessToken,
            refreshToken,
          }),
        );
      } catch (error) {
        console.log(error);
        console.log('Error Response',error.response)
        console.log('Error Response Data',error.response)
        Alert.alert('Login Failed', error.response.data.message);
        // throw error;
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.logo}>Hostella</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fefefe"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={text => setEmail(text)}
            value={email}
          />
  
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#fefefe"
            secureTextEntry
            onChangeText={text => setPassword(text)}
            value={password}
          />
        </View>
        <Button title="Login" style={styles.button} onPress={() => onLogin()} />
        <Button title="Sign Up" style={styles.button} onPress={() => navigation.navigate('SignUp')} />
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
    },
    logo: {
      fontSize: 60,
      color: '#fff',
      margin: '20%',
    },
    form: {
      width: '80%',
      margin: '10%',
    },
    input: {
      fontSize: 20,
      color: '#fff',
      paddingBottom: 10,
      borderBottomColor: '#fff',
      borderBottomWidth: 1,
      marginVertical: 20,
    },
    button: {},
  });
  
  export default Login;