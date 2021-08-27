import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Right, Button} from 'native-base';

import {showSnackbar} from '../utils/HelperFunctions';

//Import firebase
import firestore from '@react-native-firebase/firestore';

//Redux import
import {connect} from 'react-redux';

const UserListItem = ({authUser, user, navigation}) => {
  const [isInAction, setIsInAction] = useState(false);
  const [showFollowBtn, setShowFollowBtn] = useState(!user.isFollowed);

  const isAlreadyExist = async targetId => {
    const isEx = await firestore()
      .collection('followers')
      .where('user_id', '==', authUser.uid)
      .where('target_id', '==', targetId)
      .get();

    return isEx.size;
  };

  const doFollow = async (targetId, userName) => {
    const isExistd = await isAlreadyExist(targetId);
    if (isExistd) {
      return showSnackbar('danger', `Already followed`);
    }

    setIsInAction(true);
    try {
      firestore()
        .collection('followers')
        .add({
          user_id: authUser.uid,
          target_id: targetId,
          status: 'APPROVED',
        })
        .then(response => {
          showSnackbar('success', `You are now following ${userName}`);
          setIsInAction(false);
          setShowFollowBtn(false);
        });
    } catch (error) {
      showSnackbar('danger', `Something went wrong, Try again !!`);
      setIsInAction(false);
    }
  };

  const doUnFollow = async targetId => {
    setIsInAction(true);
    try {
      firestore()
        .collection('followers')
        .where('user_id', '==', authUser.uid)
        .where('target_id', '==', targetId)
        .limit(1)
        .get()
        .then(querySnapshot => {
          const del_id = querySnapshot.docs.map(doc => doc.id);
          if (del_id[0]) {
            firestore()
              .collection('followers')
              .doc(del_id[0])
              .delete()
              .then(response => {
                showSnackbar('warning', `Unfollowed`);
                setShowFollowBtn(true);
                setIsInAction(false);
              });
          }
        });
    } catch (error) {
      showSnackbar('danger', `Something went wrong, Try again !!`);
      setIsInAction(false);
    }
  };

  const FollowBtn = () => (
    <Button
      iconRight
      small
      rounded
      onPress={() => doFollow(user.uid, user.name)}
      style={{paddingHorizontal: 10}}>
      <Text style={{paddingHorizontal: 3, color: '#FFF'}}>Follow</Text>
      <Icon name="plus" color="#fff" style={{paddingHorizontal: 3}} />
    </Button>
  );

  const UnfollowBtn = () => (
    <Button
      small
      bordered
      rounded
      transparent
      onPress={() => doUnFollow(user.uid)}>
      <Text style={{paddingHorizontal: 10}}>Unfollow</Text>
    </Button>
  );

  return (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => {
        navigation.navigate('UserProfile', user);
      }}>
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
          {user?.name}
        </Text>
        <Text>{user?.phone}</Text>
      </View>
      <Right>
        {!isInAction ? (
          showFollowBtn ? (
            <FollowBtn />
          ) : (
            <UnfollowBtn />
          )
        ) : (
          <Text>Please wait...</Text>
        )}
      </Right>
    </TouchableOpacity>
  );
};

const mapStateToProps = state => ({
  authUser: state.auth.user,
});

export default connect(mapStateToProps)(UserListItem);

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
