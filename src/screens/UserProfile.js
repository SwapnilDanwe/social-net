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

//header
import ProfileHeader from '../layouts/ProfileHeader';

import {errorColor} from '../options';

import Lightbox from 'react-native-lightbox-v2';

//redux
import propTypes from 'prop-types';
import {getProfileData} from '../action/profile';
import {connect} from 'react-redux';

const UserProfile = ({getProfileData, profileData, navigation, route}) => {
  useEffect(() => {
    getProfileData({userId: route.params.uid});
  }, []);

  return (
    <Container style={styles.container}>
      <ProfileHeader title={route.params.username} />
      <ScrollView>
        <Content>
          <View style={styles.header}>
            <View style={styles.headerDP}>
              <Image
                style={styles.avatar}
                source={{
                  uri: route.params.displayProfile
                    ? route.params.displayProfile
                    : 'https://bootdey.com/img/Content/avatar/avatar2.png',
                }}
              />
              <Text style={styles.name}>{route.params.name}</Text>
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

//redux
UserProfile.prototype = {
  getProfileData: propTypes.func.isRequired,
  profileData: propTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profileData: state.profile,
});

const mapDispatchToProps = {
  getProfileData: data => getProfileData(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

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
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageGridBox: {
    width: '33.10%',
    height: 130,
    height: undefined,
    aspectRatio: 1,
  },
  header: {
    backgroundColor: '#383CC1',
    flexDirection: 'row',
  },
  headerDP: {
    padding: 30,
    alignItems: 'flex-start',
    width: '40%',
    alignItems: 'center',
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
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
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
