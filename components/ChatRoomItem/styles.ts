import { StyleSheet } from 'react-native';

import { BLUE } from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  badgeContainer: {
    backgroundColor: BLUE,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 50,
    top: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    color: 'grey',
  },
});

export default styles;
