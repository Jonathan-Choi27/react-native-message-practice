import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import Amplify, { Auth, DataStore, Hub } from 'aws-amplify';
import config from './aws-exports';
// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { Message, User } from './models';

Amplify.configure({ ...config, Analytics: { disabled: true } });

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [user, setUser] = useState<User | null>(null);

  const UPDATE_INTERVAL = 30 * 60 * 1000;

  useEffect(() => {
    const listener = Hub.listen('datastore', async (hubData) => {
      const { event, data } = hubData.payload;
      if (
        event === 'outboxMutationProcessed' &&
        data.model === Message &&
        !['DELIVERED', 'READ'].includes(data.element.status)
      ) {
        DataStore.save(
          Message.copyOf(data.element, (updated) => {
            updated.status = 'DELIVERED';
          })
        );
      }
    });

    return () => listener();
  }, []);

  useEffect(() => {
    if (!user) return;

    const subscription = DataStore.observe(User, user.id).subscribe((msg) => {
      if (msg.model === User && msg.opType === 'UPDATE') {
        setUser(msg.element);
      }
    });

    return () => subscription.unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      await updateLastOnline();
    }, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [user]);

  const fetchUser = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const user = await DataStore.query(User, userData.attributes.sub);
    if (user) setUser(user);
  };

  const updateLastOnline = async () => {
    if (!user) return;

    const response = await DataStore.save(
      User.copyOf(user, (updated) => {
        updated.lastOnlineAt = +new Date();
      })
    );
    setUser(response);
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ActionSheetProvider>
          <Navigation colorScheme={colorScheme} />
        </ActionSheetProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
