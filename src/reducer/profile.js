import {
  SET_PROFILE_POST_DATA,
  SET_FOLLOWINGS_COUNT,
  SET_FOLLOWERS_COUNT,
  SET_USER_META,
  SET_LOADING,
} from '../action/action.type';

const initialState = {
  postCount: 0,
  followerCount: 0,
  followingCount: 0,
  userPosts: [],
  displayProfile: null,
  bio: '',
  name: '',
  username: '',
  email: '',
  isLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE_POST_DATA:
      return {
        ...state,
        postCount: action.payload.postCount,
        userPosts: action.payload.userPosts,
      };
    case SET_FOLLOWINGS_COUNT:
      return {
        ...state,
        followingCount: action.payload,
      };
    case SET_FOLLOWERS_COUNT:
      return {
        ...state,
        followerCount: action.payload,
      };
    case SET_USER_META:
      return {
        ...state,
        displayProfile: action.payload.displayProfile,
        bio: action.payload.bio,
        name: action.payload.name,
        username: action.payload.username,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};
