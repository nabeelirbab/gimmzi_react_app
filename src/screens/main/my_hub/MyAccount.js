import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Keyboard,
  Platform,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Colors, Fonts, Icons, Images} from '../../../themes/Themes';
import normalize from '../../../utils/orientation/normalize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../../components/button/Button';
import TopHeader from '../../../components/importent/TopHeader';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import {useFocusEffect} from '@react-navigation/native';
import TextInput from '../../../components/input/TextInput';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {getCityAndStateFromZip} from '../../../utils/service/AuthService';
import {showMessage} from '../../../utils/helper/Toast';
import Picker from '../../../components/modal/Picker';
import {GimmziContext} from '../../../utils/helper/GimmziBoundary';
import {
  horizontalScale,
  verticalScale,
} from '../../../utils/orientation/scaleDimensions';
import {
  validMinLength,
  validPhoneNumber,
  validZipCode,
} from '../../../utils/helper/Validation';
import {
  getUserDetails,
  updateUserDetails,
} from '../../../utils/service/UserService';
import Loader from '../../../components/custom/Loader';
import _ from 'lodash';

const MyAccount = ({navigation}) => {
  const context = useContext(GimmziContext);
  const dispatch = useAppDispatch();
  const userState = useAppSelector(state => state.user);
  const UD = userState?.userInfo?.user;

  // console.log('UD - - - ', UD);

  const [info, setInfo] = useState({
    first_name: UD?.first_name || '',
    last_name: UD?.last_name || '',
    phone: UD?.phone || '',
    dob: UD?.date_of_birth,
    zip_code: UD?.zip_code || '',
    user_photo: {}, // :file($text)
    old_password: '',
    new_password: '',
  });

  const [info2, setInfo2] = useState({
    email: UD?.email,
    imageUrl: UD?.consumer_profile_image
      ? {
          uri: UD?.consumer_profile_image,
          cache: 'reload',
        }
      : '',
    state: UD?.state,
    city: UD?.city,
  });

  function updateState(key, value) {
    setInfo(state => ({
      ...state,
      [key]: value,
    }));
  }

  function updateState2(key, value) {
    setInfo2(state => ({
      ...state,
      [key]: value,
    }));
  }

  const [selectDate, setSelectDate] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
      getStateandCity();
    }, []),
  );

  const getStateandCity = async () => {
    const result = await getCityAndStateFromZip(info?.zip_code);
    setInfo2(state => ({
      ...state,
      state: result?.state || '',
      city: result?.city || '',
    }));
  };

  const validateFields = () => {
    let isValid = true;
    // Get today's date
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 16);

    if (info.first_name.trim() == '') {
      showMessage('First Name is required');
      isValid = false;
    } else if (info.first_name.length < 2 || info.first_name.length > 15) {
      showMessage('First Name should be between 2 and 15 characters');
      isValid = false;
    } else if (info.last_name.trim() == '') {
      showMessage('Last Name is required');
      isValid = false;
    } else if (info.last_name.length < 2 || info.last_name.length > 15) {
      showMessage('Last Name should be between 2 and 15 characters');
      isValid = false;
    } else if (!info.phone.trim()) {
      showMessage('Phone number is required');
      isValid(false);
    } else if (!validPhoneNumber.test(info.phone)) {
      showMessage('Phone number must be exactly 10 digits.');
      isValid(false);
    } else if (info.dob == '') {
      showMessage('Date of birth is required');
      isValid = false;
    } else if (selectDate !== '' && selectDate > today) {
      showMessage('Date of birth cannot be in the future.');
      isValid = false;
    } else if (selectDate !== '' && selectDate > minDate) {
      showMessage('Invalid date, You must be at least 16 years old.');
      isValid = false;
    } else if (info.zip_code == '') {
      showMessage('Zip Code is required');
      isValid = false;
    } else if (!validZipCode.test(info.zip_code)) {
      showMessage('Invalid zip code');
      isValid = false;
    } else if (info2.city == '' && info2.state == '') {
      showMessage('Please enter a valid zip code');
      isValid = false;
    } else if (!validZipCode.test(info.zip_code)) {
      showMessage('Invalid zip code');
      isValid = false;
    }
    if (info.old_password?.trim() !== '') {
      if (!validMinLength.test(info.old_password)) {
        showMessage('Current password must be at least 8 characters long.');
        isValid = false;
      } else if (info.new_password?.trim() == '') {
        showMessage('New password is required.');
        isValid = false;
      } else if (!validMinLength.test(info.new_password)) {
        showMessage('New password must be at least 8 characters long.');
        isValid = false;
      }
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateFields()) {
      let obj = {};

      if (info?.first_name !== UD?.first_name) {
        obj.first_name = info?.first_name;
      }

      if (info?.last_name !== UD?.last_name) {
        obj.last_name = info?.last_name;
      }

      if (info?.phone !== UD?.phone) {
        obj.phone = info?.phone;
      }

      if (info?.dob !== UD?.date_of_birth) {
        obj.dob = info?.dob;
      }

      if (info?.zip_code !== UD?.zip_code) {
        obj.zip_code = info?.zip_code;
      }

      if (!_.isEmpty(info?.user_photo)) {
        obj.user_photo = info?.user_photo;
      }

      if (info?.old_password !== '') {
        obj.old_password = info?.old_password;
      }

      if (info?.new_password !== '') {
        obj.new_password = info?.new_password;
      }

      if (info2?.city !== UD?.city) {
        obj.city = info2?.city;
      }
      if (info2?.state !== UD?.state) {
        obj.state = info2?.state;
      }

      try {
        setIsLoading(true);
        const result = await dispatch(updateUserDetails(obj));
        setIsLoading(false);
        showMessage(result?.message);
        if (!result?.success) {
          return;
        }
        const updateInfo = await dispatch(getUserDetails());
        navigation.goBack();
      } catch (error) {
        console.log('Error in handleSignIn:', error);
      }
    }
  }

  return (
    <SafeAreaView style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <Loader visible={isLoading} />
      <TopHeader title="My Account" />
      <View
        style={styles.v2}
        onStartShouldSetResponder={() => Keyboard.dismiss()}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingBottom: normalize(30),
          }}>
          <ImageBackground
            source={info2?.imageUrl ? info2?.imageUrl : Images.user}
            resizeMode="contain"
            borderRadius={normalize(75)}
            style={styles.profileImg}>
            <TouchableOpacity
              onPress={() => setIsPickerVisible(true)}
              style={styles.v3}>
              <Image source={Icons.edit} style={styles.edit} />
            </TouchableOpacity>
          </ImageBackground>
          <Text style={styles.title2}>Your Information</Text>

          <TextInput
            value={info?.first_name}
            onChangeText={v => updateState('first_name', v)}
            title="First Name"
            placeholder="Enter your first name"
            titleFontFamily={Fonts.InterMedium}
          />

          <TextInput
            value={info?.last_name}
            onChangeText={v => updateState('last_name', v)}
            title="Last Name"
            placeholder="Enter your last name"
            titleFontFamily={Fonts.InterMedium}
          />

          <TextInput
            value={info2.email}
            onChangeText={v => updateState2('email', v)}
            title="Email"
            keyboardType={'email-address'}
            placeholder="Enter your email address"
            titleFontFamily={Fonts.InterMedium}
            editable={false}
            backgroundColor={Colors.catskill_white}
          />

          <TextInput
            value={info?.phone}
            onChangeText={v => updateState('phone', v)}
            title="Phone"
            keyboardType="numeric"
            placeholder="Enter your phone number"
            titleFontFamily={Fonts.InterMedium}
            maxLength={10}
          />

          <TextInput
            value={info?.dob}
            title="DOB"
            editable={false}
            placeholder="MM-DD-YYYY"
            rightIcon={Icons.calender}
            placeholderColor={Colors.santa_grey}
            onPress={() => setIsVisible(true)}
          />

          <TextInput
            value={info?.zip_code}
            onChangeText={async v => {
              updateState('zip_code', v);
              if (v.length === 5 || v.length === 6) {
                const result = await getCityAndStateFromZip(v);
                if (result) {
                  updateState2('city', result?.city);
                  updateState2('state', result?.state);
                } else {
                  showMessage(
                    'Unable to fetch location details. Please try again.',
                  );
                }
              } else {
                updateState2('city', '');
                updateState2('state', '');
              }
            }}
            title="My Zip Code"
            keyboardType="numeric"
            placeholder="Enter your zip code"
            onPressBottom={() => console.log('-->> onPressBottom')}
            titleFontFamily={Fonts.InterMedium}
            maxLength={6}
            bottomOptionTitle={`${
              info2?.city !== null &&
              info2?.city !== undefined &&
              info2?.city !== ''
                ? info2?.city + ','
                : ''
            } ${
              info2?.state !== null &&
              info2?.state !== undefined &&
              info2?.state !== ''
                ? info2?.state
                : ''
            } `}
          />

          <Text style={styles.title3}>Change Your Password</Text>

          <TextInput
            value={info?.old_password}
            onChangeText={v => updateState('old_password', v)}
            title="Current Password"
            placeholder="**********"
            secureTextEntry={true}
            isVSecureIconTop={false}
            bottomOptionTitle="Forgot Password?"
            onPressBottom={() => navigation.navigate('ForgotPassword')}
            titleFontFamily={Fonts.InterMedium}
          />

          <TextInput
            value={info?.new_password}
            onChangeText={v => updateState('new_password', v)}
            title="New Password"
            placeholder="**********"
            secureTextEntry={true}
            isVSecureIconTop={false}
            titleFontFamily={Fonts.InterMedium}
          />

          <Button
            onPress={() => handleSubmit()}
            title={'Save Changes'}
            marginTop={normalize(18)}
            fontFamily={Fonts.InterMedium}
            fontSize={normalize(15)}
          />
        </KeyboardAwareScrollView>

        <DatePicker
          modal
          mode="date"
          open={isVisible}
          date={selectDate || new Date()}
          onConfirm={date => {
            setSelectDate(date);
            updateState('dob', moment(date).format('MM-DD-YYYY'));
            setIsVisible(false);
          }}
          maximumDate={new Date()}
          onCancel={() => {
            setIsVisible(false);
          }}
        />

        {/* Profile Image Picker */}
        <Picker
          isVisible={isPickerVisible}
          onBackdropPress={() => setIsPickerVisible(false)}
          height={verticalScale(250)}
          isTabLine={true}
          children={
            <View style={styles.v1}>
              <Text style={styles.t1}>Select Image</Text>

              {['Take Photo', 'Choose from Library...'].map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (index == 0) {
                        context.getImageFromCamera(img => {
                          setIsPickerVisible(false);
                          if (img) {
                            updateState2('imageUrl', {
                              uri: img?.uri,
                              cache: 'reload',
                            });
                            updateState('user_photo', img?.path);
                          }
                        });
                      } else {
                        context.getImageFromGallery(img => {
                          setIsPickerVisible(false);
                          if (img) {
                            updateState2('imageUrl', {
                              uri: img?.uri,
                              cache: 'reload',
                            });
                            updateState('user_photo', img?.path);
                          }
                        });
                      }
                    }}
                    style={[
                      {
                        backgroundColor:
                          index == 0 ? Colors.white : Colors.ball_blue,
                        borderColor: Colors.ball_blue,
                      },
                      styles.touch,
                    ]}>
                    <Image
                      source={index == 0 ? Icons.camera : Icons.gallery}
                      style={{
                        resizeMode: 'contain',
                        height: 22,
                        width: 22,
                        tintColor: index == 0 ? Colors.ball_blue : Colors.white,
                      }}
                    />
                    <Text
                      style={{
                        marginLeft: index == 0 ? 10 : 10,
                        marginRight: index == 1 ? 10 : 0,
                        color: index == 0 ? Colors.ball_blue : Colors.white,
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: 16,
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
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
  title2: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(15),
    marginLeft: normalize(15),
    marginBottom: normalize(6),
  },
  title3: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(15),
    marginLeft: normalize(15),
    marginBottom: normalize(10),
    marginTop: normalize(35),
  },
  profileImg: {
    height: normalize(75),
    width: normalize(75),
    alignSelf: 'center',
    marginTop: normalize(20),
    marginBottom: normalize(20),
  },
  v3: {
    backgroundColor: Colors.tropical_blue,
    height: normalize(28),
    width: normalize(28),
    borderRadius: normalize(28),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: normalize(-2),
    right: normalize(-5),
    borderColor: Colors.water,
    borderWidth: normalize(2),
  },
  edit: {
    resizeMode: 'contain',
    height: normalize(14),
    width: normalize(14),
  },
  v1: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: verticalScale(15),
  },
  t1: {
    color: Colors.crocodile,
    fontFamily: Fonts.NunitoBold,
    fontSize: horizontalScale(22),
    marginBottom: verticalScale(10),
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginVertical: 8,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
  },
});
