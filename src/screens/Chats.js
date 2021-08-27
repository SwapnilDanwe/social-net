import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {Container, Content, Header, Text, Body, Title} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

import ChatUserListItem from '../components/ChatUserListItem';

import {useIsFocused} from '@react-navigation/native';

//redux import
import propTypes from 'prop-types';
import {getUsers} from '../action/user';
import {connect} from 'react-redux';

const Chats = ({authUser, userList, getUsers, navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const subs = getUsers();
    return () => subs;
  }, [isFocused]);

  const onSearchText = text => {
    setSearchText(text);
    if (text === '') {
      return setFilteredUsers([]);
    }
    const filtered_users = userList.filter(user =>
      user.name.toLowerCase().startsWith(text.toLowerCase()),
    );
    setFilteredUsers(filtered_users);
  };

  return (
    <Container style={{flex: 1}}>
      <Header>
        <Body>
          <Title>Chats</Title>
        </Body>
      </Header>
      <Content style={styles.container}>
        <View style={styles.searchView}>
          <View style={styles.inputView}>
            <TextInput
              defaultValue={searchText}
              style={styles.input}
              placeholder="Search"
              textContentType="name"
              onChangeText={text => onSearchText(text)}
              returnKeyType="search"
            />
            {searchText.length === 0 ? (
              <TouchableOpacity>
                <Icon name="search" size={24} color="#333" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setFilteredUsers([]);
                }}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {filteredUsers.length > 0 ? (
          <ScrollView>
            {filteredUsers.map((user, index) => (
              <ChatUserListItem
                user={user}
                authUserId={authUser.uid}
                key={index}
                navigation={navigation}
              />
            ))}
            <View style={{height: 50}}></View>
          </ScrollView>
        ) : searchText.length > 0 ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageBoxText}>No user found</Text>
          </View>
        ) : (
          <ScrollView>
            {userList.map((user, index) => (
              <ChatUserListItem
                user={user}
                authUserId={authUser.uid}
                key={index}
                navigation={navigation}
              />
            ))}
          </ScrollView>
        )}
      </Content>
    </Container>
  );
};

//redux config
Chats.prototype = {
  userList: propTypes.array.isRequired,
  getUsers: propTypes.func.isRequireds,
};

const mapStateToProps = state => ({
  userList: state.user.users,
  authUser: state.auth.user,
});

const mapDispatchToProps = {
  getUsers: () => getUsers(),
};

export default connect(mapStateToProps, mapDispatchToProps)(Chats);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  searchView: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputView: {
    flex: 1,
    height: 40,
    backgroundColor: '#dfe4ea',
    paddingHorizontal: 10,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
  },
  messageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBoxText: {
    fontSize: 20,
    fontWeight: '500',
  },
});
