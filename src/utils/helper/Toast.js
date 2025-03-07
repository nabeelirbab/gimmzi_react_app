import Snackbar from 'react-native-snackbar';

export const showMessage = message => {
  if (message !== undefined && message !== '') {
    return Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
    });
  };
};
