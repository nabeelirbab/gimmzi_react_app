import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import normalize from '../../../utils/orientation/normalize';
import {Colors, Fonts, Icons, Images} from '../../../themes/Themes';
import GridImageViewer from '../../../components/imageViewer/GridImageViewer';
import Button from '../../../components/button/Button';
import {
  goBack,
  navigateToMyHubScreen,
} from '../../../utils/helper/RootNaivgation';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import _ from 'lodash';
import CustomBottomView from '../../../components/custom/CustomBottomView';
import {useFocusEffect} from '@react-navigation/native';
import {showMessage} from '../../../utils/helper/Toast';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {
  addFavourite,
  getUniverseBusinessDetails,
} from '../../../utils/service/UniverseService';
import Loader from '../../../components/custom/Loader';
import {GimmziContext} from '../../../utils/helper/GimmziBoundary';
import CustomModal from '../../../components/modal/CustomModal';
import CustomScrollView from '../../../components/custom/CustomScrollView';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/orientation/scaleDimensions';
import {addWallet} from '../../../utils/service/WalletService';
import {isArray} from '../../../utils/helper/Validation';
import WebView from 'react-native-webview';
import RenderHTML from 'react-native-render-html';
import SwipeCard from './components/SwipeCard';
const {width} = Dimensions.get('window');

