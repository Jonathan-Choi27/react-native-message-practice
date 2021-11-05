import { StyleSheet, Dimensions } from 'react-native';

import { BLUE, GREY, LIGHT_GREY } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: '75%',
    alignItems: 'flex-end',
  },
  messageReply: {
    backgroundColor: LIGHT_GREY,
    padding: 5,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: BLUE,
  },
  image: {
    width: width * 0.45,
    aspectRatio: 4 / 3,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
  },
  leftContainer: {
    backgroundColor: BLUE,
    marginLeft: 10,
    marginRight: 'auto',
  },
  rightContainer: {
    backgroundColor: GREY,
    marginLeft: 'auto',
    marginRight: 10,
  },
});

export default styles;
