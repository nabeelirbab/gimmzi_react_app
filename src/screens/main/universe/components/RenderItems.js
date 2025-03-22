import { View, Dimensions, FlatList } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import normalize from '../../../../utils/orientation/normalize';
import { Colors } from '../../../../themes/Themes';
import PaginationDot from 'react-native-animated-pagination-dot';
import StoreItem from './StoreItem';
import { setIndexOfDeals } from '../../../../redux/slice/universe.slice';
import { useAppDispatch, useAppSelector } from '../../../../redux';
import Geolocation from "react-native-geolocation-service";
import { getDistance } from "geolib";

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
  const [location, setLocation] = useState(null);

  // Get user location once
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        console.log("Error getting location:", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);
  // console.log("buisnessItem",buisnessItem);

  // Combine deals and loyalty items
  // const arr = [
  //   ...(buisnessItem?.deals || []).map(item => ({ ...item, type: 'deals' })),
  //   ...(buisnessItem?.loyalty || []).map(item => ({ ...item, type: 'loyalty' })),
  // ];

  // const sortedArr = arr?.sort((a, b) => a.distance - b.distance);


  const sortedArray = useMemo(() => {
    if (!buisnessItem || !location) return [];

    const { latitude, longitude } = location;

    const arr = [
      ...(buisnessItem?.deals || []).map(item => ({ ...item, type: 'deals' })),
      ...(buisnessItem?.loyalty || []).map(item => ({ ...item, type: 'loyalty' })),
    ];


    return arr?.sort((a, b) =>
      getDistance({ latitude, longitude }, a) -
      getDistance({ latitude, longitude }, b)
    );
  }, [buisnessItem, location]);

  // console.log('sortedArr---->',sortedArr)

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

  const renderItem = useCallback(
    ({ item, index }) => (

      <View style={{ width }}>
        <StoreItem
          item={item}
          index={index}
          buisness={{
            name: buisnessItem.business_name,
            location: buisnessItem.main_location.full_location,
            distance: buisnessItem.distance,
            business_id: buisnessItem.id,
            is_favourite: item,
            main_location: buisnessItem.main_location,
            business_type: buisnessItem.business_type,
            logoImage: buisnessItem?.logo_image,
            locations: buisnessItem?.locations
          }}
          data={sortedArray}
          onPressFavorite={() => onClickFavorite(item)}
          onPressWallet={() => onClickWallet(item)}
        // source={source}
        />
      </View>
    ),
    [buisnessItem, onClickFavorite, onClickWallet],
  );

  return (
    <View>
      <FlatList
        ref={flatRef}
        data={sortedArray}
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
      {sortedArray.length > 1 && (
        <View
          style={{
            alignSelf: 'center',
            marginBottom: normalize(16),
          }}>
          <PaginationDot
            activeDotColor={Colors.ball_blue}
            curPage={index}
            maxPage={sortedArray.length}
            sizeRatio={1.0}
            inactiveDotColor={Colors.black}
          />
        </View>
      )}
    </View>
  );
};

export default RenderItems;
