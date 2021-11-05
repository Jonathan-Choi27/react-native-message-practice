export const BLUE = '#3777F0';
export const WHITE = 'white';
export const GREY = 'lightgrey';
export const BLACK = 'black';
export const GREEN = 'green';
export const LIGHT_GREY = '#F2F2F2';
export const BORDER_GREY = '#DEDEDE';
export const DARKER_GREY = '#595959';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
