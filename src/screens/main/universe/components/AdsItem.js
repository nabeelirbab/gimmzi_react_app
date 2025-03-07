import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {Colors, Fonts, Images} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';

const AdsItem = ({item}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.ball_blue,
        height: normalize(120),
        width: '90%',
        marginBottom: normalize(15),
        alignSelf: 'center',
        borderRadius: normalize(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
      <Image
        source={Images.shadow_arrow}
        style={{
          height: Platform.OS == 'ios' ? normalize(110) : normalize(98),
          width: Platform.OS == 'ios' ? normalize(110) : normalize(98),
          resizeMode: 'contain',
          position: 'absolute',
          bottom: normalize(-50),
          right: normalize(-5),
        }}
      />
      <View
        style={{
          width: '39%',
          height: '100%',
        }}>
        <Image
          source={item.images}
          style={{
            resizeMode: 'contain',
            height: normalize(110),
            width: normalize(115),
          }}
        />
      </View>

      <View
        style={{
          width: '62%',
          height: '100%',
        }}>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: Fonts.InterMedium,
            color: Colors.white,
            fontSize: normalize(11),
            marginTop: normalize(15),
            width: '92%',
          }}>
          {item.title}
        </Text>

        <TouchableOpacity
          style={{
            width: '92%',
            backgroundColor: Colors.white,
            height: normalize(35),
            borderRadius: normalize(6),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: normalize(15),
          }}>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.ball_blue,
              fontSize: normalize(13),
            }}>
            Browse {item.ads_type}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdsItem;
