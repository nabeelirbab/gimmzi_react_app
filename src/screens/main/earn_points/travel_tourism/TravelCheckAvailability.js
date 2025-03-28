import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  Colors,
  Fonts,
  Icons,
  Images,
  hexToRGB,
} from '../../../../themes/Themes';
import MyStatusBar from '../../../../components/custom/MyStatusBar';
import normalize from '../../../../utils/orientation/normalize';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { navigate } from '../../../../utils/helper/RootNaivgation';

const FILTER_OPTIONS = ['All', 'Destinations', 'Types'];
const CARD_BUTTONS = [
  {title: 'More Details'},
  {title: 'Book Now'},
];

const TravelCheckAvailability = () => {
  const navigation = useNavigation();
  const [selectFilterIdx, setSelectFilterIdx] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {StatusBar.setBackgroundColor(Colors.white) };
    }, []),
  );


  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <View style={styles.v1}>
        <View style={styles.v2}>
          <View style={styles.vv1}>
            {[0, 1].map((item, index) => (
              <Image
                source={Images.rectangle}
                style={[
                  {
                    alignSelf: index == 0 ? 'flex-start' : 'flex-end',
                  },
                  styles.img,
                ]}
              />
            ))}
            <View style={styles.v3}>
              <Image source={Images.img17} style={styles.img1} />
            </View>
          </View>

          <View style={styles.v4}>
            <Text style={styles.text}>Short Term One - NEW YORK</Text>
            <Text style={styles.text1}>Earn Rewards starting at</Text>
            <Text style={styles.text2}>80 points per night booked</Text>

            {[
              '35 E 18th St, New York, NY 10003, USA.10003',
              '910-444-77777',
            ].map((item, index) => (
              <View style={styles.v5}>
                <Image
                  source={index == 0 ? Icons.location : Icons.call}
                  style={styles.img2}
                />
                <Text style={styles.text3}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.v6}>
          {['Save this page', 'Share this page'].map((item, index) => (
            <TouchableOpacity
              style={[
                {
                  marginLeft: index == 0 ? 0 : normalize(10),
                },
                styles.touch,
              ]}>
              <Image
                source={index == 0 ? Icons.heart2 : Icons.share4}
                style={{
                  height: normalize(index == 0 ? 15 : 12),
                  width: normalize(index == 0 ? 15 : 12),
                  tintColor: Colors.ball_blue,
                  resizeMode: 'contain',
                }}
              />
              <Text style={styles.text4}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.text5}>Visit Company Website</Text>
      </View>

      {/* Filter */}
      <FilterOptions
        selectFilterIdx={selectFilterIdx}
        setIsVisible={setIsVisible}
        setSelectFilterIdx={setSelectFilterIdx}
      />

      <View
        style={{
          flex: 1,
        }}>
        <FlatList
          data={[0, 1, 2]}
          keyExtractor={keyExtractor}
          renderItem={(item, index) => (
            <RenderItem item={item} index={index} navigation={navigation} />
          )}
          contentContainerStyle={{
            paddingBottom: normalize(30),
          }}
        />
      </View>
    </View>
  );
};

function RenderItem({item, index, navigation}) {
  return (
    <View style={styles.itemView}>
      <Image source={Images.img18} style={styles.img5} />

      <View style={styles.v12}>
        {[0, 1].map((item, i) => (
          <TouchableOpacity
            style={[
              styles.touch1,
              {
                marginLeft: i == 1 ? normalize(2) : 0,
              },
            ]}>
            <Image
              source={i == 0 ? Icons.share3 : Icons.heart1}
              style={{
                height: normalize(i == 0 ? 15 : 18),
                width: normalize(i == 0 ? 15 : 18),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={{
          width: '100%',
          paddingHorizontal: normalize(10),
        }}>
        <View style={styles.v8}>
          <Image source={Icons.location_point} style={styles.img3} />
          <Text style={styles.text6}>
            {'Beaumount, California '}
            {<View style={styles.dot} />}
            {' Condo'}
          </Text>
        </View>

        <Text style={styles.title}>
          Luxury Condo on the river-Million Dollar View
        </Text>

        <View style={styles.v9}>
          {['1 Bed', '1 Bath', 'Sleeps 4'].map((item, i) => (
            <View style={styles.v10}>
              <Image
                source={
                  i == 0 ? Icons.bed : i == 1 ? Icons.shower : Icons.sleep
                }
                style={styles.img4}
              />
              <Text style={styles.text7}>{item}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.text8}>Earn Rewards starting at</Text>
        <Text style={styles.text9}>80 points per night booked</Text>

        <View style={styles.v11}>
          {CARD_BUTTONS.map((button, buttonIndex) => {
            return (
              <TouchableOpacity
                key={buttonIndex}
                style={[
                  {
                    backgroundColor:
                      buttonIndex == 0 ? Colors.white : Colors.ball_blue,
                    borderColor:
                      buttonIndex == 0 ? Colors.dawn_pink : Colors.ball_blue,
                  },
                  styles.button,
                ]}
                onPress={() => {
                  if(buttonIndex == 0){
                    navigate('TravelDetails');
                  }
                }}>
                <Text
                  style={{
                    color: buttonIndex !== 0 ? Colors.white : Colors.ball_blue,
                    fontFamily: Fonts.InterMedium,
                    fontSize: normalize(15),
                  }}>
                  {button?.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function FilterOptions({setIsVisible, setSelectFilterIdx, selectFilterIdx}) {
  return (
    <View style={styles.v7}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: '5%',
        }}>
        {FILTER_OPTIONS.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
              setSelectFilterIdx(selectFilterIdx == index ? -1 : index);
            }}
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
            <Image
              source={index == 0 ? Icons.filter : Icons.down_arrow}
              style={[
                {
                  tintColor:
                    selectFilterIdx == index ? Colors.white : Colors.river_bed,
                  height: normalize(index == 0 ? 14 : 16),
                  width: normalize(index == 0 ? 14 : 16),
                },
                styles.filterImg,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default TravelCheckAvailability;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    backgroundColor: Colors.milk_white,
    width: '100%',
    borderBottomColor: hexToRGB(Colors.mirage, 0.1),
    borderBottomWidth: normalize(1),
    padding: normalize(15),
  },
  v2: {
    flexDirection: 'row',
    width: '100%',
  },
  vv1: {
    flexDirection: 'row',
    height: normalize(100),
    width: normalize(75),
    justifyContent: 'space-between',
  },
  img: {
    width: normalize(37),
    borderRadius: normalize(4),
    resizeMode: 'stretch',
    height: normalize(90),
  },
  v3: {
    backgroundColor: Colors.milk_white,
    height: normalize(94),
    width: normalize(75),
    borderRadius: normalize(4),
    position: 'absolute',
    marginVertical: normalize(3),
  },
  img1: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  v4: {
    marginLeft: normalize(10),
    width: '70%',
  },
  text: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(15),
  },
  text1: {
    color: Colors.mist_blue,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(11),
    marginTop: normalize(6),
  },
  text2: {
    color: Colors.green,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(11),
    marginTop: normalize(2),
  },
  v5: {
    flexDirection: 'row',
    marginTop: normalize(8),
  },
  img2: {
    height: normalize(12),
    width: normalize(12),
    tintColor: Colors.dark,
    resizeMode: 'contain',
  },
  text3: {
    color: Colors.pickled_bluewood,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(11),
    marginLeft: normalize(6),
    width: '90%',
  },
  v6: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: normalize(10),
  },
  touch: {
    flexDirection: 'row',
    backgroundColor: Colors.catskill_white,
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
    paddingHorizontal: normalize(10),
  },
  text4: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    marginLeft: normalize(6),
  },
  text5: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(12),
    alignSelf: 'center',
  },
  v7: {
    height: normalize(45),
    width: '100%',
    marginTop: normalize(10),
  },
  filterContainer: {
    borderWidth: normalize(1),
    height: normalize(29),
    paddingHorizontal: normalize(10),
    marginVertical: 5,
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
  v8: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: normalize(10),
  },
  img3: {
    resizeMode: 'contain',
    height: normalize(15),
    width: normalize(15),
    tintColor: Colors.river_bed,
    marginRight: normalize(8),
  },
  text6: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pickled_bluewood,
    fontSize: normalize(13),
  },
  dot: {
    backgroundColor: Colors.ball_blue,
    height: normalize(5),
    width: normalize(5),
    borderRadius: normalize(6),
    marginBottom: 2,
  },
  title: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(18),
    marginTop: normalize(10),
  },
  v9: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(15),
    marginBottom: normalize(10),
  },
  v10: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img4: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
  },
  text7: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pickled_bluewood,
    fontSize: normalize(13),
    marginLeft: normalize(8),
  },
  text8: {
    fontSize: normalize(12),
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
  },
  text9: {
    fontSize: normalize(13),
    color: Colors.green,
    fontFamily: Fonts.InterSemiBold,
    marginTop: normalize(5),
  },
  v11: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(15),
    marginBottom: normalize(10),
  },
  button: {
    width: '48%',
    height: normalize(36),
    borderRadius: normalize(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(1),
  },
  img5: {
    height: normalize(115),
    width: '100%',
    resizeMode: 'cover',
    borderTopRightRadius: normalize(8),
    borderTopLeftRadius: normalize(8),
  },
  itemView: {
    backgroundColor: Colors.white,
    marginVertical: normalize(10),
    width: '90%',
    alignSelf: 'center',
    borderColor: hexToRGB(Colors.mirage, 0.1),
    borderWidth: normalize(1),
    borderRadius: normalize(8),
  },
  touch1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(30),
    width: normalize(30),
    borderRadius: normalize(30),
  },
  v12: {
    flexDirection: 'row',
    position: 'absolute',
    right: normalize(5),
    top: normalize(5),
  },
});
