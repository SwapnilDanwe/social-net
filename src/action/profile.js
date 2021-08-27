import firestore from '@react-native-firebase/firestore';
import {
  SET_PROFILE_POST_DATA,
  SET_FOLLOWERS_COUNT,
  SET_FOLLOWINGS_COUNT,
  SET_USER_META,
  SET_LOADING,
} from './action.type';

const getPosts = userId => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('posts')
      .where('user_id', '==', userId)
      .orderBy('date', 'desc')
      .get()
      .then(querySnapshot => {
        const postCount = querySnapshot.size;
        const userPosts = querySnapshot.docs.map(documentSnapshot => {
          return {
            id: documentSnapshot.id,
            image: documentSnapshot.data().image,
          };
        });

        resolve({
          postCount,
          userPosts,
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getFollowings = userId => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('followers')
      .where('user_id', '==', userId)
      .where('status', '==', 'APPROVED')
      .get()
      .then(querySnapshot => {
        resolve(querySnapshot.size);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getFollowersCount = userId => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('followers')
      .where('target_id', '==', userId)
      .where('status', '==', 'APPROVED')
      .get()
      .then(querySnapshot => {
        resolve(querySnapshot.size);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getUserMeta = userId => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .where('uid', '==', userId)
      .limit(1)
      .get()
      .then(querySnapshot => {
        const userData = querySnapshot.docs.map(documentSnapshot =>
          documentSnapshot.data(),
        );

        resolve(userData[0]);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getProfileData = data => async dispatch => {
  const authId = data.userId;
  dispatch({
    type: SET_LOADING,
    payload: true,
  });

  try {
    /* Post DATA */
    const allPosts = await getPosts(authId);
    dispatch({
      type: SET_PROFILE_POST_DATA,
      payload: allPosts,
    });

    /* Following Data */
    const followings = await getFollowings(authId);
    dispatch({
      type: SET_FOLLOWINGS_COUNT,
      payload: followings,
    });

    /* Follower Query */
    const followersCount = await getFollowersCount(authId);
    dispatch({
      type: SET_FOLLOWERS_COUNT,
      payload: followersCount,
    });

    /* USER META OTHER - SET_USER_META*/
    const usermeta = await getUserMeta(authId);
    dispatch({
      type: SET_USER_META,
      payload: {
        name: usermeta?.name,
        username: usermeta?.username,
        bio: usermeta?.bio,
        displayProfile: usermeta?.displayProfile,
      },
    });

    dispatch({
      type: SET_LOADING,
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: SET_LOADING,
      payload: false,
    });
  }
};
