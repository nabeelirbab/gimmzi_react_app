import {
  View,
  Text,
  TextInput as Input,
  TouchableOpacity,
  Image,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import {horizontalScale} from '../../utils/orientation/scaleDimensions';

const TextInput = ({
  value,
  onChangeText = () => {},
  keyboardType = 'default',
  isRequired = false,
  title = 'Enter input title',
  secureTextEntry = null,
  isShowTitle = true,
  placeholder = '',
  placeholderColor = Colors.pickled_bluewood,
  leftIcon = null,
  marginVertical = normalize(5),
  isVSecureIconTop = true,
  bottomOptionTitle = '',
  onPressBottom = () => {},
  editable = true,
  rightIcon = null,
  onPressRight = () => {},
  titleFontFamily = Fonts.InterRegular,
  width = '90%',
  borderColor,
  height = normalize(40),
  backgroundColor = undefined,
  textAlign = undefined,
  fontSize = normalize(14),
  isShowInput = true,
  tintColor = Colors.dark,
  maxLength = undefined,
  onPress = () => {},
  loading = false,
  defaultValue = '',
  autoCapitalize
}) => {
  const [isSequre, setIsSequre] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (secureTextEntry !== null && secureTextEntry !== undefined) {
      setIsSequre(secureTextEntry);
    } else {
      setIsSequre(false);
    }
  }, [secureTextEntry]);

  return (
    <View
      style={{
        width: width,
        alignSelf: 'center',
        marginVertical: marginVertical,
      }}>
      {title && isShowTitle && (
        <Text
          numberOfLines={1}
          style={{
            fontSize: normalize(12),
            color: Colors.dark,
            marginBottom: normalize(7),
            fontFamily: titleFontFamily,
          }}>
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
      {secureTextEntry !== null &&
        secureTextEntry !== undefined &&
        isVSecureIconTop && (
          <TouchableOpacity
            onPress={() => setIsSequre(!isSequre)}
            style={{
              width: normalize(40),
              height: normalize(18),
              position: 'absolute',
              right: 0,
            }}>
            <Image
              source={isSequre ? Icons.hidden : Icons.show}
              style={{
                width: normalize(17),
                height: normalize(17),
                resizeMode: 'contain',
                alignSelf: 'flex-end',
                tintColor: tintColor,
              }}
            />
          </TouchableOpacity>
        )}
      <View
        style={{
          width: '100%',
          height: height,
          borderRadius: normalize(6),
          borderColor: borderColor
            ? borderColor
            : isFocus
            ? Colors.dark
            : Colors.iron,
          borderWidth: normalize(1),
          justifyContent: 'center',
          backgroundColor: backgroundColor,
        }}>
        {leftIcon !== null && (
          <Image
            source={leftIcon}
            style={{
              width: normalize(17),
              height: normalize(17),
              resizeMode: 'contain',
              tintColor: tintColor,
              position: 'absolute',
              left: normalize(10),
            }}
          />
        )}
        {isShowInput ? (
          <Input
            defaultValue={defaultValue}
            value={value}
            editable={editable}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={isSequre}
            placeholderTextColor={placeholderColor}
            textAlign={textAlign}
            autoCapitalize={autoCapitalize?autoCapitalize:'sentences'}
            style={{
              height: normalize(48),
              paddingHorizontal: normalize(10),
              color: Colors.dark,
              fontFamily: Fonts.InterRegular,
              fontSize: fontSize,
              marginLeft: leftIcon !== null ? normalize(30) : 0,
              marginRight:
                (!isVSecureIconTop &&
                  secureTextEntry !== null &&
                  secureTextEntry !== undefined) ||
                rightIcon !== null ||
                loading
                  ? normalize(40)
                  : 0,
            }}
            maxLength={maxLength}
            placeholder={placeholder}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        ) : (
          <Text
            numberOfLines={1}
            style={{
              paddingHorizontal: normalize(10),
              color: Colors.dark,
              fontFamily: Fonts.InterRegular,
              fontSize: fontSize,
              width: '90%',
            }}>
            {/* {value} */}
          </Text>
        )}

        {(secureTextEntry !== null &&
          secureTextEntry !== undefined &&
          !isVSecureIconTop) ||
        rightIcon !== null ? (
          <TouchableOpacity
            onPress={() => {
              if (rightIcon !== null) {
                onPressRight();
              } else {
                setIsSequre(!isSequre);
              }
            }}
            style={{
              width: normalize(40),
              height: normalize(40),
              position: 'absolute',
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                rightIcon !== null
                  ? rightIcon
                  : isSequre
                  ? Icons.hide
                  : Icons.visible
              }
              style={{
                width: normalize(17),
                height: normalize(17),
                resizeMode: 'contain',
                tintColor: tintColor,
              }}
            />
          </TouchableOpacity>
        ) : null}

        {loading && (
          <ActivityIndicator
            color={Colors.dark}
            style={{
              position: 'absolute',
              right: horizontalScale(15),
            }}
          />
        )}
      </View>

      {bottomOptionTitle !== '' && (
        <Text
          onPress={() => onPressBottom()}
          style={{
            color: Colors.ball_blue,
            fontFamily: Fonts.InterRegular,
            fontSize: normalize(10),
            marginTop: normalize(5),
          }}>
          {bottomOptionTitle}
        </Text>
      )}

      {!editable && (
        <Pressable
          onPress={() => onPress()}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
        />
      )}
    </View>
  );
};

export default TextInput;
