import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  lastOnlineText: {
    marginLeft: 10,
    marginRight: 5,
  },
});

export default styles;
