import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {Button, Text} from 'native-base';

import {RNCamera} from 'react-native-camera';

import Loader from '../components/Loader';

//redux
import {connect} from 'react-redux';
import {setUploadImage} from '../action/post';

const CameraScreen = ({navigation, route, setUploadImage}) => {
  const [cameraImage, setCameraImage] = useState(null);

  const takePicture = async camera => {
    const data = await camera.takePictureAsync({
      quality: 0.8,
      base64: false,
    });

    setCameraImage(data.uri);
  };

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
            onPress={() => {
              setUploadImage({uri: cameraImage});
              navigation.navigate(route.params.returnScreen);
            }}
            style={{marginHorizontal: 5}}>
            <Text>Select</Text>
          </Button>
          <Button
            rounded
            bordered
            onPress={() => setCameraImage(null)}
            style={{marginHorizontal: 5}}>
            <Text>Cancel</Text>
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
        flashMode={RNCamera.Constants.FlashMode.off}
        useNativeZoom={true}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({camera, status}) => {
          if (status !== 'READY') return <Loader />;

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
                onPress={() => navigation.navigate(route.params.returnScreen)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    paddingTop: 0,
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

//redux
const mapDispatchToProps = {
  setUploadImage: data => setUploadImage(data),
};

export default connect(null, mapDispatchToProps)(CameraScreen);
