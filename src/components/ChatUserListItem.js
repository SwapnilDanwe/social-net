import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import MtIcon from 'react-native-vector-icons/MaterialIcons';

const ChatUserListItem = ({user, authUserId, navigation}) => {
  const [lastMessage, setLastMessage] = useState([
    action => false,
    message => '-',
  ]);

  const getLastMsg = async () => {
    const docId =
      user.uid < authUserId
        ? `${user.uid}-${authUserId}`
        : `${authUserId}-${user.uid}`;

    firestore()
      .collection('chats')
      .doc(docId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot(
        documentSnapshot => {
          documentSnapshot.forEach(doc => {
            const message = doc.get('text');
            const sender = doc.get('user._id');
            const image = doc.get('image');
            const action = sender == authUserId ? 'sent' : 'received';

            setLastMessage({
              action: action,
              message: image ? 'Image' : message,
            });
          });
        },
        err => {
          //console.log('getLastMsg Err ', err);
        },
      );
  };

  useEffect(() => {
    const subs = getLastMsg();

    return () => subs;
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => navigation.navigate('ChatScreen', user)}>
        {user.displayProfile ? (
          <Image style={styles.userImage} source={{uri: user.displayProfile}} />
        ) : (
          <Image
            style={styles.userImage}
            source={require('../assets/img/userAvatar.png')}
          />
        )}
        <View style={styles.userCardRight}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
            }}>
            {user.name}
          </Text>
          <View style={{width: '100%', flexDirection: 'row'}}>
            {lastMessage.action == 'sent' ? (
              <MtIcon
                name="north-east"
                color="blue"
                style={{paddingTop: 2, paddingRight: 3}}
              />
            ) : (
              <></>
            )}
            {lastMessage.action == 'received' ? (
              <MtIcon
                name="south-west"
                color="blue"
                style={{paddingTop: 2, paddingRight: 3}}
              />
            ) : (
              <></>
            )}
            <Text style={{fontSize: 13}}>{lastMessage.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ChatUserListItem;

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: '#fafafa',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userCardRight: {
    paddingHorizontal: 10,
  },
});
