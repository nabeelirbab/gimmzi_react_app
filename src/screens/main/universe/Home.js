import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Keyboard,
  RefreshControl,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Colors, Fonts, Icons, Images} from '../../../themes/Themes';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import normalize from '../../../utils/orientation/normalize';
import Header from '../../../components/importent/Header';
import Search from '../../../components/importent/Search';
import AdsItem from './components/AdsItem';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import {
  getUserDetails,
  updateCurrentLocation,
} from '../../../utils/service/UserService';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {GimmziContext} from '../../../utils/helper/GimmziBoundary';
import {
  setUserAddress,
  setUserCurrentLocation,
} from '../../../redux/slice/user.slice';
import {
  addFavourite,
  dealsLoyalityAddFavourite,
  getUniverseAllCategory,
  getUniverseAllDistance,
  getUniverseAllTypes,
  getUniverseBusinessList,
} from '../../../utils/service/UniverseService';
import {showMessage} from '../../../utils/helper/Toast';
import RenderItems from './components/RenderItems';
import {
  moderateScale,
  verticalScale,
} from '../../../utils/orientation/scaleDimensions';
import Picker from '../../../components/modal/Picker';
import {decodeHTMLEntities} from '../../../utils/helper/Validation';
import Loader from '../../../components/custom/Loader';
import _ from 'lodash';
import {navigateToMyHubScreen} from '../../../utils/helper/RootNaivgation';
import {
  addWallet,
  getEarnedLoyaltyPoints,
  getLastRedeemLoyality,
  getWalletCount,
} from '../../../utils/service/WalletService';
import UpdateLocation from './components/UpdateLocation';
import {
  setIndexOfDeals,
  setSelectCategory,
} from '../../../redux/slice/universe.slice';

const {height} = Dimensions.get('window');

