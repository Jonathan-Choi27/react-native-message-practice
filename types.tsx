import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ChatRoom, Message } from './models';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Root Stack

export type RootStackParamList = {
  Home: undefined;
  ChatRoom: { id: string };
  GroupInfo: { id: string };
  Users: undefined;
};

// Screen Props

export type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export type ChatRoomScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChatRoom'>;
  route: RouteProp<RootStackParamList, 'ChatRoom'>;
};

export type UsersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Users'>;
};

// Components

export type ChatRoomItemProps = {
  chatRoom: {
    id: string;
    users: {
      id: string;
      name: string;
      imageUri: string;
    }[];
    lastMessage: {
      id: string;
      content: string;
      createdAt: string;
    };
    imageUri: string;
    name: string;
    newMessages?: number;
    chatRoomLastMessageId: string;
  };
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

enum MessageStatus {
  DELIVERED = 'DELIVERED',
  SENT = 'SENT',
  READ = 'READ',
}

export type MessageProps = {
  message: {
    id: string;
    content: string;
    createdAt?: string;
    userID?: string;
    image?: string;
    audio?: string;
    status?: MessageStatus;
  };
  setAsMessageReply: () => void;
};

export type UserItemProps = {
  user: {
    id: string;
    name: string;
    imageUri?: string; //make sure to change the optional chaining after setting the default img
    status?: string;
  };
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isAdmin: boolean;
};

export type HomeHeaderLeftProps = {
  uri: string;
};

export type ChatHeaderTitleProps = {
  id: string;
};

export type InputProps = {
  chatRoom: ChatRoom;
};

export type AudioPlayerProps = {
  soundURI?: string;
};

export type NewGroupButtonProps = {
  onPress: () => void;
};
