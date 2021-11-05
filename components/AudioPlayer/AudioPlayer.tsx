import type { AudioPlayerProps } from '../../types';
import React, { useEffect, useState } from 'react';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { View, Text, Pressable } from 'react-native';

import styles from './styles';
import { DARKER_GREY } from '../../constants/Colors';

export default function AudioPlayer({ soundURI }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [paused, setPause] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    loadSound();
    () => {
      if (sound) sound.unloadAsync();
    };
  }, [soundURI]);

  const loadSound = async () => {
    if (!soundURI) return;

    const { sound } = await Audio.Sound.createAsync(
      { uri: soundURI },
      {},
      onPlaybackStatusUpdate
    );
    setSound(sound);
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setAudioProgress(status.positionMillis / (status.durationMillis || 1));
    setPause(!status.isPlaying);
    setAudioDuration(status.durationMillis || 0);
  };

  const playPauseSound = async () => {
    if (!sound) return;

    if (paused) {
      await sound.playFromPositionAsync(0);
    } else {
      await sound.pauseAsync();
    }
  };

  const getDuration = () => {
    const minutes = Math.floor(audioDuration / (60 * 1000));
    const seconds = Math.floor((audioDuration % (60 * 1000)) / 1000);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.sendAudioContainer}>
      <Pressable onPress={playPauseSound}>
        <SimpleLineIcons
          name={paused ? 'control-play' : 'control-pause'}
          size={24}
          color={DARKER_GREY}
        />
      </Pressable>

      <View style={styles.audioProgressBackground}>
        <View
          style={[
            styles.audioProgressForeground,
            { left: `${audioProgress * 100}%` },
          ]}
        />
      </View>

      <Text>{getDuration()}</Text>
    </View>
  );
}
