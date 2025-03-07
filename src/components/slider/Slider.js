import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Text,
  Platform,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts} from '../../themes/Themes';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/orientation/scaleDimensions';
import { showMessage } from '../../utils/helper/Toast';

const Slider = ({
  minValue = 0,
  maxValue = 100,
  value = 0,
  setValue = () => {},
  width = normalize(280),
  containerHeight = verticalScale(40),
  height = moderateScale(12),
  activeColor = '#2196F3',
  deactiveColor = '#dcdcdc',
}) => {
  // const [value, setSliderValue] = useState(minValue);
  const pan = useRef(new Animated.ValueXY()).current;
  const startX = useRef(0);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const tooltipText = useRef(new Animated.Value(0)).current;

  const showTooltip = () => {
    // setTooltipVisible(true);
    Animated.timing(tooltipText, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideTooltip = () => {
    // setTooltipVisible(false);
    Animated.timing(tooltipText, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // setTooltipVisible(false)
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startX.current = pan.x._value; // Store the initial position of the thumb
        showTooltip();
      },
      onPanResponderMove: (e, gestureState) => {
        let newX = startX.current + gestureState.dx;
        const thumbWidth = normalize(20); // Adjust this according to your thumb width
        const maxPosition = width - thumbWidth; // Calculate the maximum position for the thumb

        if (newX < 0) newX = 0;
        if (newX > maxPosition) newX = maxPosition;

        pan.setValue({x: newX, y: 0});

        const range = maxValue - minValue;
        const newValue = parseFloat(
          ((newX / maxPosition) * range + minValue).toFixed(2),
        ); // Calculate float value with two decimal places
        setValue(newValue);
        // setSliderValue(newValue);
      },
      onPanResponderRelease: () => {
        // Optionally handle release
        hideTooltip();
      },
    }),
  ).current;

  useEffect(() => {
    if (maxValue >= value) {
      const thumbWidth = normalize(20);
      const maxPosition = width - thumbWidth;
      const range = maxValue - minValue;

      // Calculate the thumb's position based on the current value
      const newX = ((value - minValue) / range) * maxPosition;

      // Check if pan is ready before starting animation
      if (pan && pan.setValue) {
        Animated.timing(pan, {
          toValue: {x: newX, y: 0},
          duration: 300, // Animation duration for smooth movement
          useNativeDriver: false, // Set to false to support width animations
        }).start();
      }
    }else{
      showMessage(`Value too high. Max is ${maxValue}.`)
    }
  }, [value]); // Update when the `value` prop changes

  // Calculate maximum translateX for the tooltip
  const tooltipPosition = pan.x.interpolate({
    inputRange: [0, width - normalize(20)],
    outputRange: [0, width - moderateScale(100)],
    extrapolate: 'clamp',
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={{
          width: width,
          height: containerHeight,
          justifyContent: 'center',
          marginTop: verticalScale(15),
        }}>
        <View
          style={{
            height: height,
            backgroundColor: value === maxValue ? activeColor : deactiveColor,
            position: 'absolute',
            width: '100%',
            borderRadius: normalize(10),
          }}
        />
        <Animated.View
          style={{
            height: height,
            backgroundColor: activeColor,
            position: 'absolute',
            width: pan.x.interpolate({
              inputRange: [0, width],
              outputRange: [0, width],
              extrapolate: 'clamp',
            }),
            borderTopLeftRadius: normalize(10),
            borderBottomLeftRadius: normalize(10),
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            width: normalize(20),
            height: normalize(20),
            borderRadius: normalize(20),
            backgroundColor: deactiveColor,
            transform: [{translateX: pan.x}],
            borderColor: activeColor,
            borderWidth: normalize(4),
            left: value === maxValue ? 0 : normalize(-1),
          }}
          // {...panResponder.panHandlers}
        >
          {tooltipVisible && (
            <Animated.View
              style={{
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderLeftWidth: moderateScale(6),
                borderRightWidth: moderateScale(6),
                borderBottomWidth: moderateScale(10),
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: Colors.flat_blue,
                transform: [{rotate: '180deg'}],
                top: verticalScale(-10),
              }}
            />
          )}
        </Animated.View>

        {tooltipVisible && (
          <Animated.View
            style={{
              position: 'absolute',
              top: moderateScale(Platform.OS == 'android' ? -22 : -20), // Adjust the top position of the tooltip as needed
              left: tooltipPosition, // Use the interpolated value for tooltip positioning
              backgroundColor: Colors.flat_blue,
              borderRadius: normalize(5),
              padding: verticalScale(6),
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.InterMedium,
                fontSize: moderateScale(12),
              }}>{`$${value.toFixed(2)} of $${maxValue.toFixed(2)}`}</Text>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Slider;
