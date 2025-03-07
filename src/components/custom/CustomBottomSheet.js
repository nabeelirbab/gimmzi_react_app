import React, {useRef, useEffect, useContext} from 'react';
import {Animated, View, Dimensions, TouchableOpacity, Text} from 'react-native';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts} from '../../themes/Themes';
import {GimmziContext} from '../../utils/helper/GimmziBoundary';

const {height: screenHeight} = Dimensions.get('window');

const CustomBottomSheet = ({
  onBackdropPress,
  children,
  radius = 0,
  height = normalize(150),
}) => {
  const context = useContext(GimmziContext);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    context.getStatesData(isVisible => {
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
    });
  }, [context]);

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
        shadowColor: Colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 6,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: normalize(15),
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.ball_blue,
            height: normalize(36),
            paddingHorizontal: normalize(18),
            borderRadius: normalize(5),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: Colors.white,
              fontFamily: Fonts.InterMedium,
              fontSize: normalize(15),
            }}>
            Results show 655 apartment homes
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default CustomBottomSheet;
