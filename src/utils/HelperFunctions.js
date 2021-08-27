import Snackbar from 'react-native-snackbar';
import {successColor, errorColor, appColor, warningColor} from '../options';

export const showSnackbar = (type, message) => {
  switch (type) {
    case 'success':
      return Snackbar.show({
        text: message,
        backgroundColor: successColor,
        textColor: '#fff',
      });
    case 'danger':
      return Snackbar.show({
        text: message,
        backgroundColor: errorColor,
        textColor: '#fff',
      });
    case 'warning':
      return Snackbar.show({
        text: message,
        backgroundColor: warningColor,
        textColor: '#fff',
      });
    default:
      return Snackbar.show({
        text: message,
        backgroundColor: appColor,
        textColor: '#fff',
      });
  }
};
