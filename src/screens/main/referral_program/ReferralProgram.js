import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import React from 'react';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import TopHeader from '../../../components/importent/TopHeader';
import {
  navigate,
  resetToNavigateMyHubScreen,
} from '../../../utils/helper/RootNaivgation';
import {Colors, Fonts, Icons, Images, hexToRGB} from '../../../themes/Themes';
import normalize from '../../../utils/orientation/normalize';
import {ReferralData} from '../../../utils/constants';
import Button from '../../../components/button/Button';
import {showMessage} from '../../../utils/helper/Toast';

const ReferralProgram = () => {
  const Card = ({title, content}) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {content.map((item, index) => (
        <Text key={index} style={styles.cardText}>
          {item.text} = <Text style={styles.boldText}>{item.value}</Text>
        </Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <TopHeader
        title="Gimmzi Referral Program"
        isGoBack={false}
        onPress={() => resetToNavigateMyHubScreen('MyHub')}
        borderColor={hexToRGB(Colors.iron, 0)}
      />
      <Text
        style={{
          fontFamily: Fonts.InterMedium,
          fontSize: normalize(12),
          alignSelf: 'center',
          color: Colors.neutral,
        }}>
        Coming Soon
      </Text>
      <ScrollView
        style={styles.v1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll_conatiner}>
        <View style={styles.v2}>
          <Image source={Images.shodow_arrow2} style={styles.shadow_arrow} />
          <Text style={styles.text}>$0.00</Text>
          <Text style={styles.t2}>
            {"Total Payout Amount as of\ntoday's date"}
          </Text>
        </View>
        <Text style={styles.t3}>
          {'Your Gimmzi Referral Code is '}
          {
            <Text
              style={{
                color: Colors.ball_blue,
                fontFamily: Fonts.InterMedium,
              }}>
              -----
            </Text>
          }
        </Text>

        <View style={styles.v3}>
          <Image source={Icons.universe} style={styles.universe} />
          <Text style={styles.t4}>immzi Referral Program</Text>
        </View>

        <Text style={styles.t5}>
          Ready to earn? Earn cash rewards by referring businesses to join our
          community. Ask the companies you refer to use your unique Gimmzi
          referral code provided below so you can receive credit Businesses must
          enter your code during sign-up for tracking. Watch your rewards grow,
          and track progress.
        </Text>

        {ReferralData.map((section, index) => (
          <Card key={index} title={section.title} content={section.content} />
        ))}
        <Text style={styles.footerText}>
          Payouts are made after three consecutive months of service on
          respective plan
        </Text>

        <Button
          title={'Your Payouts Progress'}
          width={'100%'}
          marginTop={normalize(15)}
          fontFamily={Fonts.InterMedium}
          fontSize={normalize(16)}
          // onPress={() => navigate('PayoutProgress')}
          onPress={() => showMessage('Coming Soon')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralProgram;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll_conatiner: {
    width: '90%',
    alignSelf: 'center',
    paddingTop: normalize(15),
    paddingBottom: normalize(30),
  },
  v2: {
    backgroundColor: Colors.dark,
    height: Platform.OS == 'android' ? normalize(140) : normalize(125),
    width: '100%',
    borderRadius: normalize(10),
    padding: normalize(15),
  },
  shadow_arrow: {
    height: normalize(120),
    width: normalize(120),
    resizeMode: 'contain',
    position: 'absolute',
    bottom: normalize(-3),
    right: normalize(-12),
  },
  text: {
    fontFamily: Fonts.InterBold,
    fontSize: normalize(38),
    color: Colors.white,
  },
  t2: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(16),
    color: Colors.white, // catskill_white
    marginTop: Platform.OS == 'android' ? normalize(12) : normalize(15),
  },
  t3: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(14),
    alignSelf: 'center',
    marginTop: normalize(8),
  },
  v3: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(20),
  },
  universe: {
    height: normalize(22),
    width: normalize(22),
    resizeMode: 'contain',
    marginRight: normalize(5),
  },
  t4: {
    color: Colors.dark,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(16),
  },
  t5: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    marginTop: normalize(10),
    marginBottom: normalize(15),
  },
  card: {
    borderRadius: normalize(8),
    padding: normalize(10),
    marginVertical: normalize(5),
    borderColor: Colors.dawn_pink,
    borderWidth: normalize(1),
  },
  cardTitle: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(15),
    marginBottom: normalize(10),
  },
  cardText: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    marginBottom: normalize(8),
  },
  boldText: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
  },
  footerText: {
    fontSize: normalize(13.5),
    color: Colors.carmine_pink,
    marginTop: normalize(8),
  },
});
