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
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {
  countUppercase,
  validMinLength,
  validateEmail,
  validZipCode,
  validPhoneNumber,
  isValidPhoneNumber,
} from '../../utils/helper/Validation';
import {getCityAndStateFromZip, signUp} from '../../utils/service/AuthService';
import {showMessage} from '../../utils/helper/Toast';
import Loader from '../../components/custom/Loader';

const SignUp = ({navigation}) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  const [info, setInfo] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: authState?.email,
    dob: '',
    zip_code: '',
    city: '',
    state: '',
  });
  console.log('info', info);

  const [selectDate, setSelectDate] = useState('');
  // console.log(selectDate, 'selectDate');

  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayDate, setDisplayDate] = useState('');

  const updateState = (field, value) => {
    setInfo(state => ({
      ...state,
      [field]: value,
    }));
  };

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
    }, []),
  );

  function CheckingPassword(title, _length, value, style) {
    return (
      <View style={styles.v3}>
        <View style={styles.dot} />
        <Text style={[styles.title1, style]}>{title}</Text>
        <Text style={[styles.title1, style]}>{`${value} / ${_length}`}</Text>
      </View>
    );
  }

  const validateFields = () => {
    let isValid = true;

    // Get today's date
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 13);

    if (info?.first_name == '') {
      showMessage('First name is required');
      isValid = false;
    } else if (info?.first_name?.length < 2 || info?.first_name?.length > 15) {
      showMessage('First name should be between 2 and 15 characters');
      isValid = false;
    } else if (info?.last_name == '') {
      showMessage('Last name is required');
      isValid = false;
    } else if (info?.last_name?.length < 2 || info?.last_name?.length > 15) {
      showMessage('Last name should be between 2 and 15 characters');
      isValid = false;
    } else if (info?.email == '') {
      showMessage('Email is required');
      isValid = false;
    } else if (!validateEmail(info?.email)) {
      showMessage('Please enter a valid email address');
      isValid = false;
    } else if (info?.phone.trim() == '') {
      showMessage('Phone number is required');
      isValid = false;
    } else if (!validPhoneNumber.test(info?.phone)) {
      showMessage('Phone number must be exactly 10 digits.');
      isValid = false;
    } else if (!isValidPhoneNumber(info?.phone)) {
      showMessage('Please enter a valid phone number');
      isValid = false;
    } else if (info?.dob == '') {
      showMessage('Date of birth is required');
      isValid = false;
    } else if (selectDate > today) {
      showMessage('Date of birth cannot be in the future.');
      isValid = false;
    } else if (selectDate > minDate) {
      showMessage('Invalid date, You must be at least 13 years old.');
      isValid = false;
    } else if (info?.zip_code == '') {
      showMessage('Zip code is required');
      isValid = false;
    } else if (!validZipCode.test(info?.zip_code)) {
      showMessage('Invalid zip code');
      isValid = false;
    } else if (info?.city == '' && info?.state == '') {
      showMessage('Please enter a valid zip code');
      isValid = false;
    } else if (password == '') {
      showMessage('Password is required.');
      isValid = false;
    } else if (!validMinLength.test(password)) {
      showMessage('Password must be at least 8 characters long.');
      isValid = false;
    } else if (!hasUppercase) {
      showMessage('Password must contain at least one uppercase letter.');
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateFields()) {
      try {
        setIsLoading(true);
        const result = await dispatch(
          signUp({
            ...info,
            consumer_password: password,
            consumer_confirm_password: password,
          }),
        );

        setIsLoading(false);
        showMessage(result?.message);
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
            paddingBottom: normalize(50),
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backContainer}>
            <Image source={Icons.left_arrow} style={styles.backImg} />

            <Text style={styles.backTitle}>{authState?.email}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {/* Create a password for your new account */}
            Create your account
          </Text>

          <TextInput
            value={info.first_name}
            onChangeText={v => updateState('first_name', v)}
            title="First Name"
          />

          <TextInput
            value={info.last_name}
            onChangeText={v => updateState('last_name', v)}
            title="Last Name"
          />

          <TextInput
            value={info?.email}
            onChangeText={v => updateState('email', v)}
            title="Email"
          />

          <TextInput
            value={info?.phone}
            onChangeText={v => updateState('phone', v)}
            title="Phone"
            keyboardType="numeric"
            maxLength={10}
          />

          <TextInput
            value={displayDate}
            title="DOB"
            editable={false}
            placeholder="MM-DD-YYYY"
            placeholderColor={Colors.santa_grey}
            onPress={() => setIsVisible(true)}
            rightIcon={Icons.calender}
          />

          <TextInput
            value={info?.zip_code}
            onChangeText={async v => {
              updateState('zip_code', v);

              if (v.length === 5 || v.length === 6) {
                const result = await getCityAndStateFromZip(v);
                console.log('result getCityAndStateFromZip', result, v);

                if (result) {
                  updateState('city', result?.city);
                  updateState('state', result?.state);
                } else {
                  showMessage(
                    'Unable to fetch location details. Please try again.',
                  );
                }
              } else {
                updateState('city', '');
                updateState('state', '');
              }
            }}
            keyboardType="numeric"
            title="Zip Code"
            maxLength={6}
            bottomOptionTitle={`${
              info?.city !== null &&
              info?.city !== undefined &&
              info?.city !== ''
                ? info?.city + ','
                : ''
            } ${
              info?.state !== null &&
              info?.state !== undefined &&
              info?.state !== ''
                ? info?.state
                : ''
            } `}
          />

          <TextInput
            value={password}
            onChangeText={v => {
              setPassword(v);
              setHasUppercase(/[A-Z]/.test(v));
            }}
            title="Password"
            secureTextEntry={true}
          />

          <Text style={styles.subTitle}>
            Your password should have at least:
          </Text>
          {CheckingPassword('8 characters', 8, password?.length)}
          {CheckingPassword(
            '1 uppercase letter',
            1,
            countUppercase(password),
            !hasUppercase && password ? {color: Colors.brick_red} : {},
          )}
          <Button
            onPress={() => handleSubmit()}
            title={'Create account'}
            marginTop={normalize(45)}
          />
          <Text style={styles.terms}>
            By creating an account, you agree to our
            {<Text style={{color: Colors.ball_blue}}> Privacy policy </Text>}
            and
            {<Text style={{color: Colors.ball_blue}}> Terms of use.</Text>}
          </Text>
        </KeyboardAwareScrollView>
      </View>

      {/* <DatePicker
        modal
        mode="date"
        open={isVisible}
        date={selectDate || new Date()}
        onConfirm={date => {
          setSelectDate(date);
          updateState('dob', moment(date).format('DD-MM-YYYY'));
          setIsVisible(false);
        }}
        maximumDate={new Date()}
        onCancel={() => {
          setIsVisible(false);
        }}
      /> */}
      <DatePicker
        modal
        mode="date"
        open={isVisible}
        date={selectDate || new Date()}
        onConfirm={date => {
          const displayDate = moment(date).format('MM-DD-YYYY'); 
          const storedDate = moment(date).format('DD-MM-YYYY');
          setSelectDate(date); 
          updateState('dob', storedDate); 
          setDisplayDate(displayDate); 
          setIsVisible(false);
        }}
        maximumDate={new Date()}
        onCancel={() => {
          setIsVisible(false);
        }}
      />
    </View>
  );
};

export default SignUp;

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
  terms: {
    fontSize: normalize(12),
    alignSelf: 'center',
    color: Colors.dark,
    marginTop: normalize(18),
    fontFamily: Fonts.InterMedium,
    width: '90%',
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
    marginVertical: normalize(8),
  },
  v3: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: normalize(12),
    marginVertical: normalize(2),
  },
  dot: {
    width: normalize(4),
    height: normalize(4),
    borderRadius: normalize(8),
    backgroundColor: Colors.pale_sky,
    position: 'absolute',
  },
  title1: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(12),
    color: Colors.pale_sky,
  },
  title2: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(10),
    color: Colors.ball_blue,
    alignSelf: 'center',
    width: '90%',
  },
});