const RewardDetails = ({route}) => {
  const {id, locationId} = route?.params;
  const authState = useAppSelector(state => state.auth);
  const isLoggedIn = authState.isLoggedIn;
  const context = useContext(GimmziContext);
  const mapRef = useRef();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    locations: [],
    distance: '',
    details: {},
    business_phone: '',
    business_page_link: '',
    business_story: '',
    about: [],
    images: [],
  });
  const [coords, setCoords] = useState({
    latitude: 33.78879434717973,
    longitude: -78.99929058683612,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
  const animatedCoords = useRef(new AnimatedRegion(coords)).current;
  const [options, setOptions] = useState([]);
  const [showLocationIndex, setShowLocationIndex] = useState(1);
  const [isVisible, setIsVisible] = useState({
    selectedItem: {},
    status: false,
  });
  const [location,setLocation]=useState([])
  console.log("location",route?.params,location);
  

  /* on start */
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('transparent');
      if(isLoggedIn){
        getBusinessDetails(id, locationId);
      }else{
        getLiveLocation()
      }
     
    }, []),
  );


  const getLiveLocation = useCallback(async () => {
    console.log('getLiveLocation  -  -- - ');

    await context.getCurrentLocation(async coords => {
      console.log('coords', coords);
      setLocation(coords);
      getBusinessDetailsWithLocation(id, locationId,coords);

    });
  }, [context]);

  function removeHtmlTags(input) {
    return input?.replace(/<[^>]+>/g, '') || '';
  }
  

  const getBusinessDetails = useCallback(async (_id, _locationId) => {
    console.log('getBusinessDetailsgetBusinessDetails - - ', _id, _locationId);

    setIsLoading(true);
    const result = await dispatch(
      getUniverseBusinessDetails({
        business_id: _id,
        location_id: _locationId,
      }),
    );
console.log("result businessdetails",result);

    setIsLoading(false);
    if (!result?.success) {
      showMessage(result.message);
      return null;
    }
    if (result?.data) {
      const _details = result?.data?.business_profiles;
      const _deals =
        _details?.deals?.map(item => ({...item, type: 'deal'})) || [];
      const _loyalty =
        _details?.loyalty?.map(item => ({...item, type: 'loyalty'})) || [];
      const headquarter = result?.data?.all_locations?.find(
        item => item?.location_type == 'Headquarters',
      );
      let merchant_board = _details?.merchant_board[0];
      const about = [
        {
          label: 'Overview',
          desc: removeHtmlTags(_details?.business_overview),
          subTopics:
            merchant_board?.status === 1
              ? [
                  {
                    label: merchant_board?.board_one_title,
                    desc: merchant_board?.description,
                    type: 'special',
                    isVisible: merchant_board?.display_board_id,
                  },
                  {
                    label: merchant_board?.board_two_title,
                    desc: merchant_board?.description2,
                    type: 'special',
                    isVisible: merchant_board?.display_board_id2,
                  },
                ]
              : [],
        },
      ];
      const story = {
        title: 'Our Story',
        image: _details?.story_image_url
          ? _details?.story_image_url
          : undefined,
        subTitle: removeHtmlTags(_details?.business_story),
        topics: [],
      };
      const mergedLocation=[...result?.data?.all_locations,result?.data?.business_profiles?.main_location]
      let obj = {
        locations: mergedLocation,
        distance: _details?.selected_location_distance,
        details: _details,
        business_page_link: _details?.business_page_link,
        business_phone: _details?.business_phone,
        business_story: story,
        about: about,
        images: isArray(_details?.multiple_images)
          ?_details?.multiple_images?.length>0? _details?.multiple_images
          : [_details?.main_image_url]:[],
      };
      setBusinessInfo(obj);
      setOptions([..._deals, ..._loyalty]);
      if (!_.isEmpty(result?.data?.all_locations)) {
        setTimeout(
          () => {
            setCoords({
              latitude: parseFloat(result?.data?.all_locations[0]?.latitude),
              longitude: parseFloat(result?.data?.all_locations[0]?.longitude),
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            });
          },
          Platform.OS == 'android' ? 2000 : 1000,
        );
      }
    }
  }, []);
  const getBusinessDetailsWithLocation = useCallback(async (_id, _locationId,_coords) => {
    console.log('getBusinessDetailsgetBusinessDetails - - ', _id, _locationId);

    setIsLoading(true);
    const result = await dispatch(
      getUniverseBusinessDetails({
        business_id: _id,
        location_id: _locationId,
        lat:_coords? _coords?.latitude: location?.latitude,
        long:_coords? _coords?.longitude: location?.longitude,
      }),
    );
console.log("result businessdetails",result);

    setIsLoading(false);
    if (!result?.success) {
      showMessage(result.message);
      return null;
    }
    if (result?.data) {
      const _details = result?.data?.business_profiles;
      const _deals =
        _details?.deals?.map(item => ({...item, type: 'deal'})) || [];
      const _loyalty =
        _details?.loyalty?.map(item => ({...item, type: 'loyalty'})) || [];
      const headquarter = result?.data?.all_locations?.find(
        item => item?.location_type == 'Headquarters',
      );
      let merchant_board = _details?.merchant_board[0];
      const about = [
        {
          label: 'Overview',
          desc: removeHtmlTags(_details?.business_overview),
          subTopics:
            merchant_board?.status === 1
              ? [
                  {
                    label: merchant_board?.board_one_title,
                    desc: merchant_board?.description,
                    type: 'special',
                    isVisible: merchant_board?.display_board_id,
                  },
                  {
                    label: merchant_board?.board_two_title,
                    desc: merchant_board?.description2,
                    type: 'special',
                    isVisible: merchant_board?.display_board_id2,
                  },
                ]
              : [],
        },
      ];
      const story = {
        title: 'Our Story',
        image: _details?.story_image_url
          ? _details?.story_image_url
          : undefined,
        subTitle: removeHtmlTags(_details?.business_story),
        topics: [],
      };
      const mergedLocation=[...result?.data?.all_locations,result?.data?.business_profiles?.main_location]
      let obj = {
        locations: mergedLocation,
        distance: _details?.selected_location_distance,
        details: _details,
        business_page_link: _details?.business_page_link,
        business_phone: _details?.business_phone,
        business_story: story,
        about: about,
        images: isArray(_details?.multiple_images)
          ?_details?.multiple_images?.length>0? _details?.multiple_images
          : [_details?.main_image_url]:[],
      };
      setBusinessInfo(obj);
      setOptions([..._deals, ..._loyalty]);
      if (!_.isEmpty(result?.data?.all_locations)) {
        setTimeout(
          () => {
            setCoords({
              latitude: parseFloat(result?.data?.all_locations[0]?.latitude),
              longitude: parseFloat(result?.data?.all_locations[0]?.longitude),
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            });
          },
          Platform.OS == 'android' ? 2000 : 1000,
        );
      }
    }
  }, []);

  const Topic = ({label, desc, subTopics = []}) => {
    return (
      <View style={styles.v4}>
        <Text style={styles.title4}>{label}</Text>
        {desc && <Text style={styles.description}>{desc}</Text>}
        {subTopics?.length > 0 &&
          subTopics?.map((subTopic, subTopicIndex) => {
            return (
              <>
                {subTopic?.isVisible ? (
                  <SubTopic
                    label={subTopic?.label}
                    desc={subTopic?.desc}
                    key={subTopicIndex}
                    type={subTopic?.type}
                  />
                ) : null}
              </>
            );
          })}
      </View>
    );
  };

  const SubTopic = ({label, desc, type = 'ordinary'}) => {
    return (
      <View
        style={[
          styles.subTopicContainer,
          type && type !== 'ordinary' && {backgroundColor: Colors.water},
        ]}>
        <Text
          style={[
            styles.title5,
            type && type !== 'ordinary' && {color: Colors.green},
          ]}>
          {label}
        </Text>
        <RenderHTML
          // contentWidth={width}
          source={{
            html: `${desc}`,
          }}
          renderers={{
            webview: WebView,
          }}
          // renderersProps={{
          //   ul: {
          //     ol: {marginLeft: 15, listStyleType: 'decimal'},
          //     ul: {marginLeft: 15, listStyleType: 'disc'},
          //   },
          // }}
          tagsStyles={{
            li: {
              fontSize: 14,
              fontFamily: 'Arial',
              // listStyleType: 'disc', // Ensure list dot shows up
              lineHeight: 20,
              
              color:'black'// Increase line height for readability
            },
            span: {
              textAlign: 'justify',
              lineHeight: 20,
              color:'black' // Uniform line height
            },
            p: {
              fontFamily: 'Open Sans',
              fontSize: 14,
              textAlign: 'justify',
              lineHeight: 20, 
              color:'black'
              // Add line height for proper spacing
            },
            b: {
              fontWeight: 'bold',
              fontFamily: 'Arial',
              color:'black' // Ensure bold style matches
            },
          }}
        />

        {/* <Text style={[styles.title6, {marginTop: normalize(6)}]}>{desc}</Text>
         */}
      </View>
    );
  };

  const StoryComponent = ({data}) => {
    return (
      <View style={styles.storyMainContainer}>
        <Text style={styles.title7}>{data?.title}</Text>
        {data?.image && (
          <Image style={styles.storyImage} source={{uri: data?.image}} />
        )}
        {data?.subTitle && (
          <Text style={styles.description2}>{data?.subTitle}</Text>
        )}
        {data?.topics?.map((topic, topicIndex) => {
          return (
            <View key={topicIndex} style={{marginTop: normalize(10)}}>
              <Text style={styles.title8}>{topic?.label}:</Text>
              {topic?.description && (
                <Text style={[styles.description2, {marginTop: normalize(5)}]}>
                  {topic?.description}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const CustomTooltip = () => (
    <ImageBackground source={Images.union} style={styles.tooltipContainer}>
      <View style={{height: '65%', width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: normalize(10),
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{
              color: Colors.river_bed,
              fontFamily: Fonts.InterMedium,
              fontSize: normalize(12),
            }}>
            {`${showLocationIndex} to ${businessInfo?.locations.length}`}
          </Text>
          <TouchableOpacity
            disabled={showLocationIndex === 1}
            onPress={() => {
              if (showLocationIndex > 1) {
                setShowLocationIndex(showLocationIndex - 1);
              }
            }}
            style={styles.touch2}>
            <Image
              source={Icons.arrow_right2}
              style={{
                height: normalize(16),
                width: normalize(16),
                resizeMode: 'contain',
                transform: [{rotate: '180deg'}],
                tintColor:
                  showLocationIndex === 1 ? Colors.santa_grey : Colors.dark,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={showLocationIndex === businessInfo?.locations.length}
            onPress={() => {
              if (showLocationIndex < businessInfo?.locations.length) {
                setShowLocationIndex(showLocationIndex + 1);
              }
            }}
            style={styles.touch2}>
            <Image
              source={Icons.arrow_right2}
              style={{
                height: normalize(16),
                width: normalize(16),
                resizeMode: 'contain',
                tintColor:
                  showLocationIndex === businessInfo?.locations.length
                    ? Colors.santa_grey
                    : Colors.dark,
              }}
            />
          </TouchableOpacity>
        </View>
        <Text
          numberOfLines={2}
          style={{
            color: Colors.river_bed,
            fontFamily: Fonts.InterMedium,
            fontSize: normalize(11),
            width: '90%',
            alignSelf: 'center',
          }}>
          {businessInfo?.locations[showLocationIndex - 1]?.address}
        </Text>
      </View>
    </ImageBackground>
  );

  const updateCoords = useCallback(
    newCoords => {
      setCoords(newCoords);
      try {
        animatedCoords
          .timing({
            latitude: newCoords.latitude,
            longitude: newCoords.longitude,
            duration: 500,
          })
          .start();

        mapRef.current.animateToRegion(newCoords, 500);
      } catch (error) {
        // handle error
      }
    },
    [animatedCoords],
  );

  useEffect(() => {
    if (!_.isEmpty(businessInfo?.locations) && showLocationIndex) {
      const newCoords = {
        latitude: parseFloat(
          businessInfo?.locations[showLocationIndex - 1]?.latitude,
        ),
        longitude: parseFloat(
          businessInfo?.locations[showLocationIndex - 1]?.longitude,
        ),
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      };
      updateCoords(newCoords);
    }
  }, [showLocationIndex, businessInfo?.locations]);
  const MapComponent = ({label, totalLocation, activeLocationIndex, data}) => {
    console.log("data reward details",data);

    const handlePress = () => {
      const phoneNumber = data?.details?.main_location?.business_phone;
    
      if (!phoneNumber) {
        showMessage('Phone number not available');
        return;
      }
    
      // Log the phone number for debugging
      console.log('Phone Number:', phoneNumber);
    
      // Ensure the number is in the correct format
      const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9+]/g, ''); 
    
      if (sanitizedPhoneNumber) {
        context.makePhoneCall(sanitizedPhoneNumber);
      } else {
        showMessage('Invalid phone number');
      }
    };
    
    return (
      <View style={styles.mapContainer}>
        <View style={styles.mapLabelContainer}>
          <Text numberOfLines={1} style={[styles.title12]}>
            {label}
          </Text>
          <Text
            style={
              styles.title13
            }>{`Location ${activeLocationIndex} of ${totalLocation}`}</Text>
        </View>

        <View
          style={{
            height: normalize(200),
            width: '100%',
            borderRadius: normalize(8),
            overflow: 'hidden',
            marginBottom: normalize(15),
          }}>
          <MapView
            ref={mapRef}
            style={{...StyleSheet.absoluteFill}}
            followsUserLocation={true}
            initialRegion={coords}
            showsCompass={false}
            scrollEnabled={false}
            zoomEnabled={true}
            pitchEnabled={true}
            showsBuildings={true}
            mapType={'standard'}
            rotateEnabled={true}
            showsIndoors={true}
            animationEnabled={true}
            provider={PROVIDER_GOOGLE}>
            {data?.locations.map((item, index) => (
              <Marker.Animated
                key={index}
                coordinate={{
                  latitude: parseFloat(item.latitude),
                  longitude: parseFloat(item.longitude),
                }}
                anchor={{x: 0.5, y: 0.1}}>
                <Image
                  source={Icons.location1}
                  style={{
                    height: normalize(45),
                    width: normalize(45),
                  }}
                />
              </Marker.Animated>
            ))}
          </MapView>
          <CustomTooltip />
        </View>

        <View style={styles.mapButtonContainer}>
          <Button
            title={'Directions'}
            width={'auto'}
            paddingLeft={normalize(4)}
            paddingRight={normalize(4)}
            height={normalize(30)}
            fontSize={normalize(12)}
            leftIcon={Icons.direction}
            disabled={true}
          />
          <Button
            title={'Call'}
            width={'auto'}
            paddingLeft={10}
            paddingRight={10}
            height={normalize(30)}
            fontSize={normalize(12)}
            leftIcon={Icons.call2}
            backgroundColor={Colors.white}
            borderColor={Colors.iron}
            textColor={Colors.ball_blue}
            onPress={() => {
              handlePress()
            }}
          />
          <Button
            title={data?.details?.main_location?.business_fax_number ? 'Visit website' : 'Not available'}
            width={'auto'}
            paddingLeft={10}
            paddingRight={10}
            height={normalize(30)}
            fontSize={normalize(12)}
            leftIcon={Icons.global}
            disabled={!data?.details?.main_location?.business_fax_number}
            backgroundColor={Colors.white}
            borderColor={Colors.iron}
            textColor={Colors.ball_blue}
            onPress={() => {
              if (data?.details?.main_location?.business_fax_number) {
                Linking.openURL(`${data?.details?.main_location?.business_fax_number}`);
              } else {
                showMessage('Not available');
              }
            }}
          />
        </View>
      </View>
    );
  };

  const updateWalletStatus = (type, itemId, newStatus) => {
    setOptions(prevArr =>
      prevArr.map(item => {
        if (item.id === itemId && type == item?.type) {
          return {...item, is_added_wallet: newStatus, isActive: false};
        }
        return item;
      }),
    );

    setIsVisible({
      selectedItem: [],
      status: false,
    });
  };

  const capitalizeFirstWord = (text) => {
    if (!text) return ''; 
    text = text.toLowerCase(); 
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Loader visible={isLoading} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{flex: 1, backgroundColor: Colors.white}}
        contentContainerStyle={{
          paddingBottom: isVisible.status ? normalize(100) : normalize(30),
          backgroundColor: Colors.white,
        }}>
        {!isLoading && !_.isEmpty(businessInfo?.images) ? (
          <GridImageViewer
            images={[
              ...businessInfo?.images,
              // ...businessInfo?.images?.slice(1),
            ]}
            marginTop={0}
            height={normalize(280)}
            width={'100%'}
            borderRadius={0}
            mWidth="88%"
            mBackgroundColor="rgba(0,0,0,0.40)"
            mBottom={normalize(18)}
          />
        ) : (
          <View style={styles.v7}>
            <Text style={styles.t1}>No Image found</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()} style={styles.touch}>
            <Image source={Icons.arrow_left2} style={styles.img} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            {[0].map(
              (
                item,
                i, // 0, 1
              ) => (
                <TouchableOpacity
                  key={i}
                  onPress={async () => {
                    if (i == 0) {
                      // i == 1
                      const result = await dispatch(
                        addFavourite(businessInfo?.details?.id),
                      );
                      showMessage(result.message);

                      if (result.success) {
                        setBusinessInfo(pre => ({
                          ...pre,
                          details: {
                            ...pre?.details,
                            is_favourite: !pre?.details?.is_favourite,
                          },
                        }));
                      }
                    }
                  }}
                  style={[
                    styles.touch,
                    {
                      marginLeft: i == 0 ? normalize(12) : 0, // i == 1 ? normalize(12) : 0,
                    },
                  ]}>
                  <Image
                    source={
                      // i == 0
                      //   ? Icons.share3 :
                      businessInfo?.details?.is_favourite
                        ? Icons.heart3
                        : Icons.heart1
                    }
                    style={styles.img}
                  />
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {!isLoading && (
          <View style={styles.v1}>
            <Text style={styles.title}>
              {businessInfo?.details?.business_name}
            </Text>
            <View style={styles.v2}>
              <Image source={Icons.location} style={styles.img1} />
              <Text style={styles.title1}>
                {`${businessInfo.locations?.length} ${
                  businessInfo.locations?.length > 1 ? 'locations' : 'location'
                }  `}
                {<View style={styles.dot} />}
                {` ${businessInfo.distance} mi`}
              </Text>
            </View>

            {options.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    let temp = options.map((it, i) => ({
                      ...it,
                      isActive: i == index ? !it?.isActive : false,
                    }));
                    setOptions(temp);

                    let d = temp.filter((itm, i) => itm.isActive == true);
                    setIsVisible({
                      selectedItem: !_.isEmpty(d) ? d[0] : [],
                      status: !_.isEmpty(d),
                    });
                  }}
                  key={index}
                  style={[
                    {
                      borderWidth: normalize(item?.isActive ? 1.5 : 1),
                      borderColor: item?.isActive
                        ? Colors.ball_blue
                        : Colors.dawn_pink,
                    },
                    styles.touch1,
                  ]}>
                  <View
                    style={[
                      {
                        borderColor: item?.isActive
                          ? Colors.ball_blue
                          : Colors.iron,
                      },
                      styles.v3,
                    ]}>
                    {item?.isActive && <View style={styles.circle} />}
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.title2}>
                    {capitalizeFirstWord(item?.type == 'deal'
                        ? item?.suggested_description
                        : item?.program_name)}
                         </Text>
                    {item?.program_points || item?.point ? (
                      <Text style={styles.title3}>
                        {item?.type == 'deal'
                          ? `${item?.point} points to redeem`
                          : item?.program_points
                          ? `Earn up to ${item?.program_points} loyalty points`
                          : ''}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {!isLoading &&
          businessInfo?.about?.map((topic, topicIndex) => {
            return <Topic {...topic} key={topicIndex} />;
          })}

        {!isLoading && !_.isEmpty(businessInfo?.locations) && (
          <MapComponent
            label={`${businessInfo?.details?.business_name}`}
            totalLocation={businessInfo?.locations.length}
            activeLocationIndex={showLocationIndex}
            data={businessInfo}
          />
        )}

        {!isLoading && <StoryComponent data={businessInfo?.business_story} />}

        {!isLoading && (
          <View style={styles.swipableMainContainer}>
            <Text style={styles.title9}>
              {!_.isEmpty(businessInfo?.locations)
                ? `Other ${businessInfo?.details?.business_name} Locations`
                : `More ${
                    businessInfo?.details?.category?.category_name
                      ? businessInfo?.details?.category?.category_name
                      : ''
                  }`}
            </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              style={{paddingVertical: normalize(16)}}
              horizontal={true}
              data={businessInfo?.locations}
              renderItem={({item, index}) => (
                <SwipeCard
                  details={businessInfo?.details}
                  index={index}
                  item={item}
                  key={index}
                />
              )}
            />
          </View>
        )}
      </ScrollView>

      <CustomBottomView
        isVisible={isVisible.status}
        children={
          <View style={styles.v5}>
            <Button
              title={`${
                isVisible.selectedItem?.is_added_wallet ? 'Go' : 'Add'
              } to Wallet`}
              width={'48%'}
              fontFamily={Fonts.InterMedium}
              fontSize={normalize(15)}
              marginBottom={normalize(20)}
              onPress={async () => {
                let _item = isVisible.selectedItem;

                if (_item?.is_added_wallet) {
                  navigateToMyHubScreen('MyWallet', {
                    select:
                      _item?.type == 'deal' ? 'Deals' : 'LoyaltyPunchCards',
                  });
                  setIsVisible({
                    selectedItem: [],
                    status: false,
                  });
                } else {
                  let business_id =
                    _item?.type == 'deal'
                      ? _item?.business_id
                      : _item?.business_profile_id;
                  let obj = {
                    business_id: business_id,
                    type:
                      _item?.type == 'deal' ? 'gimmziDeals' : 'loyaltyRewards',
                  };

                  if (_item?.type == 'deal') {
                    obj.deal_id = _item?.id;
                  } else {
                    obj.loyalty_id = _item?.id;
                  }

                  const result = await dispatch(addWallet(obj));
                  showMessage(result.message);
                  if (result.success) {
                    updateWalletStatus(_item?.type, _item?.id, true);
                  }

                  const countRes = await dispatch(getWalletCount());
                }
              }}
            />
            <Button
              title={'Details'}
              width={'48%'}
              fontFamily={Fonts.InterMedium}
              fontSize={normalize(15)}
              backgroundColor={Colors.white}
              textColor={Colors.ball_blue}
              marginBottom={normalize(20)}
              borderColor={Colors.dawn_pink}
              onPress={() => {
                setIsVisibleInfo(true);
              }}
            />
          </View>
        }
      />

      {/* Information */}
      <CustomModal
        isVisible={isVisibleInfo}
        onBackdropPress={setIsVisibleInfo}
        children={
          <View style={styles.v6}>
            <Text
              numberOfLines={2}
              style={[
                styles.title14,
                {
                  width: '92%',
                },
              ]}>
              {/* OFF ALL PRODUCTS */}
              {isVisible.selectedItem?.type === 'deal'
                ? isVisible.selectedItem?.suggested_description
                : isVisible.selectedItem?.program_name}
            </Text>
            {isVisible.selectedItem?.program_points ||
            isVisible.selectedItem?.point ? (
              <Text style={styles.title15}>
                {isVisible.selectedItem?.type == 'deal'
                  ? `${isVisible.selectedItem?.point} points to redeem`
                  : isVisible.selectedItem?.program_points
                  ? `Earn up to ${isVisible.selectedItem?.program_points} loyalty points`
                  : ''}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={() => setIsVisibleInfo(false)}
              style={styles.touch3}>
              <Image source={Icons.close} style={styles.close} />
            </TouchableOpacity>
            <Text
              style={
                styles.title16
              }>{`About this ${isVisible.selectedItem?.type}`}</Text>
            <CustomScrollView
              style={styles.scroll}
              // content={
              //   isVisible.selectedItem?.type == 'deal'
              //     ? isVisible.selectedItem?.suggested_description
              //     : isVisible.selectedItem?.program_name
              // }
              content={`No minimum purchase necessary. To redeem rewards, you must be registered and logged into your account. Cannot be combined with any other coupons. Discounts, promotions and/or offers. Cannot be applied on promotional priced product(s).\n\nPromotion codes and offers please note: Deals and programs are not retroactive and price adjustments will not be issued to orders placed either before or after the duration of any promotion. If you forgot to use your deal or program we are unable to adjust orders after they've been placed. Only one deal or program can be applied in one order. ${businessInfo?.details?.business_name} reserves the right to modify or cancel promotion deals at any time without notice.`}
            />
            {/* {isVisible.selectedItem?.terms_conditions ? ( */}
            <>
              <Text style={styles.title17}>Terms and conditions</Text>
              <CustomScrollView
                style={styles.scroll}
                content={`Gimmzi Smart Rewards Program\n\n1. Eligibility:\nParticipation in the Gimmzi Loyalty Rewards Program ("Program") is open to individuals who are 13 years of age or older. Businesses must meet the eligibility criteria specified by Gimmzi.\n\n2. Program Overview:\nThe Program allows members to earn and redeem points for rewards offered by participating businesses. Gimmzi reserves the right to modify or terminate the Program at any time.\n\n3. Earning Points:\nPoints are earned through qualifying purchases, referrals, or other activities as specified by Gimmzi or participating businesses. Points have no cash value and are non-transferable.\n\n4. Redeeming Rewards:\nMembers can redeem points for rewards offered by participating businesses. Gimmzi is not responsible for the quality, safety, legality, or any other aspect of the rewards provided by businesses.\n\n5. Account Termination:\nGimmzi reserves the right to terminate or suspend a member's account for any reason, including but not limited to violation of these terms, fraudulent activity, or misuse of the Program.\n\n6. Privacy:\nBy participating in the Program, members agree to the collection and use of personal information as outlined in Gimmzi's Privacy Policy.\n\n7. Changes to Terms:\nGimmzi reserves the right to modify these terms and conditions at any time. Changes will be communicated to members through the Gimmzi platform.\n\n8. Limitation of Liability:\nGimmzi and participating businesses are not liable for any direct, indirect, incidental, special, or consequential damages arising out of or related to the Program.\n\n9. Governing Law:\nThese terms and conditions are governed by and construed in accordance with the laws of the United States of America.\n\n10. Contact Information:\nFor questions or concerns regarding the Program, please contact legal@gimmzi.com.`}
                // content={isVisible.selectedItem?.terms_conditions}
              />
            </>
            {/* ) : null} */}
          </View>
        }
      />
    </View>
  );
};

export default RewardDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    height: normalize(50),
    width: '100%',
    position: 'absolute',
    marginTop: Platform.OS == 'android' ? normalize(35) : normalize(45),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(18),
    alignItems: 'center',
  },
  touch: {
    backgroundColor: 'rgba(24, 34, 48, 0.32)',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(30),
    width: normalize(30),
    borderRadius: normalize(30),
  },
  img: {
    height: normalize(16),
    width: normalize(16),
    resizeMode: 'contain',
  },
  v1: {
    backgroundColor: Colors.catskill_white,
    width: '90%',
    borderRadius: normalize(6),
    alignSelf: 'center',
    marginTop: normalize(15),
    paddingHorizontal: normalize(10),
    paddingTop: normalize(15),
    paddingBottom: normalize(10),
  },
  title: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(20),
    color: Colors.dark,
  },
  v2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(18),
  },
  img1: {
    resizeMode: 'contain',
    height: normalize(17),
    width: normalize(17),
    tintColor: Colors.dark,
    marginRight: normalize(8),
  },
  title1: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pickled_bluewood,
    fontSize: normalize(14),
  },
  dot: {
    backgroundColor: Colors.ball_blue,
    height: normalize(6),
    width: normalize(6),
    borderRadius: normalize(6),
    marginBottom: 2,
  },
  touch1: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginBottom: normalize(10),
    padding: normalize(10),
    borderRadius: normalize(6),
  },
  v3: {
    borderWidth: normalize(1),
    height: normalize(18),
    width: normalize(18),
    borderRadius: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(8),
  },
  circle: {
    backgroundColor: Colors.ball_blue,
    height: normalize(12),
    width: normalize(12),
    borderRadius: normalize(12),
  },
  title2: {
    fontFamily: Fonts.InterSemiBold,
    lineHeight: normalize(20),
    fontSize: normalize(14),
    color: Colors.dark,
  },
  title3: {
    fontFamily: Fonts.InterMedium,
    lineHeight: normalize(18),
    fontSize: normalize(11),
    color: Colors.ball_blue,
    marginTop: normalize(8),
  },
  v4: {
    width: '90%',
    alignSelf: 'center',
    marginTop: normalize(15),
  },
  title4: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    color: Colors.dark,
  },
  description: {
    marginTop: normalize(15),
    marginBottom: normalize(10),
    fontFamily: Fonts.InterRegular,
    lineHeight: normalize(18),
    fontSize: normalize(13),
    color: Colors.pickled_bluewood,
  },
  subTopicContainer: {
    width: '100%',
    backgroundColor: Colors.alabaster,
    borderRadius: normalize(6),
    marginTop: normalize(15),
    padding: normalize(10),
  },
  title5: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(14),
    color: Colors.dark,
  },
  title6: {
    fontFamily: Fonts.InterRegular,
    lineHeight: normalize(18),
    fontSize: normalize(13),
    color: Colors.pickled_bluewood,
  },
  storyMainContainer: {
    width: '90%',
    backgroundColor: Colors.alabaster,
    borderRadius: normalize(6),
    marginVertical: normalize(20),
    paddingHorizontal: normalize(10),
    alignSelf: 'center',
    paddingVertical: normalize(12),
  },
  storyImage: {
    height: normalize(150),
    width: '100%',
    resizeMode: 'cover',
    marginVertical: normalize(15),
    borderRadius: normalize(6),
  },
  title7: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    color: Colors.dark,
  },
  description2: {
    fontFamily: Fonts.InterRegular,
    lineHeight: normalize(20),
    fontSize: normalize(13),
    color: Colors.pickled_bluewood,
  },
  title8: {
    fontFamily: Fonts.InterSemiBold,
    lineHeight: normalize(20),
    fontSize: normalize(13),
    color: Colors.dark,
  },
  swipableMainContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  title9: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    color: Colors.dark,
  },
  swipeCardLeftContainer: {
    paddingTop: normalize(4),
  },
  mapContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: normalize(30),
  },
  mapLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(10),
  },
  mapButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(10),
  },
  title12: {
    fontFamily: Fonts.InterSemiBold,
    lineHeight: normalize(24),
    fontSize: normalize(17),
    color: Colors.dark,
    width: '65%',
  },
  title13: {
    fontFamily: Fonts.InterRegular,
    lineHeight: normalize(20),
    fontSize: normalize(13),
    color: Colors.pickled_bluewood,
    width: horizontalScale(120),
    textAlign: 'right',
  },
  tooltipContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: normalize(150),
    height: normalize(100),
    alignSelf: 'center',
    top: normalize(10),
  },
  touch2: {
    height: normalize(25),
    width: normalize(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  v5: {
    backgroundColor: Colors.white,
    height: '60%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(18),
  },
  v6: {
    backgroundColor: Colors.white,
    width: '85%',
    alignSelf: 'center',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
  },
  title14: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: horizontalScale(18),
  },
  title15: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: horizontalScale(13),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(5),
  },
  touch3: {
    backgroundColor: Colors.catskill_white,
    height: horizontalScale(25),
    width: horizontalScale(25),
    borderRadius: horizontalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: moderateScale(12),
    right: moderateScale(12),
  },
  close: {
    height: normalize(14),
    width: normalize(14),
    resizeMode: 'contain',
  },
  title16: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: horizontalScale(16),
    marginTop: verticalScale(10),
  },
  title17: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: horizontalScale(16),
    marginTop: verticalScale(10),
  },
  scroll: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(5),
  },
  v7: {
    height: normalize(200),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  t1: {
    color: Colors.santa_grey,
    fontSize: normalize(14),
    fontFamily: Fonts.InterRegular,
  },
});
