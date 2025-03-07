import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = props => {
  return (
    <View>
      <View>
        <Text style={styles.text}>This is a gradiented text</Text>
        <Text style={styles.text}>This is a gradiented text</Text>
        <Text style={styles.text}>This is a gradiented text</Text>
        <Text style={styles.text}>This is a gradiented text</Text>
        <Text style={styles.text}>This is a gradiented text</Text>
      </View>
      <LinearGradient
        start={{x: 0.0, y: 0.0}}
        end={{x: 0.0, y: 1.0}}
        locations={[0.0, 1.0]}
        colors={['red', 'green']} //<-- last 2 chars from color control the opacity
        useViewFrame={false}
        style={styles.gradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 14,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default GradientText;
