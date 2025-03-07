import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import TopHeader from '../../../components/importent/TopHeader';
import {Colors, Fonts, Icons} from '../../../themes/Themes';
import normalize from '../../../utils/orientation/normalize';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import {useFocusEffect} from '@react-navigation/native';

const CommunicationSettings = [
  {title: 'Email and Text'},
  {title: 'Email Only'},
  {title: 'Text Only'},
];

const TextPreferences = [
  {title: 'Special Promotions and Offers'},
  {title: 'Unsubscribe Notification'},
  {title: 'Gimmzi Updates'},
  {title: 'Email Only'},
  {title: 'Newsletter'},
];

const Preferences = () => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
    }, []),
  );

  const [CommunicationOptions, setCommunicationOptions] = useState(
    CommunicationSettings,
  );

  const [PreferencesOptions, setPreferencesOptions] = useState(TextPreferences);

  return (
    <SafeAreaView style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <TopHeader title="Preferences" />
      <View style={styles.v2}>
        <Text style={styles.title}>Communication Settings</Text>

        <View style={styles.optionsBody}>
          {CommunicationOptions.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  let temp = [...CommunicationOptions].map((item, i) => ({
                    ...item,
                  }));
                  temp[index].isSelect = !temp[index].isSelect;
                  setCommunicationOptions(temp);
                }}
                style={styles.touch}>
                <View
                  style={[
                    styles.box,
                    {
                      backgroundColor: item?.isSelect
                        ? Colors.ball_blue
                        : Colors.white,
                      borderColor: item?.isSelect
                        ? Colors.ball_blue
                        : Colors.iron,
                    },
                  ]}>
                  {item?.isSelect && (
                    <Image source={Icons.tick} style={styles.tick} />
                  )}
                </View>
                <Text style={styles.optionTitle}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            width: '100%',
            backgroundColor: Colors.alabaster,
            marginTop: normalize(45),
            marginBottom: normalize(10),
            padding: normalize(10),
            borderRadius: normalize(8),
          }}>
          <Text
            style={{
              fontFamily: Fonts.InterSemiBold,
              color: Colors.dark,
              fontSize: normalize(12),
            }}>
            Email and Text Preferences
          </Text>
          <Text
            style={{
              fontFamily: Fonts.InterRegular,
              color: Colors.pickled_bluewood,
              fontSize: normalize(11),
              marginTop: normalize(6),
            }}>
            You may receive additional notifications about updates on Gimmzi.
            You can opt-out of specific emails and or texts using the
            unsubscribe link included in each message.
          </Text>
        </View>

        <View style={styles.optionsBody}>
          {PreferencesOptions.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  let temp = [...PreferencesOptions].map((item, i) => ({
                    ...item,
                  }));
                  temp[index].isSelect = !temp[index].isSelect;
                  setPreferencesOptions(temp);
                }}
                style={styles.touch}>
                <View
                  style={[
                    styles.box,
                    {
                      backgroundColor: item?.isSelect
                        ? Colors.ball_blue
                        : Colors.white,
                      borderColor: item?.isSelect
                        ? Colors.ball_blue
                        : Colors.iron,
                    },
                  ]}>
                  {item?.isSelect && (
                    <Image source={Icons.tick} style={styles.tick} />
                  )}
                </View>
                <Text style={styles.optionTitle}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v2: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingHorizontal: normalize(15),
  },
  title: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(14),
    marginTop: normalize(15),
  },
  optionsBody: {
    width: '100%',
    height: normalize(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: normalize(10),
  },
  touch: {
    width: '49%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    height: normalize(15),
    width: normalize(15),
    borderWidth: normalize(1),
    borderRadius: normalize(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    resizeMode: 'contain',
    height: normalize(9),
    width: normalize(9),
  },
  optionTitle: {
    color: Colors.mirage,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(11),
    marginLeft: normalize(8),
    width: '80%',
  },
});
