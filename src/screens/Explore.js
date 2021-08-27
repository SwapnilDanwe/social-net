import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';

import {Container} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

import {useIsFocused} from '@react-navigation/native';

import CommonHeader from '../layouts/CommonHeader';
import UserListItem from '../components/UserListItem';

//redux
import {getUsers} from '../action/user';
import {connect} from 'react-redux';

const Explore = ({authUser, userList, getUsers, navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUsers({user_id: authUser.uid});
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const isFocused = useIsFocused();

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

  useEffect(() => {
    const subs = getUsers({user_id: authUser.uid});
    return () => subs;
  }, [isFocused]);

  return (
    <Container>
      <CommonHeader title="Explore" />
      <View style={{flex: 1, paddingTop: 0}}>
        <View style={styles.container}>
          <View style={styles.searchView}>
            <View style={styles.inputView}>
              <TextInput
                defaultValue={searchText}
                style={styles.input}
                placeholder="Search"
                placeholderStyle={{color: '#000'}}
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
                <UserListItem user={user} key={user.uid} />
              ))}
              <View style={{height: 50}}></View>
            </ScrollView>
          ) : searchText.length > 0 ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageBoxText}>No user found</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              {userList.map((user, index) => (
                <UserListItem
                  user={user}
                  key={user.uid}
                  navigation={navigation}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Container>
  );
};

const mapStateToProps = state => ({
  userList: state.user.users,
  authUser: state.auth.user,
});

const mapDispatchToProps = {
  getUsers: () => getUsers(),
};

export default connect(mapStateToProps, mapDispatchToProps)(Explore);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
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
    color: '#000',
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
