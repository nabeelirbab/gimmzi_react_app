import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Icons, Images} from '../../themes/Themes';
import MyStatusBar from '../../components/custom/MyStatusBar';
import normalize from '../../utils/orientation/normalize';
import TextInput from '../../components/input/TextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/button/Button';
import {useFocusEffect} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
  capitalizeString,
  formatString,
  validateEmail,
} from '../../utils/helper/Validation';
import {showMessage} from '../../utils/helper/Toast';
import {forgotPassword} from '../../utils/service/AuthService';
import Loader from '../../components/custom/Loader';

const ForgotPassword = ({navigation}) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  const [email, setEmail] = useState(authState?.email ? authState?.email : '');
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
    }, []),
  );

  const validateFields = () => {
    let isValid = true;

    if (email == '') {
      showMessage('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showMessage('Please enter a valid email address');
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateFields()) {
      try {
        setIsLoading(true);
        const result = await dispatch(forgotPassword({email}));
        setIsLoading(false);

        showMessage(formatString(result?.message));
        if (!result?.success) {
          return;
        }
        navigation.goBack();
      } catch (error) {
        console.log('Error in handleSignIn:', error);
      }
    }
  }

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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backContainer}>
            <Image source={Icons.left_arrow} style={styles.backImg} />

            <Text style={styles.backTitle}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Forgot your password?</Text>

          <Text style={styles.subTitle}>
            Enter your email address and will send you a link for the password
            reset.
          </Text>

          <TextInput
            value={email}
            onChangeText={v => setEmail(v)}
            title="Your email address"
          />
          <Button
            onPress={() => handleSubmit()}
            title={'Send reset link'}
            marginTop={normalize(15)}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default ForgotPassword;

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
    marginTop: normalize(10),
    marginBottom: normalize(20),
  },
  backContainer: {
    flexDirection: 'row',
    height: 35,
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: normalize(20),
    marginLeft: '5%',
  },
  backImg: {
    height: normalize(10),
    width: normalize(10),
    resizeMode: 'contain',
    tintColor: Colors.pale_sky,
    marginRight: normalize(10),
  },
  backTitle: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pale_sky,
    fontSize: normalize(12),
  },
  subTitle: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.pale_sky,
    fontSize: normalize(12),
    width: '90%',
    alignSelf: 'center',
    marginBottom: normalize(20),
  },
});
