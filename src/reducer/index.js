import {combineReducers} from 'redux';
import auth from './auth';
import post from './post';
import user from './user';
import profile from './profile';

export default combineReducers({
  auth,
  post,
  user,
  profile,
});
