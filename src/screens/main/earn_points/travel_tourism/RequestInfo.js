import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Colors, Fonts, Icons, Images} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import DropDown from '../../../../components/dropdown/DropDown';
import InputMultiline from '../../../../components/input/InputMultiline';
import Button from '../../../../components/button/Button';
import MyStatusBar from '../../../../components/custom/MyStatusBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInput from '../../../../components/input/TextInput';

const dropdownList = [
  {label: '00', value: '00'},
  {label: '01', value: '01'},
  {label: '02', value: '02'},
  {label: '03', value: '03'},
  {label: '04', value: '04'},
  {label: '05', value: '05'},
];

const listingList = [
  {label: 'OAK Hotel', value: 'OAK Hotel'},
  {label: 'PR Hotel', value: 'PR Hotel'},
  {label: 'Homely Hotel', value: 'Homely Hotel'},
  {label: 'Lemona Hotel', value: 'Lemona Hotel'},
];

const RequestInfo = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [arriveDate, setArriveDate] = useState('');
  const [arriveDPVisible, setArriveDPVisible] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureDPVisible, setDepartureDPVisible] = useState('');
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [listing, setListing] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
    }, []),
  );

  return (
    <View style={styles.mainContainer}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <KeyboardAwareScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: normalize(30),
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIconContainer}>
          <Image source={Icons.arrow_left} style={styles.backIcon} />
        </TouchableOpacity>
        <Image source={Images.img17} style={styles.ppImage} />
        <Text style={styles.headerText}>Request Info on Listing</Text>
        <Text style={styles.descText}>
          Please fill out the form below and we forward it to Short Term One to
          get back to you as soon as possible.
        </Text>

        <TextInput
          value={name}
          onChangeText={v => setName(v)}
          title="Name"
          placeholder="Enter your name"
          isRequired
          titleFontFamily={Fonts.InterMedium}
        />

        <TextInput
          value={email}
          onChangeText={v => setEmail(v)}
          title="Email"
          placeholder="Enter your email"
          isRequired
          titleFontFamily={Fonts.InterMedium}
        />

        <TextInput
          value={phone}
          onChangeText={v => setPhone(v)}
          title="Phone"
          placeholder="Enter your phone number"
          isRequired
          titleFontFamily={Fonts.InterMedium}
        />

        <TextInput
          value={
            arriveDate === '' ? '' : moment(arriveDate).format('DD/MM/YYYY')
          }
          title="Arrive Date"
          placeholder="DD/MM/YYYY"
          titleFontFamily={Fonts.InterMedium}
          rightIcon={Icons.calender}
          onPressRight={() => setArriveDPVisible(true)}
        />

        <TextInput
          value={
            departureDate === ''
              ? ''
              : moment(departureDate).format('DD/MM/YYYY')
          }
          title="Departure Date"
          placeholder="DD/MM/YYYY"
          titleFontFamily={Fonts.InterMedium}
          rightIcon={Icons.calender}
          onPressRight={() => setDepartureDPVisible(true)}
        />

        <Text style={styles.infoText}>
          Please note that the dates you select are not guaranteed availability
          through Gimmzi Smart Rewards. Fot accurate and up-to-date information
          on the availability of the listing we recommend visiting the direct
          website.
        </Text>

        <View style={styles.subContainer}>
          <DropDown
            value={adults}
            setValue={setAdults}
            title="Adults"
            dropdownList={dropdownList}
            containerStyle={{width: '47.5%'}}
          />
          <DropDown
            value={children}
            setValue={setChildren}
            title="Children"
            dropdownList={dropdownList}
            containerStyle={{width: '47.5%'}}
          />
        </View>

        <View style={styles.subContainer}>
          <DropDown
            value={listing}
            setValue={setListing}
            title="Listings"
            dropdownList={listingList}
            containerStyle={{width: '47.5%'}}
          />
        </View>

        <InputMultiline
          value={comment}
          onChangeText={v => setComment(v)}
          title="Comments/Request"
          placeholder="Write . . ."
        />
        <Button
          title={'Send'}
          onPress={() => {}}
          rightIcon={Icons?.arrow_up_right}
          marginTop={normalize(10)}
        />
      </KeyboardAwareScrollView>

      <DatePicker
        modal
        mode="date"
        open={arriveDPVisible}
        date={arriveDate || new Date()}
        onConfirm={date => {
          setArriveDate(date);
          setArriveDPVisible(false);
        }}
        onCancel={() => {
          setArriveDPVisible(false);
        }}
      />

      <DatePicker
        modal
        mode="date"
        open={departureDPVisible}
        date={departureDate || new Date()}
        onConfirm={date => {
          setDepartureDate(date);
          setDepartureDPVisible(false);
        }}
        onCancel={() => {
          setDepartureDPVisible(false);
        }}
      />
    </View>
  );
};

export default RequestInfo;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  ppImage: {
    height: normalize(100),
    width: normalize(100),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: normalize(20),
  },
  backIconContainer: {
    position: 'absolute',
    left: normalize(20),
    top: Platform.OS == 'android' ? normalize(20) : normalize(15),
  },
  backIcon: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
  },
  headerText: {
    fontFamily: Fonts.InterBold,
    fontSize: normalize(18),
    color: Colors.dark,
    marginTop: normalize(15),
  },
  descText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    color: Colors.mist_blue,
    textAlign: 'center',
    marginTop: normalize(8),
    width: '90%',
    marginBottom: normalize(20),
  },
  infoText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(11),
    color: Colors.river_bed,
    textAlign: 'justify',
    marginVertical: normalize(10),
    width: '90%',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
});
