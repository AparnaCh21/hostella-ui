import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  StyleSheet,
  Switch,
  Button,
  Text,
  Alert,
} from 'react-native';
import {AxiosContext} from '../context/AxiosContext';

const SignUp = ({navigation}) => {
  // console.log('In sign up')
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const {publicAxios} = useContext(AxiosContext);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const onSignUp = async () => {
    console.log('In Sign up');
    // try{
    const headers = {
      'Content-Type': 'application/json',
    };
    const result = await publicAxios
      .post(
        'registerUser',
        {
          email,
          firstName,
          lastName,
          phoneNumber,
          password,
          roleId: 'OWNER',
          countryCode: '+91',
        },
        headers,
      )
      .then(result => {
        console.log('In success');
        console.log('response', result.data);
        if (result.data.code === '205') {
          Alert.alert('Already Exists!', 'Mobile number already exists!');
          return
        }
        Alert.alert('Success', 'User Created successfully');
        navigation.navigate('Login')
        return;
      })
      .catch(err => {
        console.log('In Error!');
        console.log('Error : ', err);

        Alert.alert('Failure', err);
        return;
      });
  };

  return (
    // <View style={styles.container}>
    //     <TextInput placeholder='FirstName'/>
    // </View>
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.text}>Sign Up</Text>  */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#fefefe"
          onChangeText={text => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#fefefe"
          onChangeText={text => setLastName(text)}
          value={lastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#fefefe"
          onChangeText={text => setPhoneNumber(text)}
          value={phoneNumber}
        />
        {/* <Switch
        placeholder = 'Role'
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      /> */}
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor="#fefefe"
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fefefe"
          onChangeText={text => setPassword(text)}
          value={password}
        />
      </View>
      <Button
        title="Sign Up"
        style={styles.button}
        onPress={() => onSignUp()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: '#fff',
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
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
});

export default SignUp;
