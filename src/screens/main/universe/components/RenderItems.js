import { View, Dimensions, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import normalize from '../../../../utils/orientation/normalize';
import { Colors } from '../../../../themes/Themes';
import PaginationDot from 'react-native-animated-pagination-dot';
import StoreItem from './StoreItem';
import { setIndexOfDeals } from '../../../../redux/slice/universe.slice';
import { useAppDispatch, useAppSelector } from '../../../../redux';

const { width } = Dimensions.get('window');

const RenderItems = ({
  buisnessItem,
  onClickFavorite = () => { },
  onClickWallet = () => { },
  onScroll = () => { },
  updateList = () => { },
  scrollOffset = 0,
  source = {}
}) => {
  const indexOfItem = useAppSelector(state => state.universe.index);
  const dispatch = useAppDispatch();
  // const isFocused=useIsFocused();
  const flatRef = useRef(null);
  const [index, setIndex] = useState(0);
  // console.log("buisnessItem",buisnessItem);

  // Combine deals and loyalty items
  const arr = [
    ...(buisnessItem?.deals || []).map(item => ({ ...item, type: 'deals' })),
    ...(buisnessItem?.loyalty || []).map(item => ({ ...item, type: 'loyalty' })),
  ];

  // // Flag to track initial scroll to saved index
  // const initialScrollDone = useRef(false);

  // // Scroll to saved index on initial render or data change
  // useEffect(() => {
  //   if (flatRef.current && indexOfItem >= 0 && !initialScrollDone.current) {
  //     flatRef.current.scrollToIndex({animated: false, index: indexOfItem});
  //     initialScrollDone.current = true; // Avoid further scrolls on re-renders
  //   }
  // }, [indexOfItem, arr.length]);

  React.useEffect(() => {
    if (flatRef.current) {
      flatRef.current.scrollToOffset({ offset: scrollOffset, animated: false });
    }
  }, [scrollOffset]);

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  const handleScrollEnd = event => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== index) {
      setIndex(newIndex);
      // dispatch(setIndexOfDeals(newIndex));
    }
  };

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const nonHeadquartersLocations = buisnessItem?.locations?.filter(
    location => location?.location_type !== "Headquarters"
  ) || [];

  console.log('nonHeadquartersLocations', nonHeadquartersLocations)

  const renderItem = useCallback(
    ({ item, index }) => (

      <View style={{ width }}>
        <StoreItem
          item={item}
          buisness={{
            name: buisnessItem.business_name,
            // location: buisnessItem.main_location.full_location,
            location: nonHeadquartersLocations[index]?.full_location,
            distance: buisnessItem.distance,
            business_id: buisnessItem.id,
            is_favourite: item,
            main_location: buisnessItem.main_location,
            business_type: buisnessItem.business_type,
            logoImage: buisnessItem?.logo_image
          }}
          data={arr}
          onPressFavorite={() => onClickFavorite(item)}
          onPressWallet={() => onClickWallet(item)}
        // source={source}
        />
      </View>
    ),
    [arr, buisnessItem, onClickFavorite, onClickWallet],
  );

  console.log('buisnessItem', buisnessItem)

  return (
    <View>
      <FlatList
        ref={flatRef}
        data={arr}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout} // Optimized scrolling
        onMomentumScrollEnd={handleScrollEnd} // Track scroll end
        nestedScrollEnabled
        onScroll={
          event => onScroll(event.nativeEvent.contentOffset.x) // Track scroll offset
        }
        scrollEventThrottle={16}
      />
      {arr.length > 1 && (
        <View
          style={{
            alignSelf: 'center',
            marginBottom: normalize(16),
          }}>
          <PaginationDot
            activeDotColor={Colors.ball_blue}
            curPage={index}
            maxPage={arr.length}
            sizeRatio={1.0}
            inactiveDotColor={Colors.black}
          />
        </View>
      )}
    </View>
  );
};

export default RenderItems;
