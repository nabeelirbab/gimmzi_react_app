import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts, Icons} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';
import {useEffect, useState} from 'react';
import {getAverageColor} from '@somesoap/react-native-image-palette';
import {useNavigation} from '@react-navigation/native';

const SwipeCard = ({item, index, details}) => {
  const navigation = useNavigation();
  const [color, setColor] = useState('#FFFFFF'); // Default to white

  useEffect(() => {
    if (details?.logo_image) {
      fetchImageColor(details?.logo_image);
    }
  }, [details]);

  const fetchImageColor = async uri => {
    try {
      getAverageColor(uri).then(averageColor => setColor(averageColor));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    item?.location_type !== "Headquarters" && <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        navigation.push('RewardDetails', {
          id: item?.business_profile_id,
          locationId: item?.id,
        });
      }}
      style={styles.swipeCardContainer}
      key={index}>
      {item?.image || details?.logo_image ? (
        <Image
          source={item?.image ? item?.image : {uri: details?.logo_image}}
          style={[
            styles.swipeCardImage,
            {
              resizeMode: item?.image ? 'cover' : 'contain',
              backgroundColor: item?.image ? undefined : color,
            },
          ]}
        />
      ) : null}
      <View style={styles.swipeCradBottomContainer}>
        <View style={styles.swipeCardIconContainer}>
          <Image
            style={[styles.img, {tintColor: Colors.dark}]}
            source={Icons.location}
          />
        </View>
        <View style={styles.swipeCardRightContainer}>
          <Text numberOfLines={1} style={styles.title10}>
            {item?.address}
          </Text>
          <Text style={styles.title11}
          numberOfLines={1}
          >
            {`${item?.city} - ${item?.distance} mi`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SwipeCard;

const styles = StyleSheet.create({
  swipeCardContainer: {
    width: normalize(180),
    borderRadius: normalize(6),
    backgroundColor: Colors.white,
    marginRight: normalize(10),
  },
  swipeCardImage: {
    height: normalize(155),
    width: '100%',
    borderTopRightRadius: normalize(6),
    borderTopLeftRadius: normalize(6),
    resizeMode: 'cover',
  },
  swipeCradBottomContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(12),
    borderWidth: 2,
    borderColor: Colors.dawn_pink,
    borderBottomLeftRadius: normalize(6),
    borderBottomRightRadius: normalize(6),
  },
  swipeCardIconContainer: {
    padding: normalize(6),
    borderRadius: normalize(6),
    backgroundColor: Colors.catskill_white,
  },
  img: {
    height: normalize(16),
    width: normalize(16),
    resizeMode: 'contain',
  },
  swipeCardRightContainer: {
    width: '90%',
    paddingLeft: normalize(10),
  },
  title11: {
    fontFamily: Fonts.InterRegular,
    lineHeight: normalize(16),
    fontSize: normalize(10),
    color: Colors.pickled_bluewood,
    width: '90%'
  },
  title10: {
    fontFamily: Fonts.InterSemiBold,
    lineHeight: normalize(16),
    fontSize: normalize(10),
    color: Colors.dark,
    width: '90%',
  },
});
