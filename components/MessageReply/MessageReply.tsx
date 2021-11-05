import type { MessageProps } from '../../types';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, View } from 'react-native';
import { Auth, DataStore, Storage } from 'aws-amplify';

// @ts-ignore
import { S3Image } from 'aws-amplify-react-native';
import Lightbox from 'react-native-lightbox-v2';

import { BLACK, BLUE, DARKER_GREY, WHITE } from '../../constants/Colors';
import { User, Message as MessageModel } from '../../models';
import styles from './styles';
import AudioPlayer from '../AudioPlayer';

export default function MessageReply({ message: MessageProp }: MessageProps) {
  const [message, setMessage] = useState<MessageModel>(MessageProp);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isMe, setIsMe] = useState<boolean | null>(null);
  const [soundURI, setSoundURI] = useState<string | null>(null);

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect(() => {
    setMessage(MessageProp);
  }, [MessageProp]);

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

  if (!user) return <ActivityIndicator />;

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? '75%' : 'auto' },
      ]}
    >
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
              {message.content}
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
    </View>
  );
}
