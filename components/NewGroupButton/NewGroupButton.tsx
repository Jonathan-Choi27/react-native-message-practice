import type { NewGroupButtonProps } from '../../types';
import React from 'react';
import { SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

import { DARKER_GREY } from '../../constants/Colors';
import styles from './styles';

export default function NewGroupButton({ onPress }: NewGroupButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonContainer}>
        <SimpleLineIcons name="user-follow" size={24} color={DARKER_GREY} />
        <Text style={styles.text}>New Chat Group</Text>
      </View>
    </TouchableOpacity>
  );
}
