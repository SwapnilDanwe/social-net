import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import FAIcon from 'react-native-vector-icons/FontAwesome';

import Icon from 'react-native-vector-icons/Feather';

//
import firestore from '@react-native-firebase/firestore';

//redux
import {connect} from 'react-redux';

const PostTile = ({authUser, post, index}) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const voteAction = async voteValue => {
    let updateKey = [];
    updateKey[`likes.${authUser.uid}`] = voteValue;

    firestore()
      .collection('posts')
      .doc(post.uid)
      .update({...updateKey})
      .then(() => {
        setIsLiked(voteValue);
      });
  };

  useEffect(() => {
    if (post.likes) {
      setIsLiked(post.likes[authUser.uid]);
    }

    if (post.likes) {
      const totalLikes = Object.values(post.likes).filter(
        isVoted => isVoted != 0,
      ).length;
      setLikesCount(totalLikes);
    }
    return () => {};
  }, [post]);

  return (
    <View>
      <View style={styles.post}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image
            style={{width: 50, height: 50, borderRadius: 100}}
            source={{uri: `https://picsum.photos/100/100?random=${index + 1}`}}
          />
          <View style={{flex: 1, paddingHorizontal: 10}}>
            <Text style={{fontSize: 18}}>{post?.post_by}</Text>
            <Text>{post?.post_by} | MH, India</Text>
          </View>
          {/* <TouchableOpacity style={{paddingHorizontal: 6}}>
            <Icon name="more-horizontal" size={24} />
          </TouchableOpacity> */}
        </View>
        {/* Post Content */}
        <View style={{paddingHorizontal: 6}}>
          {/* Post Content Text */}
          {post.caption ? <Text>{post.caption}</Text> : <></>}
          {/* Post Content Image */}
          <Image
            style={styles.postContentImage}
            source={{
              // uri: images[index]?.download_url,
              uri: post.image,
            }}
          />
        </View>
        {/* Interactions Bar */}
        <View style={styles.interactionBar}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FAIcon name="thumbs-up" size={18} color="#eb3b5a" />
            <Text style={styles.interactionText}>{likesCount} Likes</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.interactionText}>0 comments</Text>
            <Text style={styles.interactionText}>0 shares</Text>
          </View>
        </View>
        {/* Interacts Button */}
        <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 4}}>
          {isLiked ? (
            <TouchableOpacity
              style={styles.interactionButton}
              onPress={() => voteAction(0)}>
              <Icon name="thumbs-up" color="blue" size={24} />
              <Text style={{marginLeft: 6}}>Like</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.interactionButton}
              onPress={() => voteAction(1)}>
              <Icon name="thumbs-up" color="#000" size={24} />
              <Text style={{marginLeft: 6}}>Like</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.interactionButton}>
            <Icon name="message-square" size={24} />
            <Text style={{marginLeft: 6}}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionButton}>
            <Icon name="share-2" size={24} />
            <Text style={{marginLeft: 6}}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  authUser: state.auth.user,
});

export default connect(mapStateToProps)(PostTile);

const styles = StyleSheet.create({
  post: {
    borderWidth: 1.2,
    borderColor: '#dfe4ea',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  postHeader: {padding: 6, flexDirection: 'row', alignItems: 'center'},
  postContentImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
  interactionBar: {
    backgroundColor: '#fafafa',
    height: 40,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  interactionText: {
    color: '#000',
    marginLeft: 4,
  },
  interactionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
});
