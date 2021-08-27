import React from 'react';
import {Container, Spinner} from 'native-base';

const Loader = () => {
  return (
    <Container
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Spinner color="blue" />
    </Container>
  );
};

export default Loader;
