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
import {showMessage} from '../../utils/helper/Toast';
import {validMinLength} from '../../utils/helper/Validation';
import {signIn} from '../../utils/service/AuthService';
import Loader from '../../components/custom/Loader';

const SignIn2 = ({navigation, route}) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  const [password, setPassword] = useState('');
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

    if (password == '') {
      showMessage('Password is required.');
      isValid = false;
    } else if (!validMinLength.test(password)) {
      showMessage('Password must be at least 8 characters long.');
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateFields()) {
      try {
        setIsLoading(true);
        const result = await dispatch(
          signIn({
            email: authState.email,
            password,
          }),
        );
        setIsLoading(false);
        showMessage(result.message);
        if (!result?.success) {
          return;
        }
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

            <Text style={styles.backTitle}>{authState?.email}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Enter your password</Text>
          <TextInput
            value={password}
            onChangeText={v => setPassword(v)}
            title="Password"
            secureTextEntry={true}
          />
          <Button
            onPress={() => handleSubmit()}
            title={'Log in'}
            marginTop={normalize(15)}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.v3}>
            <Text style={styles.forgotTxt}>Forgot your password?</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default SignIn2;

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
  v3: {
    marginLeft: '5%',
    marginTop: normalize(15),
    alignSelf: 'flex-start',
  },
  forgotTxt: {
    fontSize: normalize(12),
    color: Colors.ball_blue,
    fontFamily: Fonts.InterMedium,
    textDecorationLine: 'underline',
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
});
