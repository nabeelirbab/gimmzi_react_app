import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
// import {useDispatch} from 'react-redux';
// import {getData} from './src/helper/LocalStore';
// import constants from './src/utils/constants';
// import {getToken} from './src/redux/reducer/AuthReducer';
import StackNavigation from './src/navigators/StackNavigation';
import Testing from './src/Testing';

const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   setTimeout(() => {
  //     getData(constants.TOKEN, res => {
  //       if (res !== null) {
  //         dispatch(getToken(res));
  //       } else {
  //         dispatch(getToken(null));
  //       }
  //     });
  //   }, 2000);
  // }, []);

  return <StackNavigation />;
};

export default App;