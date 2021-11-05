import type { ChatHeaderTitleProps } from '../../../types';
import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { DataStore } from '@aws-amplify/datastore';
import { useNavigation } from '@react-navigation/core';
import Auth from '@aws-amplify/auth';
import dayjs from 'dayjs';

import { GREEN } from '../../../constants/Colors';
import { ChatRoom, ChatRoomUser, User } from '../../../models';
import styles from './styles';

export default function ChatHeaderTitle({ id }: ChatHeaderTitleProps) {
  const [chatRoom, setChatRoom] = useState<ChatRoom | undefined>(undefined);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const UPDATE_INTERVAL = 5 * 60 * 1000;
  const lastOnlineDiffMS = dayjs().diff(dayjs(user?.lastOnlineAt));

  const navigation = useNavigation();

  useEffect(() => {
    if (!id) return;

    fetchUsers();
    fetchChatRoom();
  }, []);

  const fetchUsers = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter((chatRoomUser) => chatRoomUser.chatroom.id === id)
      .map((chatRoomUser) => chatRoomUser.user);

    setAllUsers(fetchedUsers);

    setUser(
      fetchedUsers.find((user) => user.id !== authUser.attributes.sub) || null
    );
  };

  const fetchChatRoom = async () => {
    if (!id) return;

    DataStore.query(ChatRoom, id).then(setChatRoom);
  };

  const getUsernames = () => {
    return allUsers.map((user) => user?.name.split('@')[0]).join(', ');
  };

  const getLastOnlineText = () => {
    if (lastOnlineDiffMS < UPDATE_INTERVAL) {
      return 'Online';
    } else {
      return `Last online ${dayjs(user?.lastOnlineAt).fromNow()}`;
    }
  };

  const openInfo = () => {
    navigation.navigate('GroupInfo', { id });
  };

  const isGroup = allUsers.length > 2;

  return (
    <TouchableOpacity style={styles.container} onPress={openInfo}>
      <Image
        source={{
          uri: chatRoom?.imageUri || user?.imageUri,
        }}
        style={styles.image}
      />
      <View>
        <Text style={styles.title}>
          {chatRoom?.name || user?.name.split('@')[0]}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={styles.lastOnlineText} numberOfLines={1}>
            {isGroup ? getUsernames() : getLastOnlineText()}
          </Text>
          {lastOnlineDiffMS < UPDATE_INTERVAL && (
            <SimpleLineIcons name="check" size={14} color={GREEN} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
