import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Icons, Images} from '../../../themes/Themes';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import Header from '../../../components/importent/Header';
import Search from '../../../components/importent/Search';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import normalize from '../../../utils/orientation/normalize';
import Button from '../../../components/button/Button';
import {ScanGimmziData} from '../../../utils/constants';
import {navigate} from '../../../utils/helper/RootNaivgation';
import {useFocusEffect} from '@react-navigation/native';
import TextInput from '../../../components/input/TextInput';

const EarnPoint = () => {
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [isScan, setIsScan] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
    }, []),
  );

  return (
    <View style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle={'light-content'} />
      <View style={styles.conatiner}>
        <View style={styles.v1}>
          <Image source={Images.shadow_arrow} style={styles.imgArrow} />
          <Header />
          <Search />
        </View>
        <View style={styles.v2}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={styles.v2}
            contentContainerStyle={{
              paddingTop: normalize(15),
              paddingBottom: normalize(30),
            }}>
            <Text style={styles.title}>
              Check to see if your community is on the Gimmzi Network
            </Text>

            <TextInput
              value={zipCode}
              onChangeText={v => setZipCode(v)}
              title="Zip Code"
              titleFontFamily={Fonts.InterMedium}
            />

            <TextInput
              value={city}
              titleFontFamily={Fonts.InterMedium}
              onChangeText={v => setCity(v)}
              title="City"
            />

            <TextInput
              value={state}
              onChangeText={v => setState(v)}
              title="State"
              editable={false}
              rightIcon={Icons.down_arrow}
              onPressRight={() => console.log('-->> onPressRight')}
              titleFontFamily={Fonts.InterMedium}
            />

            <Button
              onPress={() => setIsScan(true)}
              title={'Scan Gimmzi'}
              marginTop={normalize(10)}
              fontFamily={Fonts.InterMedium}
              fontSize={normalize(15)}
            />

            {/* Scan Gimmzi Data */}
            {isScan && (
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  marginTop: normalize(20),
                }}>
                <Text
                  style={{
                    color: Colors.dark,
                    fontFamily: Fonts.InterRegular,
                    fontSize: normalize(14),
                    marginBottom: normalize(15),
                  }}>
                  {
                    'Do you see your community in the list below?\nReach out to your community manager to claim your resident badge! Earn extra points and rewards just for being a valued member of the community.'
                  }
                </Text>

                {ScanGimmziData.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => navigate('Community')}
                    key={index}
                    style={{
                      width: '100%',
                      marginVertical: normalize(5),
                      borderColor: Colors.dawn_pink,
                      borderWidth: 1,
                      borderRadius: normalize(8),
                      padding: normalize(10),
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.dark,
                        fontFamily: Fonts.InterSemiBold,
                        fontSize: normalize(14),
                        width: '60%',
                      }}>
                      {item?.title}
                    </Text>
                    <Text
                      style={{
                        color: Colors.river_bed,
                        fontFamily: Fonts.InterRegular,
                        fontSize: normalize(12),
                        width: '60%',
                        marginTop: normalize(5),
                      }}>
                      {item?.address}
                    </Text>
                    <Image
                      source={item.icon}
                      style={{
                        height: normalize(50),
                        width: normalize(100),
                        resizeMode: 'contain',
                        position: 'absolute',
                        right: normalize(10),
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

export default EarnPoint;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    backgroundColor: Colors.dark,
    borderBottomLeftRadius: normalize(28),
    borderBottomRightRadius: normalize(28),
    height: Platform.OS == 'android' ? normalize(135) : normalize(140),
  },
  imgArrow: {
    height: Platform.OS == 'ios' ? normalize(120) : normalize(108),
    width: Platform.OS == 'ios' ? normalize(120) : normalize(108),
    resizeMode: 'contain',
    position: 'absolute',
    bottom: normalize(-25),
    left: normalize(-5),
  },
  v2: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    color: Colors.dark,
    width: '90%',
    alignSelf: 'center',
    marginVertical: normalize(10),
  },
});
