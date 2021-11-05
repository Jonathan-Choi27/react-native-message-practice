import { StyleSheet } from 'react-native';
import { BLUE, BORDER_GREY, WHITE } from '../../constants/Colors';

const styles = StyleSheet.create({
  sendAudioContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_GREY,
    borderRadius: 10,
    backgroundColor: WHITE,
  },
  audioProgressBackground: {
    flex: 1,
    height: 2.5,
    backgroundColor: BORDER_GREY,
    borderRadius: 5,
    margin: 10,
  },
  audioProgressForeground: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: BLUE,
    position: 'absolute',
    top: -3,
  },
});

export default styles;
