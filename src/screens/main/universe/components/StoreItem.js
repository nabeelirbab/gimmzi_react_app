import {
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import React, { useRef } from 'react';
import normalize from '../../../../utils/orientation/normalize';
import { Colors, Fonts, Icons, Images } from '../../../../themes/Themes';
// import ImageSlider from '../../../../components/importent/ImageSlider';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const StoreItem = ({
  item,
  buisness,
  onPressFavorite = () => { },
  data,
  onPressWallet = () => { },
}) => {
  const navigation = useNavigation();
  const viewShotRef = useRef();

  const handleShare = async (buisness) => {
    try {
      const uri = await viewShotRef.current.capture();
      // const deepLink = `https://tinyurl.com/33uvs293?id=${buisness?.business_id}&location=${buisness?.main_location?.id}`;
      const deepLink = `https://staging.gimmzi.com/merchant/${buisness?.business_id}?id=${buisness?.business_id}&location=${buisness?.main_location?.id}`;
      const shareOptions = {
        url: uri,
        type: "image/*",
        message: `Check out this Gimmzi Deal: ${deepLink}`,
      };
      const result = await Share.open(shareOptions);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };

  let isDeals = item?.type == 'deals';
  // console.log("item store item",item);
  // console.log("buisness store item",buisness);

  // const tempImage = [...item.images].map((item, index) => ({
  //   id: index,
  //   image: item,
  // }));

  let _t = item?.discount_type;
  let _a = item?.discount_amount;

  let _event_deals =
    _t == 'discount'
      ? `$${Math.round(parseFloat(_a))} Discount`
      : _t == 'percentage'
        ? `${Math.round(parseFloat(_a))}% OFF`
        : _t == 'free'
          ? 'Free'
          : '';

  let _image = isDeals ? { uri: item?.deal_image } : { uri: item?.loyalty_image };

  const capitalizeFirstWord = (text) => {
    if (!text) return '';
    text = text.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <ViewShot style={{ flex: 1 }} ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
      <View style={styles.container}>
        <View style={styles.bg}>
          {/* <ImageSlider data={tempImage} autoSlider={true}/> */}
          {item?.deal_image || item?.loyalty_image ? (
            <FastImage
              source={
                isDeals
                  ? { uri: item?.deal_image, priority: FastImage.priority.low }
                  : { uri: item?.loyalty_image, priority: FastImage.priority.low }
              }
              style={styles.image}
              fallback={true}
              defaultSource={{ uri: buisness?.logoImage }}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <View style={styles.v6}>

              <Image
                resizeMode='contain'
                source={{ uri: buisness?.logoImage }} style={styles.image} />
            </View>
          )}

          {isDeals && _event_deals ? (
            <View
              style={[
                {
                  backgroundColor: Colors.green,
                },
                styles.discount,
              ]}>
              <Text style={styles.discountTitle}>{_event_deals}</Text>
            </View>
          ) : null}

          {!isDeals ? (
            <View
              style={[
                {
                  backgroundColor: item?.off_percentage
                    ? Colors.green
                    : Colors.ball_blue,
                },
                styles.discount,
              ]}>
              <Text style={styles.discountTitle}>
                {item?.off_percentage
                  ? item?.off_percentage
                  : 'Loyalty Punch Card'}
              </Text>
            </View>
          ) : null}

          {isDeals && item?.voucher_number ? (
            <View
              style={[
                {
                  backgroundColor: Colors.mikado_yellow,
                },
                styles.discount,
                {
                  marginTop: _event_deals ? 36 : 0,
                },
              ]}>
              <Text style={[styles.discountTitle, { color: Colors.black }]}>
                {'LIMITED TIME OFFER'}
              </Text>
            </View>
          ) : null}

          <View style={styles.v1}>
            {[0, 1].map(
              (
                _,
                index, // 1, 2
              ) => (
                <TouchableOpacity
                  onPress={() => {
                    if (index == 0) {
                      handleShare(buisness);
                    } else if (index == 1) {
                      onPressFavorite();
                    }
                  }}
                  key={index}
                  style={styles.touch}>
                  <Image
                    source={
                      index == 0
                        ? Icons.share
                        : item?.is_favourite ? Icons.heart3 : Icons.heart
                    }
                    style={styles.optionsImg}
                  />
                </TouchableOpacity>
              ),
            )}
          </View>


        </View>

        <Pressable
          style={{ padding: normalize(10) }}
          onPress={() => {
            navigation.navigate('RewardDetails', {
              id: buisness?.business_id,
              locationId: buisness?.main_location?.id,
            });
          }}>
          {isDeals ? (
            <View style={styles.v2}>
              <Text style={styles.redeem}>{`${item?.point !== null ? item?.point : 0
                } points to redeem`}</Text>
            </View>
          ) : null}

          {!isDeals ? (
            <View style={styles.v2}>
              <Text style={styles.redeem}>
                No Points required - Earn Points with each purchase
              </Text>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {buisness?.business_type === 'Mobile Business' ? (
              <View style={styles.GimmziText}>
                <Text style={[styles.location, { fontSize: normalize(10.5) }]}>
                  Mobile Business- Check Gimmzi Page
                </Text>
              </View>
            ) : (
               <View style={styles.v3}>
                <Image source={Icons.location_point} style={styles.locationImg} />
                <Text numberOfLines={1} style={styles.location}>
                  {buisness?.location}
                </Text>
              </View>
            )}

            <View style={[styles.v4, { marginLeft: normalize(8) }]}>
              <Image source={Icons.distance} style={styles.distanceImg} />
              <Text numberOfLines={1} style={styles.distance}>
                {`${buisness?.distance ? buisness?.distance : 0} mi`}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{buisness?.name}</Text>
          <Text
            numberOfLines={1}
            style={[
              styles.subTitle,
              {
                fontSize: normalize(13),
              },
            ]}>
            {/* {isDeals ? item?.suggested_description : item?.program_name} */}
            {capitalizeFirstWord(isDeals ? item?.suggested_description : item?.program_name)}
          </Text>
          {item?.merchant_id == null ? (<View style={styles.loyaltyView}>
            <Text style={styles.loyaltyText}>Loyalty Reward</Text>
          </View>) : null}
          {item?.program_points ? (
            <Text
              style={{
                color: Colors.mist_blue,
                fontFamily: Fonts.InterRegular,
                fontSize: normalize(11),
                marginTop: normalize(3),
              }}>
              {`Earn up to ${item?.program_points} loyalty points`}
            </Text>
          ) : null}

          <View style={styles.v5}>
            {[
              'Gimmzi Page', // data.length > 1 ? 'More Rewards' : 'Gimmzi Page'
              `${item?.is_added_wallet ? 'Go' : 'Add'} to Wallet`,
            ].map((_item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    {
                      backgroundColor:
                        index == 0 ? Colors.white : Colors.ball_blue,
                      borderColor:
                        index == 0 ? Colors.dawn_pink : Colors.ball_blue,
                    },
                    styles.button,
                  ]}
                  onPress={async () => {
                    // console.log('----->', buisness);

                    if (index == 0) {
                      navigation.navigate('RewardDetails', {
                        id: buisness?.business_id,
                        locationId: buisness?.main_location?.id,
                      });
                    } else {
                      onPressWallet();
                    }
                  }}>
                  <Text
                    style={{
                      color: index !== 0 ? Colors.white : Colors.ball_blue,
                      fontFamily: Fonts.InterMedium,
                      fontSize: normalize(15),
                    }}>
                    {_item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </View>
    </ViewShot>
  );
};

export default StoreItem;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    // height: normalize(330),
    backgroundColor: Colors.white,
    shadowColor: Platform.OS == 'ios' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: normalize(2),
    elevation: normalize(2),
    marginBottom: normalize(16),
    alignSelf: 'center',
    borderRadius: normalize(8),
  },
  bg: {
    height: normalize(180),
    width: '100%',
    borderRadius: normalize(8),
    overflow: 'hidden',
  },
  discount: {
    height: normalize(23),
    paddingHorizontal: normalize(10),
    borderTopRightRadius: normalize(4),
    borderBottomRightRadius: normalize(4),
    position: 'absolute',
    top: normalize(8),
    justifyContent: 'center',
  },
  discountTitle: {
    color: Colors.white,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(12),
  },
  v1: {
    height: 35,
    position: 'absolute',
    top: normalize(8),
    right: 0,
    flexDirection: 'row',
  },
  touch: {
    height: normalize(26),
    width: normalize(26),
    backgroundColor: Colors.cyne_blue,
    borderRadius: normalize(30),
    marginRight: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsImg: {
    resizeMode: 'contain',
    height: normalize(15),
    width: normalize(15),
  },
  v2: {
    backgroundColor: Colors.white_ice,
    alignSelf: 'flex-start',
    paddingHorizontal: normalize(5),
    paddingVertical: normalize(3),
    borderRadius: normalize(4),
  },
  redeem: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(10),
  },
  v3: {
    flexDirection: 'row',
    width: '70%',
    height: normalize(25),
    alignItems: 'center',
  },
  GimmziText: {
    width: '78%',
    height: normalize(25),
    justifyContent: 'center',
  },
  locationImg: {
    height: normalize(13),
    width: normalize(13),
    marginRight: normalize(3),
    tintColor: Colors.santa_grey,
  },
  location: {
    // width: '90%',
    color: Colors.santa_grey,
    fontSize: normalize(11),
  },
  v4: {
    flexDirection: 'row',
    width: '20%',
    height: normalize(25),
    alignItems: 'center',
  },
  distanceImg: {
    height: normalize(13),
    width: normalize(13),
    marginRight: normalize(1),
    tintColor: Colors.santa_grey,
  },
  distance: {
    // width: '90%',
    color: Colors.santa_grey,
    fontSize: normalize(11),
  },
  title: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(16),
  },
  subTitle: {
    color: Colors.green,
    fontFamily: Fonts.InterSemiBold,
    marginTop: normalize(5),
  },
  v5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  button: {
    width: '48%',
    height: normalize(36),
    borderRadius: normalize(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(1),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  v6: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image1: {
    resizeMode: 'contain',
    height: normalize(100),
    width: normalize(100),
    tintColor: Colors.mist_blue,
  },
  loyaltyText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(10),
    color: 'green'
  },
  loyaltyView: {
    backgroundColor: 'yellow',
    width: normalize(85),
    paddingVertical: Platform.OS === 'ios' ? normalize(2) : normalize(1),
    alignItems: 'center',
    marginTop: normalize(3)
  }

});
