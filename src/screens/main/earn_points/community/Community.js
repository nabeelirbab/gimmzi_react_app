import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import MyStatusBar from '../../../../components/custom/MyStatusBar';
import {Colors, Fonts, Icons} from '../../../../themes/Themes';
import Header from '../../../../components/importent/Header';
import normalize from '../../../../utils/orientation/normalize';
import Filter from '../../../../components/importent/Filter';
import {GimmziContext} from '../../../../utils/helper/GimmziBoundary';
import Picker from '../../../../components/modal/Picker';
import _ from 'lodash';
import CommunityItems from './views/CommunityItems';
import MapFullViews from '../../../../components/mapview/MapFullViews';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {height} = Dimensions.get('window')

// AIzaSyAMyMf61e1LYFVU71hXolczN9jsHfr0wgw

const Community = ({navigation}) => {
  const isFocused = useIsFocused();
  const FILTER_OPTIONS = ['', 'Beds', 'Type', 'Display All'];
  const context = useContext(GimmziContext);
  const [search, setSearch] = useState('');
  const [selectFilterIdx, setSelectFilterIdx] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [isMaximize, setIsMaximize] = useState(false);
  const [isVisibleDetails, setIsVisibleDetails] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
    }, []),
  );

  function FilterOptions() {
    return (
      <View style={styles.v4}>
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
                {item !== '' && item !== undefined &&
              <Text
                style={{
                  fontSize: normalize(12),
                  color:
                    selectFilterIdx == index ? Colors.white : Colors.river_bed,
                  fontFamily: Fonts.InterMedium,
                }}>
                {item}
              </Text> }
              <Image
                source={index == 0 ? Icons.filter : Icons.down_arrow}
                style={[
                  {
                    tintColor:
                      selectFilterIdx == index
                        ? Colors.white
                        : Colors.river_bed,
                    height: normalize(index == 0 ? 14 : 16),
                    width: normalize(index == 0 ? 14 : 16),
                    marginLeft: item !== '' && item !== undefined ? normalize(5) : 0,
                    resizeMode: 'contain',
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

  useEffect(() => {
    if (isFocused) {
      console.log('Home Screen is focused');
    } else {
      context.setStateData(false);
    }
  }, [isFocused]);

  return (
    <View style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle={'light-content'} />
      <KeyboardAvoidingView style={styles.conatiner}>
        <View style={styles.v1}>
          <Header />
        </View>
        <View style={styles.v2}>
          {/* Search And Filter Options */}

          {_.isEmpty(isVisibleDetails) && (
            <View style={styles.v3}>
              {/* Search */}
              <View style={styles.v31}>
                <View style={styles.box}>
                  <Image source={Icons.search} style={styles.search} />
                  <TextInput
                    placeholder="Find on Gimmzi"
                    placeholderTextColor={Colors.pickled_bluewood}
                    style={styles.input}
                    value={search}
                    onChangeText={v => setSearch(v)}
                  />
                </View>
                {/* Map */}
                <TouchableOpacity
                  onPress={() => {
                    setIsVisibleMap(!isVisibleMap);
                    context.setStateData(!isVisibleMap);
                  }}
                  style={[styles.box, styles.box2]}>
                  <Image
                    source={isVisibleMap ? Icons.list : Icons.map}
                    style={styles.map}
                  />
                  <Text style={styles.map_text}>
                    {isVisibleMap ? 'List' : 'Map'}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Filter */}
              <FilterOptions />
            </View>
          )}

          {!_.isEmpty(isVisibleDetails) ? (
            <></>
          ) : (
            <>
              {isVisibleMap ? (
                <MapFullViews
                  isMax={isMaximize}
                  setIsMax={() => setIsMaximize(true)}
                />
              ) : (
                <CommunityItems />
              )}
            </>
          )}
        </View>

        <Picker
          isVisible={isMaximize}
          // onBackdropPress={() => setIsMaximize(false)}
          height={Platform.OS == 'ios' ? normalize(580) : height}
          backdropOpacity={0}
          children={
            <MapFullViews
              isMax={isMaximize}
              setIsMax={() => setIsMaximize(false)}
            />
          }
        />

        <Filter
          isVisible={isVisible}
          onBackdropPress={() => {
            setIsVisible(false);
            setSelectFilterIdx(-1);
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Community;

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
    flex: 1,
    backgroundColor: Colors.white,
  },
  v3: {
    backgroundColor: Colors.catskill_white,
    width: '100%',
    height: normalize(105),
  },
  v31: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(15),
    marginTop: normalize(12),
    marginBottom: normalize(8),
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.iron,
    borderWidth: normalize(1),
    height: normalize(40),
    borderRadius: normalize(6),
    width: '71%',
    backgroundColor: Colors.white,
  },
  box2: {
    borderColor: Colors.white,
    width: '25%',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(10),
  },
  search: {
    height: Platform.OS == 'android' ? normalize(16) : normalize(18),
    width: Platform.OS == 'android' ? normalize(16) : normalize(18),
    resizeMode: 'contain',
    marginLeft: normalize(12),
    marginRight: normalize(8),
    tintColor: Colors.pickled_bluewood,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.dark,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    paddingRight: normalize(10),
  },
  map: {
    width: normalize(18),
    height: normalize(18),
    resizeMode: 'contain',
  },
  map_text: {
    fontFamily: Fonts.InterMedium,
    color: Colors.pickled_bluewood,
    fontSize: normalize(14),
  },
  v4: {
    height: normalize(45),
    width: '100%',
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
});
