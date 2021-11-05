import * as React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { UserItemProps } from '../../types';
import styles from './styles';
import { DARKER_GREY } from '../../constants/Colors';

export default function UserItem({
  user,
  onPress,
  onLongPress,
  isSelected,
  isAdmin = false,
}: UserItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Image
        source={{
          uri: user.imageUri,
        }}
        style={styles.image}
      />

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
          {isSelected !== undefined && (
            <Feather
              name={isSelected ? 'check-circle' : 'circle'}
              size={18}
              color={DARKER_GREY}
            />
          )}
        </View>
        <View>
          <Text numberOfLines={1} style={styles.adminStatus}>
            {isAdmin && <Text>Group Administrator</Text>}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
