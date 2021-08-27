import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import {Button} from 'native-base';

import Axios from 'axios';

import {RNCamera} from 'react-native-camera';

import {useIsFocused} from '@react-navigation/native';

//Import components
import PostTile from '../components/PostTile';
import Loader from '../components/Loader';

//Icons
import Icon from 'react-native-vector-icons/Feather';

//Redux
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {getPosts} from '../action/post';

const Home = ({auth, postState, getPosts}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cameraImage, setCameraImage] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);

  const isFocused = useIsFocused();

  const takePicture = async camera => {
    const data = await camera.takePictureAsync({
      quality: 0.8,
      base64: false,
    });

    setCameraImage(data.uri);
  };

  const PendingView = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Loading...</Text>
    </View>
  );

  const CameraScreen = () => {
    if (cameraImage) {
      return (
        <View style={styles.container}>
          <Image
            source={{uri: cameraImage}}
            width="300"
            style={{width: 500, height: '100%'}}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              alignSelf: 'flex-end',
              position: 'absolute',
              width: '100%',
              height: '100%',
              marginTop: 700,
            }}>
            <Button
              rounded
              onPress={() => setCameraImage(null)}
              style={{marginHorizontal: 5}}>
              <Text style={{color: '#fff', paddingHorizontal: 20}}>
                Click Again
              </Text>
            </Button>
            <Button
              style={{marginHorizontal: 5}}
              rounded
              onPress={() => {
                setCameraImage(null);
                setOpenCamera(false);
              }}>
              <Text style={{color: '#fff', paddingHorizontal: 20}}>Cancel</Text>
            </Button>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <RNCamera
          style={{flex: 1}}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          useNativeZoom={true}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status}) => {
            if (status !== 'READY') return <PendingView />;

            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => takePicture(camera)}
                  style={styles.capture}>
                  <Text style={{fontSize: 14}}> Click </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setOpenCamera(false)}
                  style={styles.capture}>
                  <Text style={{fontSize: 14}}> Cancel </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  };

  useEffect(() => {
    const subs = getPosts();
    Axios.get('https://randomuser.me/api/?results=10')
      .then(({data}) => setUsers(data.results), setLoading(false))
      .catch(err => {
        setLoading(false);
      });

    return subs;
  }, [isFocused]);

  if (loading || postState.isLoading) {
    return <Loader />;
  }

  if (openCamera) {
    return <CameraScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Header */}
        <View style={{paddingHorizontal: 10}}>
          <View
            style={{
              height: 40,
              backgroundColor: '#f1f3f6',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 8,
            }}>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                paddingHorizontal: 10,
              }}
              placeholder="Search"
            />
            <TouchableOpacity style={{paddingRight: 10}}>
              <Icon name="search" size={22} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Stories View */}
        <View style={{marginTop: 10}}>
          <Text
            style={{
              fontSize: 30,
              paddingHorizontal: 10,
            }}>
            Stories
          </Text>
          <View style={{marginTop: 10, paddingLeft: 10}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={{
                  paddingRight: 6,
                }}
                onPress={() => setOpenCamera(true)}>
                <Image
                  source={{
                    uri: 'https://randomuser.me/api/portraits/men/86.jpg',
                  }}
                  style={{width: 60, height: 60, borderRadius: 100}}
                />
                <Icon
                  name="plus-circle"
                  color="#000"
                  size={20}
                  style={{position: 'absolute', right: 5, bottom: -2}}
                />
              </TouchableOpacity>
              {users.map((user, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    marginLeft: index === 0 ? 10 : 0,
                    marginRight: 10,
                  }}>
                  <Image
                    source={{uri: user?.picture?.medium}}
                    style={{width: 60, height: 60, borderRadius: 100}}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        {/* Story End */}

        {
          /* Posts */
          postState.posts.length > 0 ? (
            <View style={{paddingHorizontal: 10}}>
              {postState.posts.map((post, index) => (
                <PostTile post={post} index={index} key={index} />
              ))}
            </View>
          ) : (
            <>
              <View style={{paddingHorizontal: 10}}>
                <Text>No Posts</Text>
              </View>
            </>
          )
        }
        {/* Posts ENd */}
      </ScrollView>
    </View>
  );
};

//redux
Home.prototype = {
  postState: propTypes.object.isRequired,
  getPosts: propTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  postState: state.post,
});

const mapDispatchToProps = {
  getPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    paddingTop: 5,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
