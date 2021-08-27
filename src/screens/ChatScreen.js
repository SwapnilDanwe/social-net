import React, {useState, useEffect} from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Button,
  Title,
  Icon,
  Thumbnail,
  Spinner,
} from 'native-base';

import FAIcon from 'react-native-vector-icons/FontAwesome';

import {GiftedChat, Actions, Send} from 'react-native-gifted-chat';

import {useIsFocused} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

import {showSnackbar} from '../utils/HelperFunctions';
import {launchImageLibrary} from 'react-native-image-picker';

import storage from '@react-native-firebase/storage';

import shortid from 'shortid';

//redux
import propTypes from 'prop-types';
import {connect} from 'react-redux';

const ChatScreen = ({authUser, navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const [attachedImage, setAttachedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const isFocused = useIsFocused();

  const getDocId = () => {
    return route.params.uid < authUser.uid
      ? route.params.uid + '-' + authUser.uid
      : authUser.uid + '-' + route.params.uid;
  };

  const getMessages = async () => {
    try {
      firestore()
        .collection(`chats`)
        .doc(getDocId())
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          QuerySnapshot => {
            //console.log(QuerySnapshot.size);
            if (QuerySnapshot.size > 0) {
              const allMesg = QuerySnapshot.docs.map(message => ({
                ...message.data(),
                createdAt: message.data().createdAt.toDate(),
              }));

              setMessages(allMesg);
            }
          },
          err => {
            showSnackbar('danger', 'Something went wrong !');
          },
        );
    } catch (error) {
      showSnackbar('danger', 'Something went wrong !');
    }
  };

  const uploadImage = async () => {
    return new Promise((resolve, reject) => {
      try {
        const ref = storage().ref(`/chats/${getDocId()}/${shortid.generate()}`);

        const task = ref.putFile(attachedImage);

        task.on('state_changed', taskSnapshot => {
          let percent =
            (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;

          setUploadStatus(percent);
        });

        task.then(async () => {
          const url = await ref.getDownloadURL();
          resolve(url);
        });
      } catch (error) {
        showSnackbar('danger', 'Something Went Wrong, Try later');
        console.log('Err', error);
        reject('Image Upload Failed');
      }
    });
  };

  const sendMsg = async (msg, onSend) => {
    if (!msg && !attachedImage) return false;

    onSend({text: ''}, true);

    try {
      var imguri = null;
      if (attachedImage) {
        setIsSending(true);
        var imguri = await uploadImage();
      }

      const query = firestore().collection('chats').doc(getDocId());

      if (!msg && attachedImage) {
        query
          .collection('messages')
          .add({
            _id: shortid.generate(),
            text: '',
            image: imguri,
            createdAt: new Date(),
            user: {
              _id: authUser.uid,
            },
          })
          .then(() => {
            setAttachedImage(null);
            setUploadStatus(false);
            setIsSending(false);
          });

        return;
      }

      query
        .collection('messages')
        .add({
          _id: shortid.generate(),
          text: msg,
          image: imguri,
          createdAt: new Date(),
          user: {
            _id: authUser.uid,
          },
        })
        .then(() => {
          setAttachedImage(null);
          setUploadStatus(false);
          setIsSending(false);
        });
    } catch (error) {
      setIsSending(false);
      showSnackbar('danger', 'Something went wrong, Try again !!');
      console.log('Err', error);
    }
  };

  const handlePickImage = imageData => {
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
            setAttachedImage(res.uri);
          }
        },
      );
    } catch (error) {
      //console.log(error);
    }
  };

  const renderActions = props => (
    <Actions
      {...props}
      options={{
        ['Attach Image']: handlePickImage,
      }}
      icon={() => <Icon name="ios-add-circle-outline" size={28} />}
      onSend={messages => sendMsg(messages)}
    />
  );

  const renderChatFooter = props => {
    if (isSending) {
      return <Spinner />;
    }

    return !attachedImage ? (
      <></>
    ) : (
      <View style={{padding: 5, border: 1, borderColor: '#000'}}>
        <TouchableOpacity
          onPress={() => setAttachedImage(null)}
          style={{position: 'absolute', top: 10, right: 10, zIndex: 99}}>
          <Icon name="close-circle-outline" />
        </TouchableOpacity>
        <Image
          source={{uri: attachedImage}}
          style={{width: '100%', height: 200}}
        />
      </View>
    );
  };

  useEffect(() => {
    const subscriber = getMessages();
    return () => subscriber;
  }, [isFocused]);

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
            {route.params.picture ? (
              <Thumbnail source={{uri: route.params.picture}} />
            ) : (
              <FAIcon name="user" size={24} />
            )}
          </Button>
        </Left>
        <Body>
          <Title>{route.params.name}</Title>
        </Body>
      </Header>
      <GiftedChat
        textInputStyle={{color: '#000'}}
        renderAvatarOnTop={true}
        alwaysShowSend={attachedImage ? true : false}
        renderActions={renderActions}
        messages={messages}
        renderChatFooter={renderChatFooter}
        /* onSend={messages => sendMsg(messages)} */
        renderSend={({onSend, text, sendButtonProps, ...props}) => (
          <Send
            {...props}
            sendButtonProps={{
              ...sendButtonProps,
              onPress: () => sendMsg(text, onSend),
            }}
          />
        )}
        alwaysShowSend={true}
        user={{
          _id: authUser.uid,
          name: authUser.name,
          avatar: authUser?.picture,
        }}
      />
    </Container>
  );
};

//redux
ChatScreen.prototype = {
  authUser: propTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authUser: state.auth.user,
});

export default connect(mapStateToProps)(ChatScreen);