const Home = props => {
  const {navigation, route} = props;
  const context = useContext(GimmziContext);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const authState = useAppSelector(state => state.auth);
  const universeState = useAppSelector(state => state.universe);
  const lastRedeemState = useAppSelector(state => state.wallet.lastDate);
  const updatedPoint = useAppSelector(state => state.wallet.updatedPoint);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectFilterIdx, setSelectFilterIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const scrollPositions = useRef({});
  const [lastDate, setLastDate] = useState('');
  const [isFav, setIsFav] = useState([]);
  console.log('universeState', universeState);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLocationUpdated, setLocationUpdated] = useState(false);
  const listRef = useRef();
  const [selectedDistance, setSelectedDistance] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);
  const [location, setLocation] = useState([]);
  const isLoggedIn = authState.isLoggedIn;
  console.log('location', location);

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     setRefreshing(false);
  //     getList();
  //   }, 800);
  // }, []);

  useEffect(() => {
    if (universeState) {
      console.log('universeState useEffect', universeState);
    }
  }, [universeState]);

  useEffect(() => {
    const timestamp = lastRedeemState?.created_at;

    if (!timestamp) {
      setLastDate('0d 0h 0m 0s');
    } else {
      const cleanedTimestamp = timestamp.replace(/Z$/, '');
      const date = new Date(cleanedTimestamp);
      const expiryDate = date.getTime() + 45 * 24 * 60 * 60 * 1000;

      // Add 45 days to the date

      // Format the date to ISO string and remove milliseconds
      const formattedDate = new Date(expiryDate)
        .toISOString()
        .replace(/Z$/, '');
      console.log('formattedDate', formattedDate);

      setLastDate(formattedDate);
    }
  }, [lastRedeemState]);

  const [data, setData] = useState({
    list: [],
    category: [],
    type: [],
    distance: [],
  });
  console.log('data', data);

  const [isVisible, setIsVisible] = useState({
    status: false,
    type: '',
  });
  
  const [isFilter, setFilter] = useState({
    category: '',
    categoryLabel: 'Category',
    type: '',
    typeLabel: 'Type',
    distance: '',
    distanceLabel: 'Distance',
  });
  const [isLocationVisible, setIsLocationVisible] = useState(false);

  /* on start */
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
     if(isLoggedIn){
      getProfile();
      getWalletDetails();
      getLoyaltyPoints();
      getLastRedeem();
      // getList();
     
     }
     setTimeout(getLiveLocation, 2000);
      // dispatch(setIndexOfDeals(0));
    }, []),
  );

  useEffect(() => {
    if (isLocationUpdated && isLoggedIn) {
      getList();
    }else{
      getListForGuest()
    }
  }, [isLocationUpdated]);

  const getListForGuest = useCallback(async (coords) => {
    console.log('Fetching data...');
    const obj = {
      lat:coords? coords?.latitude: location?.latitude,
      long:coords? coords?.longitude: location?.longitude,
    };
    const result = await dispatch(getUniverseBusinessList(obj));

    setData(pre => ({
      ...pre,
      list: result?.data ?? [],
    }));
  }, []);

  useEffect(() => {
    // Add listeners for keyboard events
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    // Clean up the listeners when the component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  const getLiveLocation = useCallback(async () => {
    console.log('getLiveLocation  -  -- - ');

    await context.getCurrentLocation(async coords => {
      console.log('coords', coords);
      setLocation(coords);

      if (coords) {
        if (!isLoggedIn) {
          getListForGuest(coords);
        } else {
          console.log('dispatch location');

          dispatch(setUserCurrentLocation(coords));
          const result = await dispatch(
            updateCurrentLocation({
              current_lat: coords?.latitude,
              current_long: coords?.longitude,
            }),
          );

          setLocationUpdated(true);
          context
            .getAddressFromCoords(coords?.latitude, coords?.longitude)
            .then(address => {
              if (address) {
                dispatch(
                  setUserAddress(
                    `${address?.city},${address?.state},${address?.country},${address?.postalCode}`,
                  ),
                );
              } else {
                console.log('Could not retrieve address.');
              }
            });

          if (!result?.success) {
            showMessage(result.message);
          }
        }
      }
    });
  }, [context, dispatch]);

  const getLoyaltyPoints = useCallback(() => {
    // fetch earned loyalty points
    dispatch(getEarnedLoyaltyPoints());
  }, []);

  // Fetch last redeem loyality
  const getLastRedeem = useCallback(() => {
    // fetch last redeem loyality
    dispatch(getLastRedeemLoyality());
  }, []);

  // Utility function to update state
  const updateState = useCallback((setter, key, value) => {
    setter(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  // State update functions
  const updateUniverseData = useCallback(
    (key, value) => updateState(setData, key, value),
    [],
  );

  
  const fetchData = useCallback(async (dispatchFn, dataKey) => {
    try {
      const result = await dispatch(dispatchFn());

      if (!result?.success) {
        showMessage(
          result?.message,
        );
        return null;
      }

      if (dataKey) {
        updateUniverseData(dataKey, result?.data);
      }
      return result;
    } catch (error) {
      // Handle network or unexpected errors
      console.error('Error fetching data:', error);
      showMessage('Network error, please check your connection.');
      return null;
    }
  }, []);

  const executeWithLoader = useCallback(async tasks => {
    setIsLoading(true);
    try {
      for (const task of tasks) {
        await task();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProfile = useCallback(() => fetchData(getUserDetails), []);
  const getWalletDetails = useCallback(() => fetchData(getWalletCount), []);
  // const getList = useCallback(
  //   () => fetchData(getUniverseBusinessList, 'list'),
  //   [],
  // );
  const getList = useCallback(() => {
    console.log('Fetching data...');
    fetchData(getUniverseBusinessList, 'list')
      .then(result => {
        console.log('Fetched data:', result);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getUniverseFilterData = useCallback(() => {
    executeWithLoader([
      () => fetchData(getUniverseAllCategory, 'category'),
      () => fetchData(getUniverseAllTypes, 'type'),
      () => fetchData(getUniverseAllDistance, 'distance'),
    ]);
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const updateWalletStatus = useCallback(
    (businessId, type, itemId, newStatus) => {
      setData(prevData => ({
        ...prevData,
        list: prevData.list.map(item => {
          if (item.id === businessId) {
            return {
              ...item,
              [type]: item[type].map(dealOrLoyaltyItem =>
                dealOrLoyaltyItem.id === itemId
                  ? {...dealOrLoyaltyItem, is_added_wallet: newStatus}
                  : dealOrLoyaltyItem,
              ),
            };
          }
          return item;
        }),
      }));
    },
    [],
  );

  
  const renderItem = useCallback(
    ({item, index}) =>
      item?.type === 'ads' ? (
        <AdsItem item={item} />
      ) : (
        <RenderItems
          buisnessItem={item}
          setSelectedId={setSelectedId}
          onClickFavorite={async item => {
            console.log(item, '++++++++++++item');
            setIsFav(item);
            let obj = {
              type: item?.type == 'deals' ? 'gimmziDeals' : 'loyaltyRewards',
            };

            if (item?.type == 'deals') {
              obj.deal_id = item?.id;
            } else {
              obj.loyalty_id = item?.id;
            }
            // console.log("add fav obj",obj);

            const result = await dispatch(dealsLoyalityAddFavourite(obj));
            showMessage(result.message);
            console.log('result fav pressed', result);

            if (result.success) {
              // getList();
              if(isFilter?.category||isFilter?.type||isFilter?.distance){
                setFilterApplied(prev => !prev);
              }else {
                getList();
              }
            }
          }}
          onClickWallet={async _item => {
            if (_item?.is_added_wallet) {
              navigateToMyHubScreen('MyWallet', {
                select: _item?.type == 'deals' ? 'Deals' : 'LoyaltyPunchCards',
              });
            } else {
              let business_id =
                _item?.type == 'deals'
                  ? _item?.business_id
                  : _item?.business_profile_id;
              let obj = {
                business_id: business_id,
                type: _item?.type == 'deals' ? 'gimmziDeals' : 'loyaltyRewards',
              };

              if (_item?.type == 'deals') {
                obj.deal_id = _item?.id;
              } else {
                obj.loyalty_id = _item?.id;
              }
              // console.log("addWallet obj",obj);
              const result = await dispatch(addWallet(obj));
              showMessage(result.message);
              if (result.success) {
                updateWalletStatus(business_id, _item?.type, _item?.id, true);
              }

              const countRes = await dispatch(getWalletCount());
            }
          }}
          onScroll={offset => {
            scrollPositions.current[index] = offset;
            // Save the scroll position
          }}
          scrollOffset={scrollPositions.current[index] || 0}
        />
      ),
    [data.list],
  );

  const FilterOptions = useCallback(
    () => (
      <View style={styles.v3}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingStart: '5%'}}>
          {[
            'all',
            isFilter?.categoryLabel,
            isFilter?.typeLabel,
            isFilter?.distanceLabel,
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                let types = ['all', 'category', 'type', 'distance'];
                setSelectFilterIdx(index);

                if (item !== 'all') {
                  setIsVisible({status: true, type: types[index]});
                } else {
                  setIsVisible(prev => ({...prev, status: false}));
                  let obj = {
                    category: '',
                    categoryLabel: 'Category',
                    type: '',
                    typeLabel: 'Type',
                    distance: '',
                    distanceLabel: 'Distance',
                  };
                  setFilter(obj);
                  dispatch(setSelectCategory(null));
                  setSelectedDistance('')
                  // setIsLoading(true);
                  // setTimeout(() => {
                    getList();
                  //   setIsLoading(false);
                  // }, 800);
                  navigation.dispatch(CommonActions.navigate('Home', {}));
                  setTimeout(() => {
                    listRef.current?.scrollToOffset({
                      offset: 0,
                      animated: true,
                    });
                  }, 600);
                }
              }}
              style={[
                {
                  backgroundColor:
                    selectFilterIdx === index ? Colors.ball_blue : undefined,
                  borderColor:
                    selectFilterIdx === index ? Colors.ball_blue : Colors.iron,
                },
                styles.filterContainer,
              ]}>
              <Text
                style={{
                  fontSize: normalize(12),
                  color:
                    selectFilterIdx === index ? Colors.white : Colors.river_bed,
                  fontFamily: Fonts.InterMedium,
                  textTransform: 'capitalize',
                }}>
                {item}
              </Text>
              <Image
                source={index === 0 ? Icons.filter : Icons.down_arrow}
                style={[
                  {
                    tintColor:
                      selectFilterIdx === index
                        ? Colors.white
                        : Colors.river_bed,
                    height: normalize(index === 0 ? 14 : 16),
                    width: normalize(index === 0 ? 14 : 16),
                  },
                  styles.filterImg,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    ),
    [selectFilterIdx, isFilter],
  );

  async function getUniverseBusinessUseFilter(_filter) {
    setIsLoading(true);
    const obj = {};

    if (_filter?.category) {
      obj.category_id = _filter?.category;
    }
    if (_filter?.type) {
      obj.type = _filter?.type;
    }
    if (_filter?.distance) {
      obj.distance_range = _filter?.distance;
    }
    if(!isLoggedIn){
      obj.lat=location?.latitude;
      obj.long=location?.longitude;
    }

    const result = await dispatch(getUniverseBusinessList(obj));

    setIsLoading(false);

    setData(pre => ({
      ...pre,
      list: result?.data ?? [],
    }));

    if (!result?.success) {
      showMessage(result.message);
      return null;
    }
  }

  // useEffect(() => {
  //   getUniverseFilterData();

  //   if (route?.params?.select === 'loyaltyRewards') {
  //     let typeFilter = {
  //       ...isFilter,
  //       type: 'loyaltyRewards',
  //       typeLabel: 'Loyalty Punch Cards',
  //     };
  //     // dispatch(setSelectCategory(null));
  //     setFilter(typeFilter);
  //     setSelectFilterIdx(2);
  //     setTimeout(() => getUniverseBusinessUseFilter(typeFilter), 500);
  //   } else {
  //     if (isFocused && universeState?.category) {
  //       setData(prevData => ({
  //         ...prevData,
  //         category: prevData.category?.map((item, i) => {
  //           return {
  //             ...item,
  //             isSelected: universeState?.selectCategory
  //               ? item?.id == universeState?.selectCategory?.id
  //               : false,
  //           };
  //         }),
  //       }));

  //       let obj = {...isFilter};
  //       obj.category =
  //         universeState?.selectCategory !== null
  //           ? universeState?.selectCategory?.id
  //           : '';
  //       obj.categoryLabel =
  //         universeState?.selectCategory !== null
  //           ? universeState?.selectCategory?.category_name
  //           : 'Category';

  //       setFilter(obj);
  //       setSelectFilterIdx(universeState?.selectCategory ? 1 : 0);
  //       setTimeout(() => getUniverseBusinessUseFilter(obj), 500);
  //     }
  //   }
  // }, [isFocused, route,universeState?.selectCategory]);

  useEffect(() => {
    if(isFocused){
    getUniverseFilterData();
  
    let updatedFilter = { ...isFilter };
  
    if (route?.params?.select === 'loyaltyRewards') {
      updatedFilter = {
        ...updatedFilter,
        type: 'loyaltyRewards',
        typeLabel: 'Loyalty Punch Cards',
      };
      setSelectFilterIdx(2);
    }
  
    // Preserve category if selected from universeState
    if (universeState?.selectCategory) {
      setData(prevData => ({
        ...prevData,
        category: prevData.category?.map(item => ({
          ...item,
          isSelected: item?.id === universeState?.selectCategory?.id,
        })),
      }));
  
      updatedFilter = {
        ...updatedFilter,
        category: universeState?.selectCategory?.id,
        categoryLabel: universeState?.selectCategory?.category_name
        ,
      };
  
      setSelectFilterIdx(1);
    }
  
    // Preserve distance if selected
    if (selectedDistance) {
      updatedFilter = {
        ...updatedFilter,
        distance: selectedDistance,
        distanceLabel: data?.distance?.find(item => item?.value === selectedDistance)?.text || 'Distance',
      };
      setSelectFilterIdx(3);
    }
  
    setFilter(updatedFilter);
    
    console.log('Updated Filter:', updatedFilter);
    setTimeout(() => getUniverseBusinessUseFilter(updatedFilter), 500);
  }

  }, [route,isFocused, universeState?.selectCategory, selectedDistance,filterApplied]);
  

  const FilterItem = ({item, index, type}) => {
    console.log('item FilterItem', item);

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        onPress={() => {
          setData(prevData => ({
            ...prevData,
            [isVisible.type]: prevData[isVisible.type]?.map((item, i) => {
              return {
                ...item,
                isSelected: index === i ? !item?.isSelected : false,
              };
            }),
          }));
        }}
        style={[
          {
            backgroundColor: item?.isSelected ? Colors.dark : Colors.white,
          },
          type !== 'category'
            ? styles.v5
            : {
                marginVertical: normalize(7),
                // height: normalize(100),
                width: '47.5%',
                borderRadius: normalize(6),
                borderColor: Colors.dawn_pink,
                borderWidth: normalize(1),
                padding: normalize(10),
              },
        ]}>
        {type == 'category' && (
          <View
            style={{
              height: Platform.OS == 'android' ? normalize(25) : normalize(30),
              width: Platform.OS == 'android' ? normalize(25) : normalize(30),
              backgroundColor: item?.isSelected
                ? Colors.white
                : Colors.dawn_pink,
              borderRadius: normalize(35),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={item?.icon_url ? {uri: item?.icon_url} : Icons.question}
              style={{
                resizeMode: 'contain',
                height:
                  Platform.OS == 'android' ? normalize(13) : normalize(16),
                width: Platform.OS == 'android' ? normalize(13) : normalize(16),
                tintColor: item?.isSelected
                  ? Colors.ball_blue
                  : Colors.river_bed,
              }}
            />
          </View>
        )}

        <Text
          style={{
            fontSize: Platform.OS == 'android' ? normalize(10) : normalize(11),
            fontFamily: Fonts.InterSemiBold,
            marginTop:
              type == 'category'
                ? Platform.OS == 'android'
                  ? normalize(8)
                  : normalize(10)
                : 0,
            color: item?.isSelected ? Colors.white : Colors.dark,
          }}>
          {item?.category_name || decodeHTMLEntities(item?.text)}
        </Text>
      </TouchableOpacity>
    );
  };

  // Main component rendering
  return (
    <View style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle="light-content" />
      <Loader visible={isLoading} />

      <KeyboardAvoidingView style={styles.conatiner}>
        <View style={styles.v1}>
          <Image source={Images.shadow_arrow} style={styles.imgArrow} />
          <Header targetDate={lastDate} />
          <Search onPressLocation={() => setIsLocationVisible(true)} />
        </View>
        <View style={styles.v2}>
          <FlatList
            ref={listRef}
            data={data?.list}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={FilterOptions}
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            ListEmptyComponent={<Text style={styles.txt}>No Data Found</Text>}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Filter */}
      <Picker
        isVisible={isVisible.status}
        onBackdropPress={() => {
          setIsVisible(pre => ({...pre, status: false}));
        }}
        height={verticalScale(300)}
        isVisibleBar
        backdropOpacity={0.4}>
        <View style={{flex: 1}}>
          <View style={styles.v6}>
            <Text style={styles.title}>{`Select ${isVisible.type}`}</Text>
            <TouchableOpacity
              // onPress={() => {
              //   const _category = data?.category?.find(
              //     item => item?.isSelected == true,
              //   );
              //   const _type = data?.type?.find(
              //     item => item?.isSelected == true,
              //   );
              //   const _distance = data?.distance?.find(
              //     item => item?.isSelected == true,
              //   );

              //   let obj = {
              //     category: _category !== undefined ? _category?.id : '',
              //     categoryLabel:
              //       _category !== undefined
              //         ? _category?.category_name
              //         : 'Category',
              //     distance: _distance !== undefined ? _distance?.value : '',
              //     distanceLabel:
              //       _distance !== undefined ? _distance?.text : 'Distance',
              //     type: _type !== undefined ? _type?.value : '',
              //     typeLabel: _type !== undefined ? _type?.text : 'Type',
              //   };

              //   setFilter(obj);
              //   if (
              //     _category == undefined &&
              //     _distance == undefined &&
              //     _type == undefined
              //   ) {
              //     setSelectFilterIdx(0);
              //   }
              //   setIsVisible(prev => ({...prev, status: false}));
              //   console.log("11111");

              //   setTimeout(() => getUniverseBusinessUseFilter(obj), 1000);

              //   if (isVisible.type === 'category') {
              //     dispatch(
              //       setSelectCategory(
              //         _category == undefined ? null : _category,
              //       ),
              //     );
              //   }

              //   setTimeout(() => {
              //     listRef.current?.scrollToOffset({offset: 0, animated: true});
              //     }, 1000);
              // }}
              onPress={() => {
                const _category = data?.category?.find(item => item?.isSelected);
                const _type = data?.type?.find(item => item?.isSelected);
                const _distance = data?.distance?.find(item => item?.isSelected);
              
                // Update selected distance in state
                if (_distance) {
                  setSelectedDistance(_distance?.value);
                }
              
                let newFilter = {
                  category: _category ? _category?.id : isFilter.category,
                  categoryLabel: _category ? _category?.category_name : isFilter.categoryLabel,
                  distance: _distance ? _distance?.value : selectedDistance, // Use state if no new selection
                  distanceLabel: _distance ? _distance?.text : isFilter.distanceLabel,
                  type: _type ? _type?.value : isFilter.type,
                  typeLabel: _type ? _type?.text : isFilter.typeLabel,
                };
              
                let selectedFilters = [];
                if (_category) {
                  selectedFilters.push('category');
                  setSelectFilterIdx(1);
                }
                if (_type) {
                  selectedFilters.push('type');
                  setSelectFilterIdx(2);
                }
                if (_distance || selectedDistance) {
                  selectedFilters.push('distance');
                  setSelectFilterIdx(3);
                }
                
                setFilter(newFilter);
                // setSelectFilterIdx(selectedIdx);
                setIsVisible(prev => ({ ...prev, status: false }));
              
                console.log('Applied Filters:', newFilter);
              
                setTimeout(() => getUniverseBusinessUseFilter(newFilter), 1000);
              
                setTimeout(() => {
                  listRef.current?.scrollToOffset({ offset: 0, animated: true });
                }, 1000);
              }}
              
              style={styles.touch}>
              <Image source={Icons.tick2} style={styles.img} />
            </TouchableOpacity>
          </View>
          {isVisible.type && (
            <>
              {isVisible.type === 'category' ? (
                <FlatList
                  style={{flex: 1}}
                  showsVerticalScrollIndicator={false}
                  data={data[isVisible.type]}
                  numColumns={2}
                  keyExtractor={keyExtractor}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                  contentContainerStyle={{
                    paddingBottom: normalize(30),
                    paddingTop: normalize(8),
                    width: '90%',
                    alignSelf: 'center',
                  }}
                  renderItem={({item, index}) => (
                    <FilterItem
                      index={index}
                      item={item}
                      key={index}
                      type={'category'}
                    />
                  )}
                />
              ) : (
                <ScrollView
                  style={{flex: 1}}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: normalize(30)}}>
                  <View style={styles.v4}>
                    {data[isVisible.type]?.map((item, index) => {
                      return (
                        <FilterItem index={index} item={item} key={index} />
                      );
                    })}
                  </View>
                </ScrollView>
              )}
            </>
          )}
        </View>
      </Picker>

      {/* Change Current Location */}
      <Picker
        isVisible={isLocationVisible}
        height={
          keyboardVisible && Platform.OS == 'android'
            ? verticalScale(500)
            : height
        }
        backdropOpacity={0}
        children={
          <UpdateLocation
            onClose={() => setIsLocationVisible(false)}
            onChangeLocation={() => {
              setTimeout(() => getList(), 1000);
            }}
          />
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    backgroundColor: Colors.dark,
    borderBottomLeftRadius: normalize(28),
    borderBottomRightRadius: normalize(28),
    height: Platform.OS == 'android' ? normalize(135) : normalize(140),
  },
  imgArrow: {
    height: Platform.OS == 'ios' ? normalize(120) : normalize(108),
    width: Platform.OS == 'ios' ? normalize(120) : normalize(108),
    resizeMode: 'contain',
    position: 'absolute',
    bottom: normalize(-25),
    left: normalize(-5),
  },
  v2: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v3: {
    height: normalize(45),
    width: '100%',
    marginBottom: normalize(5),
    backgroundColor: Colors.white,
    paddingTop: normalize(5),
  },
  filterContainer: {
    borderWidth: normalize(1),
    height: normalize(29),
    paddingHorizontal: normalize(10),
    marginVertical: 5,
    borderRadius: normalize(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(10),
  },
  filterImg: {
    resizeMode: 'contain',
    marginLeft: normalize(5),
  },
  title: {
    fontSize: normalize(16),
    fontFamily: Fonts.InterSemiBold,
    color: Colors.elephant,
    marginHorizontal: normalize(18),
    marginVertical: normalize(10),
  },
  v4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
    alignSelf: 'center',
  },
  v5: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(6),
    marginVertical: normalize(5),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(6),
    borderRadius: normalize(30),
    borderColor: Colors.dawn_pink,
    borderWidth: 1,
  },
  v6: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    height: normalize(14),
    width: normalize(14),
    tintColor: Colors.elephant,
    resizeMode: 'contain',
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(30),
    width: normalize(30),
    marginRight: normalize(10),
  },
  txt: {
    fontFamily: Fonts.InterMedium,
    fontSize: moderateScale(18),
    color: Colors.santa_grey,
    alignSelf: 'center',
    marginTop: verticalScale(100),
  },
  loadingText: {
    fontSize: normalize(12),
    color: Colors.santa_grey,
    alignSelf: 'center',
    marginTop: verticalScale(100),
  },
});
