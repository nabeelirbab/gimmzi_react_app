import React, {useCallback, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import TopHeader from '../../../components/importent/TopHeader';
import {Colors, Fonts, Icons, hexToRGB} from '../../../themes/Themes';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/orientation/scaleDimensions';
import normalize from '../../../utils/orientation/normalize';
import {
  BADGE_BOOSTS_OPTIONS,
  BADGE_MEMBERS,
  COLOR_EFFECT,
  LIST_MEMBERS,
  LIST_OPTIONS,
  OPTIONS,
} from '../../../utils/constants';
import _ from 'lodash';
import CustomModal from '../../../components/modal/CustomModal';
import Button from '../../../components/button/Button';
import {goBack} from '../../../utils/helper/RootNaivgation';

const width = horizontalScale(350); // Dimensions.get('window').width;

const MyListFamilyFriends = ({route}) => {
  const {type} = route?.params;
  const [isOptionIndex, setIsOptionIndex] = useState(type == 'list' ? 0 : 1);
  const [isCategoryIndex, setIsCategoryIndex] = useState(-1);

  const flatListRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleContentSizeChange = (width, height) => {
    setContentWidth(width);
  };

  const handleScroll = event => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  const indicatorWidth = contentWidth > 0 ? width * (width / contentWidth) : 0;
  const indicatorPosition =
    contentWidth > 0 ? scrollX * (width / contentWidth) : 0;

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const handleCategoryPress = index => {
    const itemWidth = normalize(120); // Adjust as per your item width
    const screenWidth = Dimensions.get('window').width;
    const offset = index * itemWidth - (screenWidth / 2 - itemWidth / 2);
    flatListRef.current.scrollToOffset({animated: true, offset});
  };

  const ListItems = React.memo(({item, isEven, isHeader = false}) => {
    return (
      <View
        style={[
          {
            backgroundColor: isEven ? Colors.alabaster : Colors.white,
            borderTopWidth: isHeader ? 0 : normalize(1),
          },
          styles.v3,
        ]}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={styles.touch3} />
          <Text
            style={{
              color: isHeader ? Colors.ball_blue : Colors.mirage,
              fontFamily: isHeader ? Fonts.InterMedium : Fonts.InterRegular,
              fontSize: normalize(isHeader ? 12 : 11),
            }}>
            {item?.name}
          </Text>
          {isHeader && <Image source={Icons.down_arrow2} style={styles.img} />}
        </View>
        <Text
          style={{
            flex: 0.6,
            color: isHeader ? Colors.ball_blue : Colors.mirage,
            fontFamily: isHeader ? Fonts.InterMedium : Fonts.InterRegular,
            fontSize: normalize(11),
          }}>
          {item.status}
        </Text>
      </View>
    );
  });

  const renderItem = useCallback(({item, index}) => {
    const isEven = index % 2 === 0;
    return <ListItems key={index} item={item} isEven={!isEven} />;
  }, []);

  const ListBadgeItems = React.memo(({item, isEven, isHeader = false}) => {
    const text_style = {
      color: isHeader ? Colors.ball_blue : Colors.mirage,
      fontFamily: isHeader ? Fonts.InterMedium : Fonts.InterRegular,
      fontSize: normalize(isHeader ? 12 : 11),
      width: horizontalScale(185),
      marginRight: normalize(20),
    };

    let _color = COLOR_EFFECT.filter(it => it.status == item?.status);

    return (
      <View
        style={{
          backgroundColor: isEven ? Colors.alabaster : Colors.white,
          borderTopWidth: isHeader ? 0 : normalize(1),
          height: normalize(38),
          //   width: normalize(100),
          flexDirection: 'row',
          borderTopColor: Colors.dawn_pink,
          alignItems: 'center',
          paddingHorizontal: normalize(18),
        }}>
        <Text style={text_style}>{item.provider}</Text>
        <Text style={text_style}>{item.reward}</Text>
        <Text style={text_style}>{item.existing_members}</Text>
        <Text style={text_style}>{item.new_members}</Text>

        {!_.isEmpty(_color) ? (
          <View
            style={{
              backgroundColor: !_.isEmpty(_color)
                ? _color[0]?.background
                : undefined,
              paddingVertical: normalize(3),
              paddingHorizontal: normalize(10),
              borderRadius: normalize(15),
              borderWidth: normalize(1),
              borderColor: _color[0]?.stroke,
            }}>
            <Text
              style={{
                fontFamily: Fonts.InterMedium,
                color: isHeader
                  ? Colors.ball_blue
                  : !_.isEmpty(_color)
                  ? _color[0]?.color
                  : Colors.mirage,
                fontSize: normalize(isHeader ? 12 : 11),
              }}>
              {item.status}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: isHeader ? Colors.ball_blue : Colors.mirage,
              fontSize: normalize(isHeader ? 12 : 11),
            }}>
            {item.status}
          </Text>
        )}
      </View>
    );
  });

  const renderBadgeItem = useCallback(({item, index}) => {
    const isEven = index % 2 === 0;
    return <ListBadgeItems key={index} item={item} isEven={!isEven} />;
  }, []);

  return (
    <View style={styles.container}>
      <MyStatusBar />
      <TopHeader
        title="My Smart Family and Friends"
        borderColor={hexToRGB(Colors.iron, 0.3)}
      />
      

      <View style={styles.v1}>
        {/* Options  */}
        <View style={styles.v2}>
          {OPTIONS.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setIsOptionIndex(index)}
              activeOpacity={0.7}
              style={[
                styles.touch1,
                {
                  backgroundColor:
                    index === isOptionIndex ? Colors.ball_blue : Colors.white,
                  borderTopLeftRadius: index === 0 ? moderateScale(6) : 0,
                  borderTopRightRadius: index !== 0 ? moderateScale(6) : 0,
                  borderBottomLeftRadius: index === 0 ? moderateScale(6) : 0,
                  borderBottomRightRadius: index !== 0 ? moderateScale(6) : 0,
                },
              ]}>
              <Text
                style={{
                  color:
                    index === isOptionIndex ? Colors.water : Colors.ball_blue,
                  fontFamily: Fonts.InterMedium,
                  fontSize: normalize(12),
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List category  */}
        <View
          style={{
            height: verticalScale(35),
            marginTop: normalize(10),
          }}>
          <FlatList
            ref={flatListRef}
            data={isOptionIndex == 0 ? LIST_OPTIONS : BADGE_BOOSTS_OPTIONS}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setIsVisible(true);
                  //   if (isCategoryIndex == index) {
                  //     setIsCategoryIndex(-1);
                  //     handleCategoryPress(0);
                  //   } else {
                  //     setIsCategoryIndex(index);
                  //     handleCategoryPress(index);
                  //   }
                }}
                style={[
                  styles.touch2,
                  {
                    backgroundColor:
                      isCategoryIndex === index
                        ? Colors.ball_blue
                        : Colors.white,
                    borderColor:
                      isCategoryIndex === index
                        ? Colors.ball_blue
                        : Colors.iron,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: Fonts.InterMedium,
                    fontSize: normalize(13),
                    color:
                      isCategoryIndex === index
                        ? Colors.white
                        : Colors.river_bed,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{
              paddingHorizontal: '5%',
            }}
          />
        </View>

        {/* List category details */}
        {isOptionIndex == 0 && (
          <View style={styles.v4}>
            <FlatList
              data={LIST_MEMBERS}
              key={keyExtractor}
              ListHeaderComponent={
                <ListItems
                  key={0}
                  item={{
                    name: 'Name',
                    status: 'New (members you added) or Existing',
                  }}
                  isEven={true}
                  isHeader={true}
                />
              }
              renderItem={renderItem}
              style={{flex: 1}}
              contentContainerStyle={styles.flatlistConatiner}
            />
          </View>
        )}

        {isOptionIndex == 1 && (
          <View
            style={{
              marginTop: normalize(15),
            }}>
            <FlatList
              data={[0]} // HorizontalList
              horizontal
              ref={horizontalScrollRef}
              onContentSizeChange={handleContentSizeChange}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={({item, index}) => {
                return (
                  <FlatList
                    key={index}
                    data={BADGE_MEMBERS}
                    // onLayout={event => {
                    //   console.log(
                    //     'event.nativeEvent.layout -- ',
                    //     event.nativeEvent.layout?.width,
                    //   );
                    // }}
                    ListHeaderComponent={
                      <ListBadgeItems
                        key={0}
                        item={{
                          provider: 'Provider',
                          reward: 'Family and Friend Reward',
                          existing_members: 'Send To Existing Members',
                          new_members: 'Send to New Members',
                          status: 'Status',
                        }}
                        isEven={true}
                        isHeader={true}
                      />
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                    renderItem={renderBadgeItem}
                    contentContainerStyle={styles.flatlistConatiner}
                  />
                );
              }}
              contentContainerStyle={{
                paddingHorizontal: normalize(18),
                // marginBottom: normalize(15),
              }}
            />

            {/* Custom Indicator */}
            <View style={styles.v5}>
              <View style={styles.v6}>
                <View
                  style={[
                    styles.v7,
                    {
                      width: indicatorWidth,
                      left: indicatorPosition,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      <CustomModal
        isVisible={isVisible}
        onBackdropPress={() => {
          setIsVisible(false);
        }}
        children={
          <View style={styles.v8}>
            <Text style={styles.t1}>Transaction Rewards Summary</Text>

            {[
              'Recipient: Jhon Smith (New Member)',
              'Reward: Badge Booster(30 pts/m)',
              'Your Reward: Badge Booster(10 pts/mo)',
            ].map((item, index) => {
              const splitStr = item.split(': ');
              return (
                <Text key={index} style={styles.t2}>
                  {splitStr[0] + ': '}
                  <Text style={{color: Colors.ball_blue}}>{splitStr[1]}</Text>
                </Text>
              );
            })}
            <View style={styles.v9}>
              <Button
                title={'Cancel'}
                width={'48%'}
                textColor={Colors.ball_blue}
                backgroundColor={Colors.white}
                borderColor={Colors.dawn_pink}
                fontFamily={Fonts.InterMedium}
                onPress={() => setIsVisible(false)}
              />
              <Button
                title={'Send'}
                width={'48%'}
                fontFamily={Fonts.InterMedium}
                onPress={() => setIsVisible(false)}
              />
            </View>
          </View>
        }
      />
    </View>
  );
};

export default MyListFamilyFriends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    flex: 1,
  },
  v2: {
    width: '90%',
    alignSelf: 'center',
    // height: verticalScale(50),
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(5),
    borderColor: Colors.dawn_pink,
    flexDirection: 'row',
    backgroundColor: Colors.dawn_pink,
    marginTop: normalize(15),
  },
  touch1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(5),
  },
  touch2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(1),
    paddingHorizontal: normalize(10),
    height: '100%',
    borderRadius: normalize(6),
    marginRight: normalize(8),
  },
  v3: {
    minHeight: normalize(38),
    width: '100%',
    flexDirection: 'row',
    borderTopColor: Colors.dawn_pink,
    alignItems: 'center',
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(5),
  },
  touch3: {
    height: normalize(15),
    width: normalize(15),
    borderWidth: normalize(1),
    borderColor: Colors.iron,
    borderRadius: normalize(4),
    marginRight: normalize(12),
  },
  img: {
    height: normalize(10),
    width: normalize(10),
    resizeMode: 'contain',
    tintColor: Colors.ball_blue,
    marginLeft: normalize(5),
  },
  v4: {
    height: '80%',
    width: '90%',
    marginTop: normalize(15),
    alignSelf: 'center',
  },
  flatlistConatiner: {
    borderRadius: normalize(6),
    overflow: 'hidden',
    borderWidth: normalize(1),
    borderColor: Colors.dawn_pink,
  },
  v5: {
    justifyContent: 'center',
    paddingVertical: normalize(10),
    width: '90%',
    alignSelf: 'center',
    borderRadius: normalize(8),
  },
  v6: {
    height: normalize(9),
    width: '100%',
    justifyContent: 'center',
    backgroundColor: Colors.catskill_white,
    borderRadius: normalize(8),
  },
  v7: {
    position: 'absolute',
    backgroundColor: Colors.iron,
    borderRadius: normalize(8),
    height: normalize(9),
  },
  v8: {
    backgroundColor: Colors.white,
    width: '90%',
    alignSelf: 'center',
    borderRadius: normalize(10),
    padding: normalize(15),
  },
  t1: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    alignSelf: 'center',
    marginBottom: normalize(10),
  },
  t2: {
    color: Colors.mist_blue,
    fontFamily: Fonts.InterMedium,
    fontSize: horizontalScale(17),
    lineHeight: normalize(25),
  },
  v9: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(15),
    borderTopColor: Colors.dawn_pink,
    borderTopWidth: normalize(1),
    paddingTop: normalize(20),
  },
});
