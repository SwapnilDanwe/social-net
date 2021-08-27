import {SET_USERS} from '../action/action.type';

const initialState = {
  users: [],
  users_count: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
      };

    default:
      return state;
  }
};
