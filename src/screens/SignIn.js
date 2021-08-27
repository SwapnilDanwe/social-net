import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {Container, Text} from 'native-base';

import {showSnackbar} from '../utils/HelperFunctions';

//redux
import propTypes from 'prop-types';
import {signIn} from '../action/auth';
import {connect} from 'react-redux';

const SignIn = ({signIn, navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doSignIn = () => {
    if (!email || !password) {
      return showSnackbar('danger', 'All Feilds Required');
    }

    signIn({email: email.trim(), password});
  };

  return (
    <Container style={styles.container}>
      <Image style={styles.logo} source={require('../assets/img/logo.png')} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          value={email}
          placeholder="Enter Email"
          placeholderTextColor="#003f5c"
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          value={password}
          style={styles.inputText}
          placeholder="Enter Password"
          placeholderTextColor="#003f5c"
          onChangeText={text => setPassword(text)}
        />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={doSignIn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.loginText}>Create an account</Text>
      </TouchableOpacity>
    </Container>
  );
};

SignIn.prototype = {
  signIn: propTypes.func.isRequired,
};

const mapDispatchToProps = {
  signIn: data => signIn(data),
};

export default connect(null, mapDispatchToProps)(SignIn);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B98F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#CAD5E2',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#000',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#1FAA59',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
});
