import React, {useState, useEffect} from 'react';
import {StyleSheet, Image} from 'react-native';

import {Container, Content, Form, Item, Input, Button, Text} from 'native-base';

import FAIcon from 'react-native-vector-icons/FontAwesome';

import * as Progress from 'react-native-progress';

import {launchImageLibrary} from 'react-native-image-picker';

import shortid from 'shortid';

import {useIsFocused} from '@react-navigation/native';

//
import {showSnackbar} from '../utils/HelperFunctions';

//layouts
import CommonHeader from '../layouts/CommonHeader';

//DB
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

//redux
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {setUploadImage} from '../action/post';

const AddPost = ({authState, setUploadImage, postState, navigation, route}) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(0);
  const [imageToUpload, setImageToUpload] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (postState.uploadPostImage) {
      setImage(postState.uploadPostImage);
    }
  }, [isFocused]);

  const chooseImage = async () => {
    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
        },
        res => {
          if (res.didCancel === true || res.errorMessage || res.errorCode) {
            return false;
          } else {
            setImage(res.uri);
          }
        },
      );
    } catch (error) {
      //console.log(error);
    }
  };

  const uploadImage = async image => {
    setUploading(true);
    return new Promise((resolve, reject) => {
      try {
        const ref = storage().ref(`/uploads/${shortid.generate()}`);

        const task = ref.putFile(image);

        task.on('state_changed', taskSnapshot => {
          let percent =
            (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;

          setUploadStatus(percent);
        });

        task.then(async () => {
          const url = await ref.getDownloadURL();
          setUploading(false);
          setImageToUpload(url);
          resolve(url);
        });
      } catch (error) {
        showSnackbar('danger', 'Something Went Wrong, Try later');
        setUploading(false);
        setImageToUpload(null);
        reject('Image Upload Failed');
      }
    });
  };

  const uploadPost = async () => {
    if (!image) {
      return showSnackbar('danger', 'Choose Image Please');
    }

    try {
      /* IMage */

      await uploadImage(image)
        .then(imgUri => {
          const uid = shortid.generate();

          firestore()
            .collection(`posts`)
            .doc(uid)
            .set({
              uid,
              caption,
              image: imgUri,
              date: new Date(),
              user_id: authState.user.uid,
              post_by: authState.user.name,
            })
            .then(() => {
              setCaption('');
              setImage(null);
              setImageToUpload(null);
              setUploadStatus(0);
              console.log('Upload post done');
            });

          setUploadImage({uri: null});

          navigation.jumpTo('Home');
        })
        .catch(err => {
          //console.log(err);

          showSnackbar('danger', 'Something Went Wrong');
        });

      /* IMage */
    } catch (error) {
      //console.log(error);
      showSnackbar('danger', 'Something Went Wrong');
    }
  };

  return (
    <Container style={styles.container}>
      <CommonHeader title="Upload Post" />
      <Content padder>
        {image && (
          <Image
            source={{uri: image}}
            height={200}
            style={{height: 200, paddingBottom: 20, marginBottom: 25}}
          />
        )}

        {uploading && (
          <Progress.Bar
            progress={uploadStatus}
            width={200}
            style={{alignSelf: 'center', marginVertical: 10}}
          />
        )}

        <Button
          iconLeft
          rounded
          block
          transparent
          bordered
          style={styles.btn}
          onPress={() =>
            navigation.navigate('CameraScreen', {
              returnScreen: 'HomeNavigator',
            })
          }>
          <FAIcon name="camera" size={20} />
          <Text>Click Photo</Text>
        </Button>
        <Button
          iconLeft
          rounded
          block
          transparent
          bordered
          style={styles.btn}
          onPress={chooseImage}>
          <FAIcon name="image" size={20} />
          <Text>Choose from gallery</Text>
        </Button>
        <Form>
          <Item block rounded style={styles.input}>
            <Input
              placeholder="Enter Caption"
              value={caption}
              onChangeText={text => setCaption(text)}
            />
          </Item>
        </Form>
        <Button
          block
          rounded
          onPress={uploadPost}
          isDisabled={uploading}
          style={styles.btn}>
          {uploading ? <Text>Uploading...</Text> : <Text>Upload Post</Text>}
        </Button>
      </Content>
    </Container>
  );
};

//redux
AddPost.prototype = {
  authState: propTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authState: state.auth,
  postState: state.post,
});

const mapDispatchToProps = {
  setUploadImage: data => setUploadImage(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);

const styles = StyleSheet.create({
  btn: {
    marginBottom: 15,
  },
  input: {
    marginVertical: 15,
  },
  container: {
    flex: 1,
    paddingBottom: 30,
  },
});
