import firestore from '@react-native-firebase/firestore';
import {SET_POSTS, SET_POST_IMAGE} from './action.type';
import {showSnackbar} from '../utils/HelperFunctions';

export const getPosts = () => dispatch => {
  try {
    firestore()
      .collection('posts')
      .orderBy('date', 'desc')
      .onSnapshot(QuerySnapshot => {
        //console.log('Total posts: ', querySnapshot.size);
        /* querySnapshot.forEach(documentSnapshot => {
            documentSnapshot.id,
            documentSnapshot.data(),
          );
        }); */

        if (QuerySnapshot.size > 0) {
          const allPosts = QuerySnapshot.docs.map(snapshot => snapshot.data());

          dispatch({
            type: SET_POSTS,
            payload: allPosts,
          });
        } else {
          dispatch({
            type: SET_POSTS,
            payload: [],
          });
        }
      });
  } catch (error) {
    dispatch({
      type: SET_POSTS,
      payload: [],
    });
    showSnackbar('danger', 'Unable to fetch posts');
  }
};

export const setUploadImage = data => dispatch => {
  dispatch({
    type: SET_POST_IMAGE,
    payload: data.uri,
  });
};
