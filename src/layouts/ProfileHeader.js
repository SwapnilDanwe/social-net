import React from 'react';
import {StyleSheet} from 'react-native';

import {
  Header,
  Text,
  Left,
  Body,
  Right,
  Button,
  Title,
  Icon,
} from 'native-base';

import {useNavigation} from '@react-navigation/native';

//import FAIcon from 'react-native-vector-icons/FontAwesome';

//redux
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {signOut} from '../action/auth';

const ProfileHeader = ({signOut, title}) => {
  const navigation = useNavigation();

  return (
    <Header>
      <Left>
        <Button transparent onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>{title ? title : 'SocialNet'}</Title>
      </Body>
      <Right>
        <Button transparent onPress={() => signOut()}>
          <Icon name="log-out-outline" />
        </Button>
      </Right>
    </Header>
  );
};

ProfileHeader.prototype = {
  signOut: propTypes.func.isRequired,
};

const mapDispatchToProps = {
  signOut,
};

export default connect(null, mapDispatchToProps)(ProfileHeader);
