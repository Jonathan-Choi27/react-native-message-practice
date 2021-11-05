import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ChatRoom, ChatRoomUser, User } from '../models';
import { useRoute } from '@react-navigation/core';
import { WHITE } from '../constants/Colors';
import { FlatList } from 'react-native-gesture-handler';
import UserItem from '../components/UserItem';

export default function GroupInfo() {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const route = useRoute();

  useEffect(() => {
    fetchUsers();
    fetchChatRoom();
  }, []);

  const fetchChatRoom = async () => {
    if (!route.params?.id) return;

    const chatRoom = await DataStore.query(ChatRoom, route.params?.id);
    if (!chatRoom) {
      console.error('Could not find a chat room with this id.');
    } else {
      setChatRoom(chatRoom);
    }
  };

  const fetchUsers = async () => {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter((chatRoomUser) => chatRoomUser.chatroom.id === route.params?.id)
      .map((chatRoomUser) => chatRoomUser.user);

    setAllUsers(fetchedUsers);
  };

  const confirmDelete = (user: User) => {
    if (user.id === chatRoom?.Admin?.id) {
      alert('You are the admin, you cannot delete yourself from the group.');
      return;
    }

    Alert.alert(
      'Confirm delete',
      `Are you sure you want to delete ${user.name} from the group?`,
      [
        {
          text: 'Delete',
          onPress: () => deleteUser(user),
          style: 'destructive',
        },
        {
          text: 'Cancel',
        },
      ]
    );
  };

  const deleteUser = async (user: User) => {
    const chatRoomUsersToDelete = await (
      await DataStore.query(ChatRoomUser)
    ).filter(
      (cru) => cru.chatroom.id === chatRoom?.id && cru.user.id === user.id
    );

    if (chatRoomUsersToDelete.length > 0) {
      await DataStore.delete(chatRoomUsersToDelete[0]);

      setAllUsers(allUsers.filter((u) => u.id !== user.id));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chatRoom?.name}</Text>
      <Text style={styles.title}>Users ({allUsers.length})</Text>
      <FlatList
        data={allUsers}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            isAdmin={chatRoom?.Admin?.id === item.id}
            onLongPress={() => confirmDelete(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});
