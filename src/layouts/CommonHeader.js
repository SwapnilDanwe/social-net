import React from 'react';
import {View, Text} from 'react-native';

import {Header, Title, Left, Body, H1, Button, Icon} from 'native-base';

const CommonHeader = ({title}) => {
  return (
    <Header>
      <Body>
        <Title>{title ? title : 'SocialNet'}</Title>
      </Body>
    </Header>
  );
};

export default CommonHeader;
