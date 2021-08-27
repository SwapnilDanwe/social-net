import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {showSnackbar} from '../utils/HelperFunctions';

export const signIn = data => dispatch => {
  const {email, password} = data;

  try {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(data => {
        showSnackbar('success', 'Signed In');
      })
      .catch(err => {
        showSnackbar('danger', 'Invalid credentials !');
      });
  } catch (error) {
    showSnackbar('danger', 'Something wrong !');
  }
};

export const signUp = data => dispatch => {
  const {name, username, email, password, phone} = data;

  try {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        firestore().collection('users').doc(data.user.uid).set({
          uid: data.user.uid,
          name,
          username,
          email,
          phone,
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          showSnackbar('danger', 'Email already in use !');
        } else if (error.code === 'auth/invalid-email') {
          showSnackbar('danger', 'Email address is invalid !');
        } else {
          showSnackbar('danger', 'Somthing Wrong, Try again !');
        }
      });
  } catch (error) {
    showSnackbar('danger', 'Somthing Wrong, Try again !');
  }
};

export const signOut = () => dispatch => {
  try {
    auth()
      .signOut()
      .then(() => {});
  } catch (error) {
    showSnackbar('danger', 'Something Wrong');
  }
};
