import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Text } from 'react-native';

import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import HomeHeaderLeft from '../components/Home/HomeHeaderLeft';
import HomeHeaderRight from '../components/Home/HomeHeaderRight';
import ChatHeaderTitle from '../components/Chat/ChatHeaderTitle';

import Home from '../screens/Home';
import ChatRoom from '../screens/ChatRoom';
import Users from '../screens/Users';
import GroupInfo from '../screens/GroupInfo';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitleAlign: 'center',
          headerLeft: () => (
            <HomeHeaderLeft uri="https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg" />
          ),
          headerTitle: () => <Text>RN Message</Text>,
          headerRight: () => <HomeHeaderRight />,
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={({ route }) => ({
          headerTitle: () => <ChatHeaderTitle id={route.params?.id} />,
        })}
      />
      <Stack.Screen name="GroupInfo" component={GroupInfo} />
      <Stack.Screen
        name="Users"
        component={Users}
        options={{
          title: 'Users',
        }}
      />
    </Stack.Navigator>
  );
}
