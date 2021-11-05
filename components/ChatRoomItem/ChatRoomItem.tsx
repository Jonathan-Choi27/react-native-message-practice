import type { ChatRoomItemProps } from '../../types';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DataStore } from '@aws-amplify/datastore';
import Auth from '@aws-amplify/auth';

import { ChatRoomUser, Message, User } from '../../models';

import styles from './styles';

export default function ChatRoomItem({
  chatRoom,
  navigation,
}: ChatRoomItemProps) {
  const [user, setUser] = useState<User | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatroom.id === chatRoom.id)
        .map((chatRoomUser) => chatRoomUser.user);

      setUser(
        fetchedUsers.find((user) => user.id !== authUser.attributes.sub) || null
      );
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!chatRoom.chatRoomLastMessageId) return;

    DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(
      setLastMessage
    );
  }, []);

  const onPress = () => navigation.navigate('ChatRoom', { id: chatRoom.id });

  dayjs.extend(relativeTime);
  const time = dayjs(lastMessage?.createdAt).fromNow();

  if (!user) return <ActivityIndicator />;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <Image
        source={{
          uri: chatRoom.imageUri || user.imageUri,
        }}
        style={styles.image}
      />

      {!!chatRoom.newMessages && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
        </View>
      )}

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {chatRoom.name || user.name.split('@')[0]}
          </Text>
          <Text style={styles.text}>{time}</Text>
        </View>
        <Text style={styles.text} numberOfLines={1}>
          {lastMessage?.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
