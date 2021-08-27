import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {SET_USERS} from './action.type';
import Snackbar from 'react-native-snackbar';
import {errorColor} from '../options';

const isFollowed = userId => {
  const auth_user_id = auth().currentUser.uid;

  return new Promise((resolve, reject) => {
    firestore()
      .collection('followers')
      .where('user_id', '==', auth_user_id)
      .where('target_id', '==', userId)
      .where('status', '==', 'APPROVED')
      .get()
      .then(querySnapshot => {
        let isFl = querySnapshot.size > 0 ? true : false;
        resolve(isFl);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getUsers = data => async dispatch => {
  const auth_user_id = auth().currentUser.uid;
  try {
    firestore()
      .collection('users')
      .where('uid', '!=', auth_user_id)
      .get()
      .then(async querySnapshot => {
        let users = await Promise.all(
          querySnapshot.docs.map(async doc => {
            var userdata = doc.data();

            const isFoll = await isFollowed(userdata.uid);
            userdata.isFollowed = isFoll;

            return userdata;
          }),
        );
        dispatch({
          type: SET_USERS,
          payload: users,
        });
      });
  } catch (error) {
    Snackbar.show({
      text: 'Something went wrong, Try again !!',
      backgroundColor: errorColor,
      textColor: '#fff',
    });
  }
};
