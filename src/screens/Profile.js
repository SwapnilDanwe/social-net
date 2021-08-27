import React, {useEffect} from 'react';
import {View, Image, StyleSheet, ScrollView} from 'react-native';

import {
  Container,
  Content,
  Text,
  Body,
  Icon,
  Thumbnail,
  Tabs,
  Tab,
  TabHeading,
} from 'native-base';

import ProfileHeader from '../layouts/ProfileHeader';

import Loader from '../components/Loader';

import {useIsFocused} from '@react-navigation/native';

import Lightbox from 'react-native-lightbox-v2';

import {errorColor} from '../options';

//redux
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {getProfileData} from '../action/profile';

const Profile = ({authUser, profileData, getProfileData}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    const subs = getProfileData({userId: authUser.uid});
    return () => subs
  }, [isFocused]);

  if (profileData.isLoading) {
    return <Loader />;
  }

  return (
    <Container style={styles.container}>
      <ProfileHeader />
      <ScrollView>
        <Content>
          <View style={styles.header}>
            <View style={styles.headerDP}>
              <Image
                style={styles.avatar}
                source={{
                  uri: profileData?.displayProfile
                    ? profileData.displayProfile
                    : 'https://bootdey.com/img/Content/avatar/avatar2.png',
                }}
              />
              <Text style={styles.name}>{profileData.name}</Text>
            </View>
            <View style={styles.profileDetail}>
              <View style={styles.detailContent}>
                <Text style={styles.title}>Posts</Text>
                <Text style={styles.count}>{profileData.postCount}</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.title}>Followers</Text>
                <Text style={styles.count}>{profileData.followerCount}</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.title}>Following</Text>
                <Text style={styles.count}>{profileData.followingCount}</Text>
              </View>
            </View>
          </View>

          <Body style={styles.body}>
            <Tabs>
              <Tab
                heading={
                  <TabHeading>
                    <Icon name="apps" />
                  </TabHeading>
                }>
                <View style={styles.postsTab}>
                  {profileData.userPosts.length > 0 ? (
                    profileData.userPosts.map((post, index) => (
                      <View style={styles.imageGridBox}>
                        <Lightbox key={index}>
                          <Thumbnail
                            key={index}
                            style={styles.thumb}
                            square
                            large
                            source={{
                              uri: post.image,
                            }}
                          />
                        </Lightbox>
                      </View>
                    ))
                  ) : (
                    <View style={{flex: 1}}>
                      <Text style={styles.message}>NO POSTS FOUND</Text>
                    </View>
                  )}
                </View>
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Icon name="people" />
                  </TabHeading>
                }>
                <View style={{flex: 1}}>
                  <Text style={styles.message}>No Tags</Text>
                </View>
              </Tab>
            </Tabs>
          </Body>
        </Content>
      </ScrollView>
    </Container>
  );
};

Profile.prototype = {
  profileData: propTypes.object.isRequired,
  authUser: propTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authUser: state.auth.user,
  profileData: state.profile,
});

const mapDispatchToProps = {
  getProfileData: data => getProfileData(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumb: {
    width: undefined,
    height: undefined,
    aspectRatio: 1,
    padding: 1,
  },
  postsTab: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#383CC1',
    flexDirection: 'row',
  },
  headerDP: {
    padding: 30,
    alignItems: 'flex-start',
    width: '40%',
    textAlign: 'center',
    alignItems: 'center',
  },
  imageGridBox: {
    width: '33.10%',
    height: 130,
    height: undefined,
    aspectRatio: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: 'white',
    marginVertical: 15,
  },
  name: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  profileDetail: {
    width: '60%',
    marginVertical: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailContent: {
    margin: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#FFF',
  },
  count: {
    fontSize: 18,
    color: '#FFF',
  },
  message: {
    color: errorColor,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    paddingVertical: 25,
  },
});
