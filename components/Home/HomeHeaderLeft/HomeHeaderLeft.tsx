import React from 'react';
import { Alert, Image, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';

import { HomeHeaderLeftProps } from '../../../types';
import styles from './styles';

export default function HeaderLeft({ uri }: HomeHeaderLeftProps) {
  const signOut = () => {
    Alert.alert('Signing Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => Auth.signOut() },
    ]);
  };

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={signOut}>
      <Image
        source={{
          uri,
        }}
        style={styles.image}
      />
    </TouchableOpacity>
  );
}
