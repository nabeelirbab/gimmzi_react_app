import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts} from '../../themes/Themes';

export default function Button(props) {
  function isOnPress() {
    if (props.onPress) {
      props.onPress();
    }
  }

  function isLongPress() {
    if (props.onLongPress) {
      props.onLongPress();
    }
  }

  return (
    <TouchableOpacity
      disabled={props.disabled}
      activeOpacity={props.activeOpacity}
      style={{
        height: props.height,
        position: props.position,
        bottom: props.bottom,
        width: props.width,
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: props.alignSelf,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginHorizontal: props.marginHorizontal,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        borderColor: props.borderColor,
        borderWidth: props.borderWidth,
        flexDirection: 'row',
        paddingLeft: props?.paddingLeft,
        paddingRight: props?.paddingRight,
        // shadowRadius: 6,
        // shadowOffset: { height: 3, width: 3 },
        // shadowOpacity: 0.65,
        // shadowColor: '#00000033',
        // elevation: 0.2,
      }}
      onLongPress={() => isLongPress()}
      onPress={() => isOnPress()}>
      {props?.loading ? (
        <ActivityIndicator
        color={Colors.white}
        />
      ) : (
        <>
          {props?.leftIcon && (
            <Image
              source={props?.leftIcon}
              style={[styles.iconStyle, props?.iconStyle]}
            />
          )}
          <Text
            style={{
              fontFamily: props.fontFamily,
              color: props.textColor,
              fontSize: props.fontSize,
              marginTop: 0,
              textAlign: props.textAlign,
              letterSpacing: props.letterSpacing,
              opacity: props.textOpacity,
              marginHorizontal: 4,
            }}>
            {props?.title}
          </Text>
          {props?.rightIcon && (
            <Image
              source={props?.rightIcon}
              style={[styles.iconStyle, props?.iconStyle]}
            />
          )}
          {/* <Text
        style={{
          fontFamily: props.fontFamily,
          color: props.textColor,
          fontSize: props.fontSize,
          marginTop: 0,
          textAlign: props.textAlign,
          letterSpacing: props.letterSpacing,
          opacity: props.textOpacity,
        }}>
        {props.title}
      </Text> */}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    height: normalize(16),
    width: normalize(16),
    resizeMode: 'contain',
  },
});

Button.propTypes = {
  height: PropTypes.number,
  width: PropTypes.any,
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
  textColor: PropTypes.string,
  fontSize: PropTypes.number,
  title: PropTypes.string,
  onLongPress: PropTypes.func,
  onPress: PropTypes.func,
  alignSelf: PropTypes.string,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginHorizontal: PropTypes.number,
  textMarginTop: PropTypes.number,
  fontWeight: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  textAlign: PropTypes.string,
  fontFamily: PropTypes.string,
  marginLeft: PropTypes.any,
  marginRight: PropTypes.any,
  activeOpacity: PropTypes.number,
  letterSpacing: PropTypes.number,
  textOpacity: PropTypes.number,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes?.number,
  iconStyle: PropTypes?.object,
  loading: PropTypes?.bool,
  position: PropTypes?.string,
  bottom: PropTypes?.number,
};

Button.defaultProps = {
  height: normalize(40),
  width: '90%',
  backgroundColor: Colors.ball_blue,
  borderRadius: normalize(6),
  textColor: Colors.white,
  fontSize: normalize(16),
  title: '',
  onLongPress: null,
  onPress: null,
  alignSelf: 'center',
  marginTop: 0,
  marginBottom: 0,
  marginHorizontal: 0,
  textMarginTop: 0,
  fontWeight: '',
  borderColor: Colors.ball_blue,
  borderWidth: 1,
  textAlign: 'center',
  fontFamily: Fonts.InterSemiBold,
  marginLeft: 0,
  marginRight: 0,
  activeOpacity: 0.5,
  letterSpacing: 0,
  textOpacity: 1,
  disabled: false,
  leftIcon: null,
  rightIcon: null,
  paddingLeft: 0,
  paddingRight: 0,
  iconStyle: {},
  loading: false,
  position: 'relative',
  bottom: undefined
};
