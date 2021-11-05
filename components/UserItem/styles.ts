import { StyleSheet } from 'react-native';
import { LIGHT_GREY } from '../../constants/Colors';

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  adminStatus: {
    fontSize: 14,
    color: 'black',
  },
});

export default styles;
