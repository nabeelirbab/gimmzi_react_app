import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import normalize from '../../../../utils/orientation/normalize';
import {Colors, Fonts, Icons, Images} from '../../../../themes/Themes';
import Button from '../../../../components/button/Button';
import {navigateToCommunityScreen} from '../../../../utils/helper/RootNaivgation';
import {showMessage} from '../../../../utils/helper/Toast';
import {addFavourite} from '../../../../utils/service/UniverseService';
import {useAppDispatch} from '../../../../redux';
import {useNavigation} from '@react-navigation/native';
import CustomModal from '../../../../components/modal/CustomModal';
import {
  horizontalScale,
  moderateScale,
} from '../../../../utils/orientation/scaleDimensions';
import FastImage from 'react-native-fast-image';

const FavouriteCard = ({
  item,
  fetchFavourite,
  onPressWallet = () => {},
  onPressFavorite = () => {},
}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [favouriteData, setFavouriteData] = useState(item);
  const [offersAvailable, setOffersAvailable] = useState(0);
  // console.log("offersAvailable",offersAvailable);
  

  // console.log("item?.business deals",item?.deal?.business_profile?.deals_count,item?.deal?.business_profile?.loyalty_count);
  // console.log("item?.business loyalty",item?.loyalty?.business_profile?.deals_count,item?.loyalty?.business_profile?.loyalty_count);

  useEffect(()=>{
    if(item?.deal){
      const offers = 
      (item?.deal?.business_profile?.deals_count || 0) + 
      (item?.deal?.business_profile?.loyalty_count || 0);
      setOffersAvailable(offers);
    }else if(item?.loyalty){
      const offers = 
      (item?.loyalty?.business_profile?.deals_count || 0) + 
      (item?.loyalty?.business_profile?.loyalty_count || 0);
      setOffersAvailable(offers);
    }else{
      const offers = 
      (item?.business?.deals_count || 0) + 
      (item?.business?.loyalty_count || 0);
      setOffersAvailable(offers);
    }
  },[item])
  
  

  return (
    <View style={styles.mainContainer}>
      {/* Business Image */}
      {(item?.business?.main_image_url || item?.deal?.deal_image || item?.loyalty?.loyalty_image) ? (
  <FastImage
    source={
      item?.business?.main_image_url
        ? {
            uri: item?.business?.main_image_url,
            priority: FastImage.priority.low,
          }
        : item?.deal?.deal_image
        ? {
            uri: item?.deal?.deal_image,
            priority: FastImage.priority.low,
          }
        : item?.loyalty?.loyalty_image
        ? {
            uri: item?.loyalty?.loyalty_image,
            priority: FastImage.priority.low,
          }
        : {uri:item?.business?.logo_image|| item?.loyalty?.business_profile?.logo_image||item?.deal?.business_profile?.logo_image}
    }
    style={styles.imageStyle}
    fallback={true}
    defaultSource={{
      uri:item?.business?.logo_image|| item?.loyalty?.business_profile?.logo_image||item?.deal?.business_profile?.logo_image
    }}
    resizeMode={FastImage.resizeMode.contain}
  />
) : (
  <View style={styles.v6}>
    <Image
      source={{
        uri:item?.business?.logo_image||item?.loyalty?.business_profile?.logo_image||item?.deal?.business_profile?.logo_image
      }}
      style={styles.imageStyle}
      resizeMode="contain"
    />
  </View>
)}


      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.touch}
        onPress={() => onPressFavorite(item)}>
        <Image source={Icons.heart3} style={styles.optionsImg} />
      </TouchableOpacity>
      {item?.loyalty ? (
        <View style={styles.v2}>
          <Text style={styles.redeem}>
            No Points required - Earn Points with each purchase
          </Text>
        </View>
      ) : null}
      {item?.deal ? (
        <View style={styles.v2}>
          <Text style={styles.redeem}>{`${
            item?.deal?.point !== null ? item?.deal?.point : 0
          } points to redeem`}</Text>
        </View>
      ) : null}

      {/* Business Info */}
      <View style={styles.bottomContainer}>
        <Text
          style={styles.mainLabelText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item?.business?.business_name ||
            item?.deal?.business_profile?.business_name ||
            item?.loyalty?.business_profile?.business_name}
        </Text>
        {item?.loyalty?.program_points ? (
          <Text
            style={{
              color: Colors.mist_blue,
              fontFamily: Fonts.InterRegular,
              fontSize: normalize(11),
              marginTop: normalize(3),
            }}>
            {`Earn up to ${item?.loyalty?.program_points} loyalty points`}
          </Text>
        ) : null}

        {/* {item?.business && ( */}
        <View style={styles.dataContainer}>
          {/* Address */}
          <View style={styles.textContainer}>
            <Image style={styles.iconStyle} source={Icons.location_point} />
            <Text
              style={styles.smallText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item?.business?.formatted_location ||
                item?.deal?.business_profile?.formatted_location ||
                item?.loyalty?.business_profile?.formatted_location}
            </Text>
          </View>

          {/* Distance */}
          {item?.business ? (
            <View
              style={[
                styles.textContainer,
                {
                  width: '25%',
                  justifyContent: 'flex-end',
                },
              ]}>
              <Image style={styles.iconStyle} source={Icons.distance} />
              <Text style={styles.smallText}>{item?.business?.distance}mi</Text>
            </View>
          ) : null}
        </View>
        {/* )} */}

        {/* Action Buttons */}
        <View style={styles.v5}>
          {[
            'Gimmzi Page',
            // `${item?.business ? 'Go to Wallet' : offersAvailable>1? `${offersAvailable} Offers Available`:`${offersAvailable} Offer Available`}`,
            `${offersAvailable>1? `${offersAvailable} Offers Available`:`${offersAvailable} Offer Available`}`,
          ].map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[
                {
                  backgroundColor:
                    index === 0 ? Colors.white : Colors.ball_blue,
                  borderColor:
                    index === 0 ? Colors.dawn_pink : Colors.ball_blue,
                },
                styles.button,
              ]}
              onPress={() => {
                if (index === 0) {
                  navigation.navigate('RewardDetails', {
                    id:
                      item?.business?.id ||
                      item?.deal?.business_profile?.id ||
                      item?.loyalty?.business_profile?.id,
                    locationId:
                      item?.business?.main_location?.id ||
                      item?.deal?.business_profile?.main_location?.id ||
                      item?.loyalty?.business_profile?.main_location?.id,
                  });
                } else {
                  // onPressWallet();
                  navigation.navigate('RewardDetails', {
                    id:
                      item?.business?.id ||
                      item?.deal?.business_profile?.id ||
                      item?.loyalty?.business_profile?.id,
                    locationId:
                      item?.business?.main_location?.id ||
                      item?.deal?.business_profile?.main_location?.id ||
                      item?.loyalty?.business_profile?.main_location?.id,
                  });
                }
              }}>
              <Text
                style={{
                  color: index === 0 ? Colors.ball_blue : Colors.white,
                  fontFamily: Fonts.InterMedium,
                  fontSize: normalize(12),
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FavouriteCard;

const styles = StyleSheet.create({
  mainContainer: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: normalize(10),
    borderRadius: normalize(12),
    backgroundColor: Colors.white,
    shadowColor: Colors.mirage,
    borderColor: Colors.mirage,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: normalize(3),
    elevation: 2,
  },
  imageStyle: {
    width: '100%',
    height: normalize(150),
    resizeMode: 'cover',
    borderRadius: normalize(12),
  },
  bottomContainer: {
    padding: normalize(15),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  mainLabelText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(16),
    textAlign: 'left',
    color: Colors.dark,
    maxWidth: '100%',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: normalize(4),
    width: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '72%',
  },
  smallText: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(11),
    textAlign: 'left',
    color: Colors.santa_grey,
    marginLeft: normalize(4),
  },
  iconStyle: {
    height: normalize(16),
    width: normalize(16),
    resizeMode: 'contain',
    tintColor: Colors.santa_grey,
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
    zIndex: 1,
    position: 'absolute',
    right: normalize(0),
    top: normalize(8),
  },
  optionsImg: {
    resizeMode: 'contain',
    height: normalize(15),
    width: normalize(15),
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
  image1: {
    resizeMode: 'contain',
    height: normalize(100),
    width: normalize(100),
    // tintColor: Colors.mist_blue,
    alignSelf:'center'
  },
});
