import React, {useCallback, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import TopHeader from '../../../components/importent/TopHeader';
import {Colors, Fonts, Images, hexToRGB} from '../../../themes/Themes';
import {horizontalScale} from '../../../utils/orientation/scaleDimensions';
import normalize from '../../../utils/orientation/normalize';
import {
  ReferralProgramData as DATA,
  Referral_DATA,
} from '../../../utils/constants';
import _ from 'lodash';
import {goBack} from '../../../utils/helper/RootNaivgation';
import PayoutProgressCard from './components/PayoutProgressCard';
import PaginationDot from 'react-native-animated-pagination-dot';

const width = horizontalScale(350); // Dimensions.get('window').width;

const PayoutProgress = () => {
  const _scrollX = useRef(new Animated.Value(0)).current;
  const horizontalScrollRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const ListBadgeItems = React.memo(({item, isEven, isHeader = false}) => {
    const text_style = {
      color: isHeader ? Colors.ball_blue : Colors.mirage,
      fontFamily: isHeader ? Fonts.InterMedium : Fonts.InterRegular,
      fontSize: normalize(isHeader ? 12 : 11),
      width: horizontalScale(185),
      marginRight: normalize(20),
    };

    return (
      <View
        style={{
          backgroundColor: isEven ? Colors.alabaster : Colors.white,
          borderTopWidth: isHeader ? 0 : normalize(1),
          height: normalize(38),
          flexDirection: 'row',
          borderTopColor: Colors.dawn_pink,
          alignItems: 'center',
          paddingHorizontal: normalize(18),
        }}>
        <Text style={text_style}>{item.type}</Text>
        <Text style={text_style}>{item.name}</Text>
        <Text style={text_style}>{item.plan}</Text>
        <Text style={text_style}>{item.month}</Text>
        <Text style={text_style}>{item.month1}</Text>
        <Text style={text_style}>{item.month2}</Text>
      </View>
    );
  });

  const renderBadgeItem = useCallback(({item, index}) => {
    const isEven = index % 2 === 0;
    return <ListBadgeItems key={index} item={item} isEven={!isEven} />;
  }, []);

  // -----------

  const renderItem = ({item}) => <PayoutProgressCard item={item} />;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <TopHeader
        title="Gimmzi Referral Program"
        isGoBack={false}
        onPress={() => goBack()}
        borderColor={hexToRGB(Colors.iron, 0)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: normalize(5),
          paddingBottom: normalize(30),
        }}
        style={styles.v1}>
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
              BH5855
            </Text>
          }
        </Text>

        <View>
          <FlatList
            data={DATA}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: _scrollX}}}],
              {useNativeDriver: false},
            )}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
          />

          <View style={styles.pagination}>
            <PaginationDot
              activeDotColor={Colors.ball_blue}
              curPage={currentIndex}
              maxPage={DATA.length}
              sizeRatio={1}
              inactiveDotColor={Colors.black} // dawn_pink
            />
          </View>
        </View>

        <View
          style={{
            marginTop: normalize(10),
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
                  scrollEnabled={false}
                  data={Referral_DATA}
                  ListHeaderComponent={
                    <ListBadgeItems
                      key={0}
                      item={{
                        type: 'Referral Type',
                        name: 'Name',
                        plan: 'Plan',
                        month: 'Month 1',
                        month1: 'Month 2',
                        month2: 'Month 3',
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
      </ScrollView>
    </View>
  );
};

export default PayoutProgress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    flex: 1,
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
  v2: {
    backgroundColor: Colors.dark,
    height: Platform.OS == 'android' ? normalize(140) : normalize(125),
    width: '90%',
    borderRadius: normalize(10),
    padding: normalize(15),
    alignSelf: 'center',
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
    marginBottom: normalize(25),
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    bottom: normalize(6),
  },
});
