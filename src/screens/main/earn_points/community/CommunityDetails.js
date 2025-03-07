import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Icons, Images} from '../../../../themes/Themes';
import MyStatusBar from '../../../../components/custom/MyStatusBar';
import Header from '../../../../components/importent/Header';
import normalize from '../../../../utils/orientation/normalize';
import {goBack} from '../../../../utils/helper/RootNaivgation';
import GridImageViewer from '../../../../components/imageViewer/GridImageViewer';
import {ASDATA, CommunityDetailsImages} from '../../../../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

const CommunityDetails = () => {

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

      <View style={styles.v1}>
        <Header />
      </View>
      {/* Basic */}
      <View style={styles.v2}>
        <TouchableOpacity onPress={() => goBack()} style={styles.t1}>
          <Image source={Icons.close} style={styles.img} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title1}>Hawthorne at Oleander</Text>
          <Image source={Images.brand_logo} style={styles.brand_logo} />
        </View>

        <View style={styles.v3}>
          {[1, 2].map((item, index) => (
            <TouchableOpacity key={index} style={styles.t2}>
              <Image
                source={index == 0 ? Icons.share2 : Icons.heart2}
                style={styles.img1}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* All Details */}
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingBottom: normalize(30),
          }}>
          <GridImageViewer images={CommunityDetailsImages} />
          <View style={styles.v4}>
            <Text style={styles.title2}>Earn Rewards starting at</Text>

            <Text style={styles.subTitle}>
              450 points per month as a resident
            </Text>

            <View style={styles.v5}>
              {['1 - 3 Beds', '1 - 3 Beds'].map((item, index) => (
                <View
                  key={index}
                  style={[
                    {
                      marginRight: index == 0 ? normalize(1.3) : 0,
                    },
                    styles.v6,
                  ]}>
                  <Image
                    source={index == 0 ? Icons.bed : Icons.shower}
                    style={styles.img2}
                  />
                  <Text style={styles.title3}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.v7}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title4}>Rent Specials</Text>
              <Image source={Icons.discount} style={styles.img3} />
            </View>

            <Text style={styles.subTitle1}>
              Call Us Today to Hear About our Amazing New Year Move-ln
              Specials!!! *Restrictions Apply
            </Text>
          </View>

          {ASDATA.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  paddingVertical: normalize(20),
                  borderBottomColor: Colors.iron,
                  borderBottomWidth: index == 0 ? normalize(1) : 0,
                }}>
                <Text style={styles.title5}>{item.title}</Text>

                {item.data.map((itm, idx) => (
                  <View key={index} style={styles.v8}>
                    <Text style={styles.type}>{itm.type}</Text>
                    <Text style={styles.title6}>{itm.value}</Text>
                  </View>
                ))}
              </View>
            );
          })}

          <TouchableOpacity
            onPress={() => {}}
            style={styles.button}>
            <Text
              style={styles.buttonTitle}>
              Show all amenities and features
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default CommunityDetails;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    backgroundColor: Colors.dark,
    height: Platform.OS == 'android' ? normalize(75) : normalize(65),
  },
  v2: {
    width: '100%',
    borderBottomColor: Colors.dawn_pink,
    borderBottomWidth: normalize(1),
    paddingBottom: Platform.OS == 'android' ? normalize(37) : normalize(32),
    paddingTop: normalize(5),
    paddingHorizontal: normalize(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  t1: {
    height: normalize(35),
    width: normalize(35),
    justifyContent: 'center',
  },
  img: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
    marginLeft: normalize(5),
  },
  title1: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(15),
  },
  brand_logo: {
    resizeMode: 'contain',
    height: normalize(25),
    width: normalize(85),
    position: 'absolute',
    marginTop: Platform.OS == 'android' ? normalize(30) : normalize(25)
  },
  v3: {
    flexDirection: 'row',
    right: normalize(15),
    position: 'absolute',
    top: normalize(10),
  },
  t2: {
    height: normalize(35),
    width: normalize(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: normalize(12),
    borderColor: Colors.dawn_pink,
    borderWidth: normalize(1),
    borderRadius: normalize(35),
  },
  img1: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
    tintColor: Colors.dark,
  },
  v4: {
    borderColor: Colors.catskill_white,
    borderLeftWidth: normalize(1),
    borderRightWidth: normalize(1),
    borderBottomWidth: normalize(1),
    borderBottomLeftRadius: normalize(6),
    borderBottomRightRadius: normalize(6),
    width: '90%',
    alignSelf: 'center',
    padding: normalize(10),
    top: normalize(-5),
  },
  title2: {
    color: Colors.dark,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(16),
    marginTop: normalize(8),
  },
  subTitle: {
    color: Colors.green,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    marginTop: normalize(4),
  },
  v5: {
    backgroundColor: Colors.iron,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(15),
    alignSelf: 'flex-start',
    marginBottom: normalize(3),
  },
  v6: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(15),
    backgroundColor: Colors.white,
  },
  img2: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
    marginBottom: normalize(3),
  },
  title3: {
    color: Colors.pickled_bluewood,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
  },
  v7: {
    backgroundColor: Colors.alabaster,
    width: '90%',
    alignSelf: 'center',
    borderRadius: normalize(6),
    padding: normalize(15),
    marginTop: normalize(15),
  },
  title4: {
    color: Colors.dark,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(20),
  },
  img3: {
    resizeMode: 'contain',
    height: normalize(18),
    width: normalize(18),
    marginLeft: normalize(10),
  },
  subTitle1: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(15),
    marginTop: normalize(15),
  },
  title5: {
    fontFamily: Fonts.InterMedium,
    color: Colors.dark,
    fontSize: normalize(18),
    marginBottom: normalize(12),
  },
  v8: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(6),
  },
  type: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(14),
    width: '50%',
  },
  title6: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(14),
    width: '50%',
  },
  button: {
    borderColor: Colors.dawn_pink,
    width: '90%',
    height: normalize(40),
    borderRadius: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(1),
    flexDirection: 'row',
    alignSelf: 'center',
  },
  buttonTitle: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(15),
  }
});
