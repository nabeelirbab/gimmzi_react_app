import React, {useRef, useState} from 'react';
import {View, ScrollView, Text, StyleSheet, Dimensions} from 'react-native';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts} from '../../themes/Themes';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/orientation/scaleDimensions';

const CONTAINER_HEIGHT = moderateScale(70);
const MAIN_HEIGHT = moderateScale(125);

const CustomScrollView = ({content = '', style = {}}) => {
  const scrollViewRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const handleContentSizeChange = (width, height) => {
    setContentHeight(height);
  };

  const handleScroll = event => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  const indicatorHeight =
    contentHeight > 0
      ? CONTAINER_HEIGHT * (CONTAINER_HEIGHT / contentHeight)
      : 0;
  const indicatorPosition =
    contentHeight > 0 ? scrollY * (CONTAINER_HEIGHT / contentHeight) : 0;

  return (
    <View style={[styles.container, style]}>
      {content !== '' ? (
        <>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={handleContentSizeChange}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}>
            <Text style={styles.text}>{content}</Text>
          </ScrollView>
          <View style={styles.indicatorWrapperContaoner}>
            <View style={styles.indicatorWrapper}>
              <View
                style={[
                  styles.indicator,
                  {height: indicatorHeight, top: indicatorPosition},
                ]}
              />
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MAIN_HEIGHT,
    flexDirection: 'row',
    borderColor: Colors.dawn_pink,
    borderWidth: normalize(1),
    overflow: 'hidden',
    borderRadius: normalize(6),
    padding: verticalScale(12),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    width: '93%',
  },
  text: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: horizontalScale(14),
  },
  indicatorWrapperContaoner: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingVertical: normalize(10),
    backgroundColor: Colors.catskill_white,
  },
  indicatorWrapper: {
    // position: 'absolute',
    // right: 0,
    // top: 0,
    // bottom: 0,
    height: '100%',
    width: normalize(8),
    justifyContent: 'center',
    backgroundColor: Colors.catskill_white,
  },
  indicator: {
    position: 'absolute',
    width: normalize(8),
    backgroundColor: Colors.iron,
    borderRadius: normalize(8),
  },
});

export default CustomScrollView;
