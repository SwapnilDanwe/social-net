import {SET_USER, IS_AUTHENTICATED} from '../action/action.type';

const initialState = {
  user: null,
  isLoggedIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.payload,
        isLoggedIn: true,
      };
    case IS_AUTHENTICATED:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    default:
      return state;
  }
};
