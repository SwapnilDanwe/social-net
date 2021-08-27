import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {Text, H1} from 'native-base';

import {showSnackbar} from '../utils/HelperFunctions';

import {warningColor} from '../options';

//redux
import propTypes from 'prop-types';
import {signUp} from '../action/auth';
import {connect} from 'react-redux';

const SignUp = ({navigation, signUp}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const _validate = () => {
    if (!name) {
      showSnackbar('danger', 'Please Enter Name !');
      return false;
    }

    if (!username) {
      showSnackbar('danger', 'Please Enter Username !');
      return false;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (!email || reg.test(email) === false) {
      showSnackbar('danger', 'Provide valid email !');
      return false;
    }

    if (!password || !confirmPassword) {
      showSnackbar('danger', 'Password is required !');
      return false;
    }

    if (password && password !== confirmPassword) {
      showSnackbar('danger', 'Confirm password do not match !');
      return false;
    }

    return true;
  };

  const doSignUp = () => {
    if (!_validate()) return;

    signUp({
      name,
      email,
      password,
      username,
      phone,
    });
  };

  return (
    <>
      <StatusBar backgroundColor={styles.container.backgroundColor} />
      <ScrollView contentContainerStyle={styles.container}>
        <H1 style={{color: '#EEE', marginBottom: 50, fontWeight: '900'}}>
          Create An Account
        </H1>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            value={name}
            placeholder="Enter Full Name"
            placeholderTextColor="#003f5c"
            onChangeText={text => setName(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            value={phone}
            placeholder="Enter Phone No."
            placeholderTextColor="#003f5c"
            onChangeText={text => setPhone(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            value={username}
            placeholder="Enter Username"
            placeholderTextColor="#003f5c"
            onChangeText={text => setUsername(text)}
          />
        </View>
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
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            value={confirmPassword}
            style={styles.inputText}
            placeholder="Confirm Password"
            placeholderTextColor="#003f5c"
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.signupBtn} onPress={doSignUp}>
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginText}>Already have an account, Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

//redux
SignUp.prototype = {
  signUp: propTypes.func.isRequired,
};

const mapDispatchToProps = {
  signUp: data => signUp(data),
};

export default connect(null, mapDispatchToProps)(SignUp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B98F5',
    alignItems: 'center',
    justifyContent: 'center',
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
  signupBtn: {
    width: '80%',
    backgroundColor: warningColor,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
});
