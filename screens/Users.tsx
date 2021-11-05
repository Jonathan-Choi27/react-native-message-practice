import type { UsersScreenProps } from '../types';
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Auth, DataStore } from 'aws-amplify';

import NewGroupButton from '../components/NewGroupButton';
import UserItem from '../components/UserItem';

import { ChatRoom, ChatRoomUser, User } from '../models';
import { BLUE, BORDER_GREY, LIGHT_GREY, WHITE } from '../constants/Colors';

export default function Users({ navigation }: UsersScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isNewGroup, setIsNewGroup] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    const removeMe = async () => {
      const userAuth = await Auth.currentAuthenticatedUser();
      DataStore.query(User).then((queriedUsers) =>
        setUsers(
          queriedUsers.filter((user) => userAuth.attributes.sub !== user.id)
        )
      );
    };
    removeMe();
  }, []);

  const addUserToChatRoom = async (user: User, chatroom: ChatRoom) => {
    DataStore.save(new ChatRoomUser({ user, chatroom }));
  };

  const createChatRoom = async (users: User[]) => {
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);

    // Attribution: Flaticon.com for imageUri
    const newChatRoomData = {
      newMessages: 0,
      Admin: dbUser,
      name: '',
      imageUri: '',
    };
    if (users.length > 1) {
      newChatRoomData.name = groupName || 'New Group';
      newChatRoomData.imageUri =
        'https://cdn-icons.flaticon.com/png/512/2143/premium/2143112.png?token=exp=1635225365~hmac=97f2d19a9a5dd4f35c661f8942460db7';
    }

    const newChatRoom = await DataStore.save(new ChatRoom(newChatRoomData));

    if (dbUser) await addUserToChatRoom(dbUser, newChatRoom);

    await Promise.all(
      users.map((user) => addUserToChatRoom(user, newChatRoom))
    );

    navigation.navigate('ChatRoom', { id: newChatRoom.id });
  };

  const isUserSelected = (user: User) => {
    return selectedUsers.some((selectedUser) => selectedUser.id === user.id);
  };

  const onUserPress = async (user: User) => {
    if (isNewGroup) {
      if (isUserSelected(user)) {
        setSelectedUsers(
          selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
        );
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    } else {
      await createChatRoom([user]);
    }
  };

  const saveGroup = async () => {
    await createChatRoom(selectedUsers);
    setGroupName('');
  };

  return (
    <View style={styles.container}>
      {users && users.length ? (
        <>
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <UserItem
                user={item}
                onPress={() => onUserPress(item)}
                isSelected={isNewGroup ? isUserSelected(item) : undefined}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <NewGroupButton onPress={() => setIsNewGroup(!isNewGroup)} />
            )}
          />
          {isNewGroup && (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="Enter Group Name..."
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={saveGroup}>
                <Text style={styles.buttonText}>
                  Save Group ({selectedUsers.length})
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.text}>No users registered in the app :(</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: BLUE,
    margin: 20,
    padding: 20,
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 14,
  },
  text: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: LIGHT_GREY,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  input: {
    margin: 20,
  },
});
