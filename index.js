/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import GimmziBoundary from './src/utils/helper/GimmziBoundary';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from './src/redux';

LogBox.ignoreAllLogs();

const GIMMZI = () => {
  return (
    <Provider store={store}>
      <GimmziBoundary>
        <App />
      </GimmziBoundary>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => GIMMZI);
