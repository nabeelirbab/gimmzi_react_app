import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import {Dropdown} from 'react-native-element-dropdown';

const DropDown = ({
  dropdownList = [],
  value,
  setValue = () => {},
  isRequired = false,
  title = 'Enter input title',
  rightIcon = undefined,
  onPressRight = () => {},
  bottomOption = '',
  onPressBottom = () => {},
  marginTop = normalize(7),
  containerStyle = {},
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const styles = customStyles(marginTop, isFocus);
  return (
    <View style={[styles.mainContainer, containerStyle]}>
      {title && (
        <Text numberOfLines={1} style={styles.titleText}>
          {title}
          {isRequired && (
            <Text
              style={{
                color: Colors.carmine_pink,
              }}>
              *
            </Text>
          )}
        </Text>
      )}

      <View style={styles.container}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={dropdownList}
          maxHeight={200}
          labelField="label"
          valueField="value"
          itemTextStyle={styles.selectedTextStyle}
          placeholder={'Select'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
          }}
          renderRightIcon={() => (
            <Image source={Icons.down_arrow} style={styles.dropDownIcon} />
          )}
        />
        {rightIcon !== undefined && (
          <TouchableOpacity
            onPress={() => onPressRight()}
            style={styles.rightIconContainer}>
            <Image source={rightIcon} style={styles.rightIcon} />
          </TouchableOpacity>
        )}
      </View>

      {bottomOption !== '' && (
        <Text onPress={() => onPressBottom()} style={styles.bottomOption}>
          {bottomOption}
        </Text>
      )}
    </View>
  );
};

const customStyles = (marginTop, isFocus) =>
  StyleSheet.create({
    mainContainer: {
      width: '90%',
      alignSelf: 'center',
      marginTop: marginTop,
      marginBottom: normalize(7),
    },
    titleText: {
      fontSize: normalize(12),
      color: Colors.dark,
      marginBottom: normalize(7),
      fontFamily: Fonts.InterMedium,
    },
    container: {
      width: '100%',
      height: normalize(40),
      borderRadius: normalize(6),
      borderColor: Colors.iron,
      borderWidth: normalize(1),
      justifyContent: 'center',
    },
    rightIconContainer: {
      width: normalize(40),
      height: normalize(40),
      position: 'absolute',
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightIcon: {
      width: normalize(17),
      height: normalize(17),
      resizeMode: 'contain',
      tintColor: Colors.dark,
    },
    bottomOption: {
      color: Colors.ball_blue,
      fontFamily: Fonts.InterRegular,
      fontSize: normalize(10),
      position: 'absolute',
      bottom: normalize(-15),
    },
    dropDownIcon: {
      height: 20,
      width: 20,
      resizeMode: 'contain',
      transform: [{rotate: isFocus ? '180deg' : '0deg'}],
    },
    dropdown: {
      height: normalize(40),
      borderRadius: normalize(6),
      paddingHorizontal: normalize(12),
    },
    placeholderStyle: {
      color: Colors.river_bed,
    },
    selectedTextStyle: {
      color: Colors.dark,
      fontFamily: Fonts.InterRegular,
      fontSize: normalize(14),
    },
  });

export default DropDown;
