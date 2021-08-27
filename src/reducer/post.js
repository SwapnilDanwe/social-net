import {SET_POSTS, SET_POST_IMAGE} from '../action/action.type';

const initialState = {
  posts: [],
  isLoading: true,
  uploadPostImage: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS:
      return {
        posts: action.payload,
        isLoading: false,
      };
    case SET_POST_IMAGE:
      return {
        ...state,
        uploadPostImage: action.payload,
      };
    default:
      return state;
  }
};
