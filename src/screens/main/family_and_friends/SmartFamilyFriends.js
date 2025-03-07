import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import TopHeader from '../../../components/importent/TopHeader';
import {Colors, Fonts, Icons, Images, hexToRGB} from '../../../themes/Themes';
import normalize from '../../../utils/orientation/normalize';
import Button from '../../../components/button/Button';
import {MYFF_INFO, SOCIAL} from '../../../utils/constants';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast, {showMessage} from '../../../utils/helper/Toast';
import CustomModal from '../../../components/modal/CustomModal';
import {
  horizontalScale,
  moderateScale,
} from '../../../utils/orientation/scaleDimensions';
import {navigate} from '../../../utils/helper/RootNaivgation';

const SmartFamilyFriends = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.conatiner}>
      <MyStatusBar />
      <TopHeader
        title="My Smart Family and Friends"
        borderColor={hexToRGB(Colors.iron, 0.3)}
      />
      <Text
        style={{
          fontFamily: Fonts.InterMedium,
          fontSize: normalize(12),
          alignSelf: 'center',
          color: Colors.neutral,
          marginTop: normalize(10),
        }}>
        Coming Soon
      </Text>

      <ScrollView
        style={styles.v1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll_conatiner}>
        <View style={styles.v2}>
          <Image source={Images.shodow_arrow2} style={styles.shadow_arrow} />
          <Text style={styles.text}>0/0</Text>
          <Text style={styles.t2}>Registered / Invites Sent</Text>
        </View>
        <Text style={styles.t3}>
          10 more registered to increase badge power
        </Text>
        <Text style={styles.t4}>My Smart Family and Family</Text>
        <Text style={styles.t5}>
          Introducing the My Smart Family and Friends Program — your ticket to
          earning more points and strengthening your Gimmzi community! Refer
          family and friends to join Gimmzi. Earn more monthly points as your
          badge power increases!
        </Text>
        <Text style={styles.t6}>
          Share using your unique link below with your family or friend below:
        </Text>

        {/* Social Link */}
        <View style={styles.v3}>
          <TouchableOpacity style={styles.touch}>
            <Text numberOfLines={1} style={styles.link}>
              https://shorturl.at/uyzT2
            </Text>
          </TouchableOpacity>
          <Button
            title={'Copy'}
            leftIcon={Icons.copy}
            width={'32%'}
            fontFamily={Fonts.InterMedium}
            iconStyle={styles.copy}
            height={normalize(38)}
            fontSize={normalize(15)}
            onPress={() => {
              // try {
              //   Clipboard.setString('https://shorturl.at/uyzT2');
              // } catch (error) {
              //   console.log('error - -', error);
              // }
              showMessage('Coming soon');
            }}
          />
        </View>

        <View style={styles.v4}>
          {SOCIAL.map((item, index) => (
            <TouchableOpacity style={styles.touch1}>
              <Image source={item.icon} style={styles.img} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.v5}>
        <View style={styles.v6}>
          <Text style={styles.t7}>Badge Boosters & Gifts</Text>
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            style={styles.touch2}>
            <Image source={Icons.info} style={styles.info} />
          </TouchableOpacity>
        </View>
        <Button
          title={'My List of Family & Friends'}
          backgroundColor={Colors.white}
          textColor={Colors.ball_blue}
          fontFamily={Fonts.InterMedium}
          borderColor={Colors.dawn_pink}
          height={normalize(38)}
          fontSize={normalize(15)}
          onPress={() =>
            // navigate('MyListFamilyFriends', {
            //   type: 'list',
            // })
            showMessage('Coming Soon')
          }
        />

        <Button
          title={'My Badge Boosts & Gifts'}
          backgroundColor={Colors.white}
          textColor={Colors.ball_blue}
          fontFamily={Fonts.InterMedium}
          borderColor={Colors.dawn_pink}
          marginTop={normalize(8)}
          height={normalize(38)}
          fontSize={normalize(15)}
          onPress={() =>
            // navigate('MyListFamilyFriends', {
            //   type: 'badge',
            // })
            showMessage('Coming Soon')
          }
        />
      </View>

      {/* Information */}
      <CustomModal
        isVisible={isVisible}
        onBackdropPress={() => {
          setIsVisible(false);
        }}
        children={
          <View style={styles.v7}>
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={styles.touch3}>
              <Image source={Icons.close} style={styles.close} />
            </TouchableOpacity>
            <Text style={styles.t8}>Badge Boosters & Gifts</Text>

            {MYFF_INFO.map((item, index) => (
              <View
                key={index}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginVertical: normalize(5),
                }}>
                <Image source={Icons.check} style={styles.img1} />
                <Text style={styles.t9}>{item}</Text>
              </View>
            ))}
          </View>
        }
      />
    </View>
  );
};

export default SmartFamilyFriends;

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
    paddingBottom: normalize(10),
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
    marginTop: Platform.OS == 'android' ? normalize(15) : normalize(18),
  },
  t3: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(15),
    alignSelf: 'center',
    marginTop: normalize(8),
  },
  t4: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(18),
    marginVertical: normalize(15),
  },
  t5: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    lineHeight: normalize(23),
  },
  t6: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(15),
    marginTop: normalize(15),
    lineHeight: normalize(23),
    marginBottom: normalize(10),
  },
  v3: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  touch: {
    width: '65%',
    height: normalize(38),
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.iron,
    justifyContent: 'center',
    padding: normalize(10),
  },
  link: {
    color: Colors.mist_blue,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
  },
  copy: {
    height: normalize(22),
    width: normalize(22),
    marginRight: normalize(5),
  },
  v4: {
    flexDirection: 'row',
    marginVertical: normalize(10),
  },
  touch1: {
    padding: normalize(6),
    borderRadius: normalize(6),
    borderWidth: normalize(1),
    borderColor: Colors.iron,
    marginRight: normalize(12),
  },
  img: {
    resizeMode: 'contain',
    height: normalize(20),
    width: normalize(20),
  },
  v5: {
    backgroundColor: Colors.white,
    height: normalize(140),
    width: '100%',
    shadowColor: hexToRGB(Colors.black, 0.3),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    paddingTop: normalize(5),
  },
  v6: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  t7: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    color: Colors.pickled_bluewood,
  },
  touch2: {
    height: normalize(27),
    width: normalize(27),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(10),
  },
  info: {
    height: normalize(14),
    width: normalize(14),
    resizeMode: 'contain',
    tintColor: Colors.ball_blue,
  },
  v7: {
    backgroundColor: Colors.white,
    width: '85%',
    alignSelf: 'center',
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
  },
  touch3: {
    backgroundColor: Colors.catskill_white,
    height: horizontalScale(25),
    width: horizontalScale(25),
    borderRadius: horizontalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: moderateScale(12),
    right: moderateScale(12),
    zIndex: 1,
  },
  close: {
    height: normalize(14),
    width: normalize(14),
    resizeMode: 'contain',
  },
  t8: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(18),
    marginBottom: normalize(12),
  },
  img1: {
    height: normalize(16),
    width: normalize(16),
    resizeMode: 'contain',
    marginRight: normalize(5),
  },
  t9: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(15),
    lineHeight: normalize(18),
    width: '90%',
  },
});
