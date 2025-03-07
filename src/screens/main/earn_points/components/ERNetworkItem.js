import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {Colors, Fonts, Images} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';

const ERNetworkItem = ({item, onPress = () => {}}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        height: normalize(145),
        width: '90%',
        marginBottom: normalize(15),
        alignSelf: 'center',
        borderRadius: normalize(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        paddingBottom: normalize(12),
        borderWidth: normalize(1),
        borderColor: Colors.ball_blue,
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
          width: '40%',
          height: '100%',
          alignItems: 'center',
          paddingLeft: normalize(8),
        }}>
        <Image
          source={item.icon}
          style={{
            resizeMode: 'contain',
            height: normalize(130),
            width: normalize(135),
          }}
        />
      </View>

      <View
        style={{
          width: '60%',
          paddingRight: normalize(10),
          paddingLeft: normalize(8),
        }}>
        <Text
          // numberOfLines={2}
          style={{
            fontFamily: Fonts.InterMedium,
            color: Colors.black,
            fontSize: normalize(11),
            marginTop: normalize(10),
            width: '100%',
          }}>
          {item.description}
        </Text>

        <TouchableOpacity
          disabled={item.disabled}
          onPress={() => {
            if (onPress) {
              onPress(item);
            }
          }}
          style={{
            width: '100%',
            backgroundColor: Colors.ball_blue,
            height: normalize(30),
            borderRadius: normalize(50),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: normalize(10),
          }}>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.white,
              fontSize: normalize(12),
              textAlign: 'center',
            }}>
            {item.options}
          </Text>
        </TouchableOpacity>

        {!item.status ? (
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.neutral,
              alignSelf: 'center',
              marginTop: normalize(8),
              fontSize: normalize(12),
            }}>
            Coming Soon
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default ERNetworkItem;
