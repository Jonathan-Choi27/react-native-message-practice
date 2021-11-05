import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { BLACK } from '../../../constants/Colors';

export default function HeaderRight() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate('Users')}
      >
        <SimpleLineIcons name="pencil" size={24} color={BLACK} />
      </TouchableOpacity>
    </View>
  );
}
