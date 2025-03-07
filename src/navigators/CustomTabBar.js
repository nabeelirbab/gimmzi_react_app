import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Fonts, hexToRGB } from '../themes/Themes';
import normalize from '../utils/orientation/normalize';
import { horizontalScale } from '../utils/orientation/scaleDimensions';

const TabItem = React.memo(({ label, isFocused, onPress, onLongPress, onLayout }) => {
  const color = useSharedValue(isFocused ? Colors.ball_blue : Colors.river_bed);

  useEffect(() => {
    color.value = withTiming(isFocused ? Colors.ball_blue : Colors.river_bed, {
      duration: 250,
    });
  }, [isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: color.value,
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0, {
        duration: 250,
      }),
    };
  });

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      onLayout={onLayout}
      style={{
        paddingVertical: normalize(15),
      }}>
      <Animated.Text
        style={[
          animatedTextStyle,
          {
            textAlign: 'center',
            fontFamily: Fonts.InterMedium,
            fontSize: normalize(13),
            paddingHorizontal: horizontalScale(13),
          },
        ]}>
        {label === 'LoyaltyPunchCards' ? 'Loyalty Punch Cards' : label}
      </Animated.Text>
      <Animated.View
        style={[
          animatedBorderStyle,
          {
            width: '100%',
            borderBottomColor: Colors.ball_blue,
            borderBottomWidth: 2,
            position: 'absolute',
            bottom: 0,
          },
        ]}
      />
    </TouchableOpacity>
  );
});

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  position,
}) {
  const scrollViewRef = useRef(null);
  const tabItemRefs = useRef([]);

  const onTabLayout = (event, index) => {
    tabItemRefs.current[index] = event.nativeEvent.layout;
  };

  useEffect(() => {
    if (tabItemRefs.current[state.index] && scrollViewRef.current) {
      const { width: tabWidth, x: tabX } = tabItemRefs.current[state.index];
      scrollViewRef.current.measure((fx, fy, width, height, px, py) => {
        const scrollX = tabX - width / 2 + tabWidth / 2;
        scrollViewRef.current.scrollTo({
          x: scrollX,
          animated: true,
        });
      });
    }
  }, [state.index]);

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderBottomColor: hexToRGB('#000000', 0.1),
        borderBottomWidth: normalize(0.5),
        borderTopColor: hexToRGB('#000000', 0.5),
        borderTopWidth: normalize(0.2),
        width: '100%',
      }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={{ justifyContent: 'center',
          paddingHorizontal: normalize(18)
         }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabItem
              key={index}
              label={label}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              onLayout={(event) => onTabLayout(event, index)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
