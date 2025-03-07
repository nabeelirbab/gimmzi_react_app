import React, {useRef, useEffect, useContext} from 'react';
import {
  Animated,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts, hexToRGB} from '../../themes/Themes';
import {GimmziContext} from '../../utils/helper/GimmziBoundary';

const {height: screenHeight} = Dimensions.get('window');

const CustomBottomView = ({
  isVisible = false,
  children = null,
  radius = 0,
  height = normalize(150),
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 85,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        height: height,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        backgroundColor: Colors.white,
        transform: [{translateY: slideAnim}],
        shadowColor: hexToRGB(Colors.black, Platform.OS == 'android' ? 1 : 0.3),
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: normalize(10),
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        {children}
      </View>
    </Animated.View>
  );
};

export default CustomBottomView;
