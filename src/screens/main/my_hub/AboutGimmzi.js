import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import React from 'react';
import TopHeader from '../../../components/importent/TopHeader';
import {Colors, Fonts} from '../../../themes/Themes';
import normalize from '../../../utils/orientation/normalize';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import {useFocusEffect} from '@react-navigation/native';

const AboutGimmzi = () => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
    }, []),
  );

  return (
    <SafeAreaView style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <TopHeader title="About Gimmzi" />
      <View style={styles.v2}>
        <Text style={styles.title}>Legal</Text>
        <Text style={styles.subTitle}>Privacy and Statement</Text>
        <Text style={styles.subTitle}>Terms of use</Text>
        <Text style={styles.subTitle}>Licenses</Text>
        <Text style={[styles.title, {marginTop: normalize(18)}]}>
          About This App
        </Text>
        <Text style={styles.subTitle}>Build Version</Text>
        <Text style={styles.des}>Gimmzi for Android 24.4.461406</Text>
        <Text style={styles.subTitle}>
          © 2024 Gimmzi LLC. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AboutGimmzi;

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
    marginVertical: normalize(7),
  },
  subTitle: {
    fontFamily: Fonts.InterMedium,
    color: Colors.dark,
    fontSize: normalize(12),
    marginVertical: normalize(7),
    marginLeft: normalize(15),
  },
  des: {
    fontFamily: Fonts.InterRegular,
    marginBottom: normalize(7),
    color: Colors.river_bed,
    fontSize: normalize(12),
    marginLeft: normalize(15),
  },
});
