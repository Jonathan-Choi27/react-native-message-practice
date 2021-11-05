import type { InputProps } from '../../types';
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import EmojiSelector from 'react-native-emoji-selector';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { Auth, DataStore, Storage } from 'aws-amplify';

import { DARKER_GREY, LIGHT_GREY, WHITE } from '../../constants/Colors';
import { ChatRoom, Message } from '../../models';
import styles from './styles';
import AudioPlayer from '../AudioPlayer';
import MessageComponent from '../Message';

export default function Input({
  chatRoom,
  messageReplyTo,
  removeMessageReplyTo,
}: InputProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [soundURI, setSoundURI] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const libraryResponse =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
        await Audio.requestPermissionsAsync();

        if (
          libraryResponse.status !== 'granted' ||
          photoResponse.status !== 'granted'
        ) {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const onPress = () => {
    if (image) {
      sendImage();
    } else if (message) {
      sendMessage();
    } else if (soundURI) {
      sendAudio();
    } else {
      return;
    }
  };

  const resetFields = () => {
    setMessage('');
    setImage(null);
    setProgress(0);
    setIsEmojiPickerOpen(false);
    setSoundURI(null);
    removeMessageReplyTo();
  };

  const sendMessage = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await DataStore.save(
      new Message({
        content: message,
        userID: user.attributes.sub,
        chatroomID: chatRoom.id,
        status: 'SENT',
        replyToMessageID: messageReplyTo?.id,
      })
    );

    updateLastMessage(newMessage);

    resetFields();
  };

  const updateLastMessage = async (newMessage: Message) => {
    DataStore.save(
      ChatRoom.copyOf(chatRoom, (updatedChatRoom) => {
        updatedChatRoom.LastMessage = newMessage;
      })
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) setImage(result.uri);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) setImage(result.uri);
  };

  const progressCallback = (progress) => {
    setProgress(progress.loaded / progress.total);
  };

  const sendImage = async () => {
    if (!image) return;

    const blob = await getBlob(image);
    const { key } = await Storage.put(`${uuidv4()}.png`, blob, {
      progressCallback,
    });

    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await DataStore.save(
      new Message({
        content: message,
        image: key,
        userID: user.attributes.sub,
        chatroomID: chatRoom.id,
        status: 'SENT',
        replyToMessageID: messageReplyTo?.id,
      })
    );

    updateLastMessage(newMessage);

    resetFields();
  };

  const getBlob = async (uri: string) => {
    const respone = await fetch(uri);
    const blob = await respone.blob();
    return blob;
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    if (!uri) return;
    setSoundURI(uri);
  };

  const sendAudio = async () => {
    if (!soundURI) return;

    const uriParts = soundURI.split('.');
    const extenstion = uriParts[uriParts.length - 1];
    const blob = await getBlob(soundURI);
    const { key } = await Storage.put(`${uuidv4()}.${extenstion}`, blob, {
      progressCallback,
    });

    const user = await Auth.currentAuthenticatedUser();
    const newMessage = await DataStore.save(
      new Message({
        content: message,
        audio: key,
        userID: user.attributes.sub,
        chatroomID: chatRoom.id,
      })
    );

    updateLastMessage(newMessage);

    resetFields();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { height: isEmojiPickerOpen ? '50%' : 'auto' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {messageReplyTo && (
        <View
          style={{
            backgroundColor: LIGHT_GREY,
            padding: 10,
            marginVertical: 10,
            borderRadius: 10,
            flexDirection: 'row',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Reply to:</Text>
            <MessageComponent message={messageReplyTo} />
          </View>
          <TouchableOpacity onPress={() => removeMessageReplyTo()}>
            <SimpleLineIcons name="close" size={24} color={DARKER_GREY} />
          </TouchableOpacity>
        </View>
      )}

      {image && (
        <View style={styles.sendImageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.progressContainer}>
            <View style={[styles.progress, { width: `${progress * 100}%` }]} />
          </View>
          <TouchableOpacity onPress={() => setImage(null)}>
            <SimpleLineIcons name="close" size={24} color={DARKER_GREY} />
          </TouchableOpacity>
        </View>
      )}

      {soundURI && <AudioPlayer soundURI={soundURI} />}

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() =>
              setIsEmojiPickerOpen((currentValue) => !currentValue)
            }
          >
            <SimpleLineIcons
              name="emotsmile"
              size={24}
              color={DARKER_GREY}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Message..."
          />
          <TouchableOpacity onPress={pickImage}>
            <SimpleLineIcons
              name="picture"
              size={24}
              color={DARKER_GREY}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto}>
            <SimpleLineIcons
              name="camera"
              size={24}
              color={DARKER_GREY}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
            <SimpleLineIcons
              name="microphone"
              size={24}
              color={recording ? 'red' : DARKER_GREY}
              style={styles.icon}
            />
          </Pressable>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          activeOpacity={0.5}
          onPress={onPress}
        >
          {message || image || soundURI ? (
            <SimpleLineIcons name="cursor" size={18} color={WHITE} />
          ) : (
            <AntDesign name="plus" size={22} color={WHITE} />
          )}
        </TouchableOpacity>
      </View>
      {isEmojiPickerOpen && (
        <EmojiSelector
          onEmojiSelected={(emoji) =>
            setMessage((currentMessage) => currentMessage + emoji)
          }
          columns={8}
          showSearchBar={false}
          showTabs={false}
        />
      )}
    </KeyboardAvoidingView>
  );
}
