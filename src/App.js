import React, {useEffect, useState, createRef} from 'react';

//navigation
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//screens
import Home from './screens/Home';
import AddPost from './screens/AddPost';
import Profile from './screens/Profile';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Chats from './screens/Chats';
import HomeNavigator from './screens/HomeNavigator';
import ChatScreen from './screens/ChatScreen';
import UserProfile from './screens/UserProfile';
import CameraScreen from './screens/CameraScreen';
import Loader from './components/Loader';
//import UserListItem from './components/UserListItem';

//redux
import {connect, useDispatch} from 'react-redux';
import propTypes from 'prop-types';
import {SET_USER, IS_AUTHENTICATED} from './action/action.type';

//db
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator();

const App = ({user_}) => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        firestore()
          .collection('users')
          .doc(user.uid)
          .onSnapshot(documentSnapshot => {
            dispatch({
              type: SET_USER,
              payload: documentSnapshot.data(),
            });
            setLoading(false);
          });
      } else {
        dispatch({
          type: IS_AUTHENTICATED,
          payload: false,
        });
        setLoading(false);
      }
    });

    return subscriber;
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {user_.isLoggedIn ? (
          <>
            <Stack.Screen name="HomeNavigator" component={HomeNavigator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddPost" component={AddPost} />
            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen
              name="UserProfile"
              component={UserProfile}
              options={({route}) => ({title: route.params.name})}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//redux
App.prototype = {
  user_: propTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user_: state.auth,
});

export default connect(mapStateToProps)(App);
