import React from 'react';
import {StatusBar, SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Colors} from '../../themes/Themes';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const MyStatusBar = ({backgroundColor = Colors.white, ...props}) => (
  <View
    style={[
      {
        height: STATUSBAR_HEIGHT,
      },
      {backgroundColor},
    ]}>
    <SafeAreaView>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        {...props}
        barStyle={props?.barStyle ? props?.barStyle : 'dark-content'}
      />
    </SafeAreaView>
  </View>
);

export default MyStatusBar;

MyStatusBar.propTypes = {
  backgroundColor: PropTypes.string,
  barStyle: PropTypes.string,
  height: PropTypes.number,
};
