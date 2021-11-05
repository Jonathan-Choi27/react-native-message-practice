import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { DataStore, SortDirection } from '@aws-amplify/datastore';

import Message from '../components/Message';
import Input from '../components/Input';

import { ChatRoomScreenProps } from '../types';
import { ChatRoom as ChatRoomModel, Message as MessageModel } from '../models';

export default function ChatRoom({ navigation, route }: ChatRoomScreenProps) {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messageReplyTo, setMessageReplyTo] = useState<MessageModel | null>(
    null
  );
  const [chatRoom, setChatRoom] = useState<ChatRoomModel | null>(null);

  useEffect(() => {
    const subscription = DataStore.observe(MessageModel).subscribe((msg) => {
      if (msg.model === MessageModel && msg.opType === 'INSERT') {
        setMessages((existingMessage) => [msg.element, ...existingMessage]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatRoom) return;

      const fetchedMessages = await DataStore.query(
        MessageModel,
        (message) => message.chatroomID('eq', chatRoom?.id),
        {
          sort: (message) => message.createdAt(SortDirection.DESCENDING),
        }
      );

      setMessages(fetchedMessages);
    };
    fetchMessages();
  }, [chatRoom]);

  useEffect(() => {
    const fetchChatRoom = async () => {
      if (!route.params?.id) return;

      const chatRoom = await DataStore.query(ChatRoomModel, route.params.id);
      if (!chatRoom) {
        console.error('Could not find a chat room with this id.');
      } else {
        setChatRoom(chatRoom);
      }
    };
    fetchChatRoom();
  }, []);

  if (!chatRoom) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Message
            message={item}
            setAsMessageReply={() => setMessageReplyTo(item)}
          />
        )}
        inverted
      />
      <Input
        chatRoom={chatRoom}
        messageReplyTo={messageReplyTo}
        removeMessageReplyTo={() => setMessageReplyTo(null)}
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
