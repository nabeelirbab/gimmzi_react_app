import React from 'react';
import {ActivityIndicator, SafeAreaView, Dimensions, View} from 'react-native';
import PropTypes from 'prop-types';
import {Colors, hexToRGB} from '../../themes/Themes';

export default function Loader({visible = false}) {
  return visible ? (
    <SafeAreaView
      style={{
        flex: 1,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: Dimensions.get('window').height,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          //   backgroundColor: hexToRGB('#000',0.5),
          height: 100,
          width: 100,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
        }}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    </SafeAreaView>
  ) : null;
}

Loader.propTypes = {
  visible: PropTypes.bool,
};
