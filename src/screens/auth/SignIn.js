import {View, Text, StyleSheet, Image, StatusBar, Platform, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Images} from '../../themes/Themes';
import MyStatusBar from '../../components/custom/MyStatusBar';
import normalize from '../../utils/orientation/normalize';
import TextInput from '../../components/input/TextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/button/Button';
import {useFocusEffect} from '@react-navigation/native';
import {useAppDispatch} from '../../redux';
import {checkEmail} from '../../utils/service/AuthService';
import {showMessage} from '../../utils/helper/Toast';
import {validateEmail} from '../../utils/helper/Validation';
import Loader from '../../components/custom/Loader';
import { setUserStatus } from '../../redux/slice/auth.slice';
import Storage from '../../utils/stroage';

const SignIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
    }, []),
  );

  const handleCheckEmail = async email => {
    if (!email) {
      showMessage('Email is required.');
      return;
    }

    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const result = await dispatch(
        checkEmail({
          email: email.toLowerCase(),
        }),
      );
      setIsLoading(false);

      // showMessage(result?.message);
      if (result?.success) {
        navigation.navigate('SignIn2');
      }
    } catch (error) {
      console.log('Error in handleSignIn:', error);
    }
  };

  return (
    <View style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle={'light-content'} />
      <Loader visible={isLoading} />
      <View style={styles.v1}>
        <Image source={Images.logo} style={styles.logo} />
      </View>
      <View style={styles.v2}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingBottom: normalize(30),
          }}>
          <Text style={styles.title}>Log in or create an account</Text>
          <TextInput
            value={email}
            onChangeText={v => setEmail(v)}
            title="Your email address"
            isRequired={true}
            autoCapitalize={'none'}
          />
          <Button
            onPress={() => handleCheckEmail(email)}
            title={'Next'}
            marginTop={normalize(15)}
          />

          <TouchableOpacity
          onPress={()=>{
            navigation.navigate('TabNavigation')
          }}
          >
            <Text style={styles.guestText}>Login as a Guest</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By creating an account, you agree to our
            {<Text style={{color: Colors.ball_blue}}> Privacy policy </Text>}
            and
            {<Text style={{color: Colors.ball_blue}}> Terms of use.</Text>}
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
  },
  v1: {
    backgroundColor: Colors.dark,
    height: normalize(110),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: normalize(150),
    width: normalize(150),
    resizeMode: 'contain',
  },
  v2: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  title: {
    fontSize: normalize(24),
    color: Colors.dark,
    fontFamily: Fonts.InterBold,
    width: '90%',
    alignSelf: 'center',
    marginTop: normalize(25),
    marginBottom: normalize(20),
  },
  terms: {
    fontSize: normalize(12),
    alignSelf: 'center',
    color: Colors.dark,
    marginTop: normalize(18),
    fontFamily: Fonts.InterMedium,
    width: '90%',
  },
  guestText:{
    textAlign: 'center',
    color: Colors.ball_blue,
    marginTop: normalize(10),
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
    textDecorationLine: 'underline',
  }
});
