import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Fonts, Icons, Images, hexToRGB} from '../../../themes/Themes';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import TopHeader from '../../../components/importent/TopHeader';
import normalize from '../../../utils/orientation/normalize';
import {INBOX_DATA} from '../../../utils/constants';
import CustomModal from '../../../components/modal/CustomModal';
import {
  horizontalScale,
  moderateScale,
} from '../../../utils/orientation/scaleDimensions';
import {resetToNavigateMyHubScreen} from '../../../utils/helper/RootNaivgation';

const MyInbox = () => {
  const FILTER_OPTIONS = ['All (5)', 'Unread (2)'];
  const [selectFilterIdx, setSelectFilterIdx] = useState(-1);
  const [isVisible, setIsVisible] = useState({
    status: false,
    details: {},
  });

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
    }, []),
  );

  function FilterOptions() {
    return (
      <View style={styles.v3}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingStart: '5%',
          }}>
          {FILTER_OPTIONS.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                setSelectFilterIdx(selectFilterIdx == index ? -1 : index)
              }
              key={index}
              style={[
                {
                  backgroundColor:
                    selectFilterIdx == index ? Colors.ball_blue : undefined,
                  borderColor:
                    selectFilterIdx == index ? Colors.ball_blue : Colors.iron,
                },
                styles.filterContainer,
              ]}>
              <Text
                style={{
                  fontSize: normalize(12),
                  color:
                    selectFilterIdx == index ? Colors.white : Colors.river_bed,
                  fontFamily: Fonts.InterMedium,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        onPress={() =>
          setIsVisible({
            status: true,
            details: item,
          })
        }
        style={[
          {
            borderColor: index == 0 ? Colors.ball_blue : Colors.dawn_pink,
          },
          styles.v4,
        ]}>
        <Image source={item?.profile_picture} style={styles.profile_picture} />
        <View style={styles.v5}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text numberOfLines={1} style={styles.message}>
            {item?.message}
          </Text>
        </View>
        <Text style={styles.date}>{item?.date}</Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <TopHeader
        title="My Inbox(0)"
        isGoBack={false}
        onPress={() => resetToNavigateMyHubScreen('MyHub')}
        borderColor={hexToRGB(Colors.iron, 0.3)}
      />
      <View
        style={{
          flex: 1,
          padding: normalize(12),
        }}>
        <Text
          style={{
            fontFamily: Fonts.InterMedium,
            fontSize: normalize(12),
            // alignSelf: 'center',
            color: '#808080',
          }}>
          Coming Soon
        </Text>
        <Text
          style={{
            fontFamily: Fonts.InterRegular,
            fontSize: normalize(12),
            paddingVertical: normalize(12),
            color: '#667085',
          }}>
          Stay in the loop with Gimmzi’s latest offers and rewards! My Inbox
          keeps you notified of new deals, exclusive loyalty punch cards, and
          special birthday gifts from your favorite businesses.
        </Text>
        {/* <FlatList
          data={INBOX_DATA}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: normalize(30),
          }}
          ListHeaderComponent={<FilterOptions />}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
        /> */}

        {/* Information */}
        <CustomModal
          isVisible={isVisible.status}
          onBackdropPress={() => {
            setIsVisible({
              status: false,
              details: {},
            });
          }}
          children={
            <View style={styles.v6}>
              <TouchableOpacity
                onPress={() =>
                  setIsVisible({
                    status: false,
                    details: {},
                  })
                }
                style={styles.touch1}>
                <Image source={Icons.close} style={styles.close} />
              </TouchableOpacity>

              <Text style={styles.title}>
                {'From: '}
                {
                  <Text
                    style={{
                      color: Colors.dark,
                    }}>
                    {isVisible.details?.name}
                  </Text>
                }
              </Text>
              <View style={styles.v7}>
                <Text style={styles.title1}>
                  {'Subject: '}
                  <Text
                    style={{
                      color: Colors.dark,
                    }}>
                    {isVisible.details?.message}
                  </Text>
                </Text>
              </View>
              <View style={styles.v8}>
                <Text style={styles.title2}>
                  Encore at Westgate Apartments has rewarded you with points for
                  your loyalty.
                </Text>
                <View style={styles.v9}>
                  <Image source={Images.img25} style={styles.img} />
                  <Text style={styles.title3}>
                    You have been sent 50 points as a token of our appreciation.
                    Thanks for being a resident at Encore at Westgate
                    Apartments,
                  </Text>
                </View>
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MyInbox;

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
  v3: {
    width: '100%',
    paddingBottom: normalize(5),
    backgroundColor: Colors.white,
  },
  filterContainer: {
    borderWidth: normalize(1),
    height: normalize(28),
    paddingHorizontal: normalize(12),
    marginVertical: normalize(10),
    borderRadius: normalize(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(10),
  },
  filterImg: {
    resizeMode: 'contain',
    marginLeft: normalize(5),
  },
  v4: {
    marginBottom: normalize(10),
    height: normalize(60),
    width: '90%',
    alignSelf: 'center',
    borderRadius: normalize(12),
    borderWidth: normalize(1),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(12),
  },
  profile_picture: {
    resizeMode: 'cover',
    height: normalize(40),
    width: normalize(40),
    borderRadius: normalize(60),
    marginRight: normalize(10),
  },
  v5: {
    height: '60%',
    width: '80%',
  },
  name: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(15),
  },
  message: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pickled_bluewood,
    fontSize: normalize(12),
    marginTop: normalize(8),
    width: '95%',
  },
  date: {
    fontFamily: Fonts.InterRegular,
    color: Colors.mist_blue,
    fontSize: normalize(12),
    position: 'absolute',
    right: normalize(10),
    top: normalize(10),
  },
  v6: {
    backgroundColor: Colors.white,
    width: '85%',
    alignSelf: 'center',
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(8),
  },
  touch1: {
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
  title: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    marginVertical: normalize(10),
    paddingTop: normalize(5),
    width: '85%',
    alignSelf: 'center',
  },
  v7: {
    borderTopColor: Colors.dawn_pink,
    borderTopWidth: normalize(1),
    paddingVertical: normalize(10),
    width: '85%',
    alignSelf: 'center',
  },
  title1: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
  },
  v8: {
    borderTopColor: Colors.dawn_pink,
    borderTopWidth: normalize(1),
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
  },
  title2: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    color: Colors.dark,
  },
  v9: {
    backgroundColor: Colors.water,
    padding: normalize(10),
    marginTop: normalize(10),
    borderRadius: normalize(10),
  },
  img: {
    height: normalize(50),
    width: normalize(50),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: normalize(10),
  },
  title3: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    color: Colors.dark,
    textAlign: 'center',
  },
});
