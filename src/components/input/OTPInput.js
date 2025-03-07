import React, {useState, useRef} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts} from '../../themes/Themes';
import {moderateScale} from '../../utils/orientation/scaleDimensions';

const OTPInput = ({
  length = 6,
  onChangeOTP,
  width = '100%',
  keyboardType = 'default',
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputs = useRef([]);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onChangeOTP && onChangeOTP(newOtp.join(''));

    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: width,
        },
      ]}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          value={otp[index]}
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          style={[
            styles.input,
            {
              backgroundColor: otp[index] ? Colors.white : Colors.dawn_pink,
              borderColor: otp[index] ? Colors.ball_blue : Colors.dawn_pink,
            },
          ]}
          keyboardType={keyboardType}
          maxLength={1}
          ref={ref => (inputs.current[index] = ref)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: normalize(30),
    height: normalize(30),
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: moderateScale(20),
    color: Colors.pickled_bluewood,
    fontFamily: Fonts.InterSemiBold,
    padding: 0,
    textAlignVertical: 'center',
  },
  filledInput: {
    backgroundColor: '#ffffff',
  },
});

export default OTPInput;
