import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts} from '../../themes/Themes';

const InputMultiline = ({
  textInputRef,
  value,
  onChangeText = () => {},
  keyboardType = 'default',
  isRequired = false,
  title = 'Enter input title',
  placeholder = '',
  rightIcon = undefined,
  onPressRight = () => {},
  editable = true,
  bottomOption = '',
  onPressBottom = () => {},
  marginTop = normalize(7),
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const styles = customStyles(marginTop, isFocus);
  return (
    <View style={styles.mainContainer}>
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
        <TextInput
          ref={textInputRef}
          value={value}
          editable={editable}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={Colors.river_bed}
          textAlignVertical='top'
          style={styles.textInput}
          onFocus={() => {
            setIsFocus(true);
            onFocus();
          }}
          onBlur={() => {
            setIsFocus(false);
            onBlur();
          }}
          multiline
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
      height: normalize(100),
      borderRadius: normalize(6),
      borderColor: isFocus ? Colors.dark : Colors.iron,
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
    textInput: {
      height: normalize(100),
      paddingHorizontal: normalize(10),
      color: Colors.mist_blue,
      fontFamily: Fonts.InterRegular,
      fontSize: normalize(12),
      width: '100%',
      paddingVertical: normalize(10)
    },
  });

export default InputMultiline;
