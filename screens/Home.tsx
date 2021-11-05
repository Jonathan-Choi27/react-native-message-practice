import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import ChatRoomItem from '../components/ChatRoomItem';

import { HomeScreenProps } from '../types';
import { ChatRoom } from '../models';
import { DataStore } from '@aws-amplify/datastore';
import Auth from '@aws-amplify/auth';
import { ChatRoomUser } from '../models';

export default function Home({ navigation }: HomeScreenProps) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const chatRooms = (await DataStore.query(ChatRoomUser))
        .filter(
          (chatRoomUser) => chatRoomUser.user.id === userData.attributes.sub
        )
        .map((chatRoomUser) => chatRoomUser.chatroom);

      setChatRooms(chatRooms);
    };
    fetchChatRooms();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => (
          <ChatRoomItem chatRoom={item} navigation={navigation} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
