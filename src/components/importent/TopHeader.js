import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {goBack} from '../../utils/helper/RootNaivgation';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/orientation/normalize';

const TopHeader = ({
  title = '',
  justifyContent = 'center',
  isGoBack = true,
  onPress = () => {},
  borderColor =  Colors.iron
}) => {
  
  function onPressClick() {
    if (!isGoBack) {
      onPress();
    } else {
      goBack();
    }
  }

  return (
    <View
      style={[
        styles.v1,
        {
          borderBottomColor: borderColor,
          justifyContent: justifyContent,
        },
      ]}>
      <TouchableOpacity style={styles.touch} onPress={() => onPressClick()}>
        <Image source={Icons.arrow_left} style={styles.img} />
      </TouchableOpacity>
      <Text style={styles.title1}>{title}</Text>
    </View>
  );
};

export default TopHeader;

const styles = StyleSheet.create({
  v1: {
    alignItems: 'center',
    height: normalize(40),
    borderBottomWidth: normalize(1),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    paddingHorizontal: normalize(45),
  },
  title1: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(15),
  },
  touch: {
    height: '100%',
    width: normalize(38),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: normalize(5),
  },
  img: {
    resizeMode: 'contain',
    height: normalize(20),
    width: normalize(20),
  },
});
