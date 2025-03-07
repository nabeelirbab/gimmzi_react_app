/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {View, Image, StyleSheet, Dimensions, FlatList} from 'react-native';
import PaginationDot from 'react-native-animated-pagination-dot';
import {Colors, Images} from '../../themes/Themes';
import normalize from '../../utils/orientation/normalize';
const {width} = Dimensions.get('window');

const ImageSlider = ({data, autoSlider = false}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (autoSlider) {
      interval = setInterval(() => {
        setCurrentIndex(prevIndex =>
          prevIndex === data.length - 1 ? 0 : prevIndex + 1,
        );
        // Automatically scroll to the next image
        flatListRef.current.scrollToIndex({
          animated: true,
          index: currentIndex === data.length - 1 ? 0 : currentIndex + 1,
        });
      }, 3000); // Change autoplay interval as needed
    }
    return () => {
      if (autoSlider) {
        clearInterval(interval);
      }
    };
  }, [autoSlider, currentIndex]);

  const renderItem = ({item}) => (
    <Image source={Images.img1} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        scrollEnabled={false}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentIndex(newIndex);
        }}
      />
      <View style={styles.pagination}>
        <PaginationDot
          activeDotColor={Colors.ball_blue}
          curPage={currentIndex}
          maxPage={data.length}
          sizeRatio={1.2}
          inactiveDotColor={Colors.white}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: normalize(6),
    alignSelf: 'center',
  },
});

export default ImageSlider;
