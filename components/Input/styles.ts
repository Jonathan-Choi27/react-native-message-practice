import { StyleSheet } from 'react-native';

import { BLUE, BORDER_GREY, LIGHT_GREY } from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sendImageContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER_GREY,
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 10,
    alignSelf: 'center',
  },
  progress: {
    height: 5,
    borderRadius: 5,
    backgroundColor: BLUE,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: LIGHT_GREY,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    alignItems: 'center',
    padding: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    backgroundColor: BLUE,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
