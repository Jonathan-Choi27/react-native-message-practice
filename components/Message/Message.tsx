import type { MessageProps } from '../../types';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  TouchableOpacity,
  ActivityIndicator,
  Text,
  View,
  Alert,
} from 'react-native';
import { Auth, DataStore, Storage } from 'aws-amplify';

// @ts-ignore
import { S3Image } from 'aws-amplify-react-native';
import Lightbox from 'react-native-lightbox-v2';

import { BLACK, BLUE, DARKER_GREY, WHITE } from '../../constants/Colors';
import { User, Message as MessageModel } from '../../models';
import styles from './styles';
import AudioPlayer from '../AudioPlayer';
import MessageReply from '../MessageReply';
import { useActionSheet } from '@expo/react-native-action-sheet';

export default function Message({
  message: MessageProp,
  setAsMessageReply,
}: MessageProps) {
  const [message, setMessage] = useState<MessageModel>(MessageProp);
  const [repliedTo, setRepliedTo] = useState<MessageModel | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isMe, setIsMe] = useState<boolean | null>(null);
  const [soundURI, setSoundURI] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect(() => {
    setMessage(MessageProp);
  }, [MessageProp]);

  useEffect(() => {
    if (message?.replyToMessageID) {
      DataStore.query(MessageModel, message.replyToMessageID).then(
        setRepliedTo
      );
    }
  }, [message]);

  useEffect(() => {
    const subscription = DataStore.observe(MessageModel, message.id).subscribe(
      (msg) => {
        if (msg.model === MessageModel && msg.opType === 'UPDATE') {
          setMessage((message) => ({ ...message, ...msg.element }));
        } else if (msg.opType === 'DELETE') {
          setIsDeleted(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const setAsRead = async () => {
      if (isMe === false && message.status !== 'READ')
        await DataStore.save(
          MessageModel.copyOf(message, (updated) => {
            updated.status = 'READ';
          })
        );
    };
    setAsRead();
  }, [isMe, message]);

  useEffect(() => {
    if (message.audio) Storage.get(message.audio).then(setSoundURI);
  }, [message]);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) return;

      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub);
    };
    checkIfMe();
  }, [user]);

  const deleteMessage = async () => {
    await DataStore.delete(message);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirm delete',
      'Are you sure you want to delete the message?',
      [
        {
          text: 'Delete',
          onPress: deleteMessage,
          style: 'destructive',
        },
        {
          text: 'Cancel',
        },
      ]
    );
  };

  const onActionPress = (index: number) => {
    if (index === 0) {
      setAsMessageReply();
    } else if (index === 1) {
      if (isMe) {
        confirmDelete();
      } else {
        Alert.alert("Can't perform action", 'This is not your message');
      }
    }
  };

  const openActionMenu = () => {
    const options = ['Reply', 'Delete', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
      },
      onActionPress
    );
  };

  if (!user) return <ActivityIndicator />;

  return (
    <TouchableOpacity
      onLongPress={openActionMenu}
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? '75%' : 'auto' },
      ]}
    >
      {repliedTo && <MessageReply message={repliedTo} />}

      {message.image && (
        <Lightbox swipeToDismiss={true}>
          <View style={{ marginBottom: message.content ? 10 : 0 }}>
            <S3Image imgKey={message.image} style={styles.image} />
          </View>
        </Lightbox>
      )}
      <View style={styles.row}>
        {soundURI && <AudioPlayer soundURI={soundURI} />}

        <View style={{ justifyContent: 'center' }}>
          {!!message.content && (
            <Text style={{ color: isMe ? BLACK : WHITE }}>
              {isDeleted ? 'Message Deleted' : message.content}
            </Text>
          )}
        </View>

        <View
          style={{
            justifyContent: 'center',
          }}
        >
          {isMe && !!message.status && message.status !== 'SENT' && (
            <Ionicons
              name={
                message.status === 'DELIVERED' ? 'checkmark' : 'checkmark-done'
              }
              size={24}
              color={message.status === 'DELIVERED' ? DARKER_GREY : BLUE}
              style={{ marginHorizontal: 5 }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
