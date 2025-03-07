import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import {Colors, Fonts, Icons} from '../../../themes/Themes';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import TopHeader from '../../../components/importent/TopHeader';
import normalize from '../../../utils/orientation/normalize';
import {useFocusEffect} from '@react-navigation/native';
import TextInput from '../../../components/input/TextInput';
import _ from 'lodash';
import {navigate} from '../../../utils/helper/RootNaivgation';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {searchUniverseBusinessProfile} from '../../../utils/service/UniverseService';
import Storage from '../../../utils/stroage';
import {verticalScale} from '../../../utils/orientation/scaleDimensions';
import { GimmziContext } from '../../../utils/helper/GimmziBoundary';

const SearchResults = () => {
  const dispatch = useAppDispatch();
    const authState = useAppSelector(state => state.auth);
      const isLoggedIn = authState.isLoggedIn;
  const [search, setSearch] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [location, setLocation] = useState([]);
  console.log("searchdata",data);
    const context = useContext(GimmziContext);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or do something
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or do something
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
      if(!isLoggedIn){
        getLiveLocation();
      }
      setSearch('');
      let recent = Storage.getItem('recent_search');
      if (recent !== null) {
        setRecentSearches(JSON.parse(recent));
      }
    }, []),
  );

    const getLiveLocation = useCallback(async () => {
      console.log('getLiveLocation  -  -- - ');
  
      await context.getCurrentLocation(async coords => {
        console.log('coords', coords);
        setLocation(coords);
  
      });
    }, [context]);

  const saveRecent = _item => {
    let updatedSearches = [...recentSearches];

    // Check if the search already exists
    const existingIndex = updatedSearches.findIndex(
      item => item.id === _item?.id,
    );
    if (existingIndex !== -1) {
      updatedSearches.splice(existingIndex, 1); // Remove the old search
    }

    updatedSearches.unshift(_item); // Add the new search at the beginning

    if (updatedSearches.length > 5) {
      updatedSearches.pop(); // Remove the oldest search if the limit is exceeded
    }

    setRecentSearches(updatedSearches);
    Storage.setItem('recent_search', JSON.stringify(updatedSearches));
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          saveRecent(item);
          navigate('RewardDetails', {
            id: item?.id,
            locationId: item?.main_location?.id,
          });
        }}
        style={styles.touch}>
        <Image source={{uri: item?.logo_image}} style={styles.img} />
        <View style={styles.v4}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="clip">
            {item?.business_name}
          </Text>
          <Text
            style={
              styles.address
            }>{`${item?.main_location?.full_location} • ${item?.distance} mi`}</Text>
        </View>
        {search !== '' && (
          <Image source={Icons.right_arrow} style={styles.right_arrow} />
        )}
      </TouchableOpacity>
    ),
    [isKeyboardVisible, search],
  );

  const fetchSearchResults = async searchQuery => {
    setData([]);
    setLoading(true);
    let obj={
      name:searchQuery,
      lat:location?.latitude,
      long:location?.longitude
    }
    const result = await dispatch(searchUniverseBusinessProfile(obj));
    console.log(result,"search result",obj);
    
    setLoading(false);

    if (!result?.success) {
      // showMessage(result.message);
      return null;
    }

    setData(result?.data ? result?.data : []);
  };

  const getSearchResults = useCallback(
    _.debounce(searchQuery => fetchSearchResults(searchQuery), 500),
    [],
  );
  console.log("getSearchResults",getSearchResults);
  

  const handleInputChange = text => {
    setSearch(text);
    getSearchResults(text);
  };

  return (
    <SafeAreaView style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <TopHeader title="Search Results" borderColor="transparent" />
      <View style={styles.v3}>
        <TextInput
          value={search}
          onChangeText={v => handleInputChange(v)}
          isShowTitle={false}
          backgroundColor={Colors.dawn_pink}
          borderColor={Colors.dawn_pink}
          placeholder="Find on Gimmzi"
          placeholderColor={Colors.mist_blue}
          leftIcon={Icons.search}
          tintColor={Colors.santa_grey}
          loading={loading}
        />
      </View>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            data={search !== '' ? data : recentSearches} //isKeyboardVisible ? SEARCH_DATA.slice(0, 2) : SEARCH_DATA
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            keyboardShouldPersistTaps={'always'}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.v5}>
                <Text style={styles.title1}>
                  {search !== ''
                    ? 'All results'
                    : !_.isEmpty(recentSearches)
                    ? 'Recent'
                    : ''}
                </Text>
                {!_.isEmpty(search !== '' ? data : recentSearches) ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (search !== '') {
                        setData([]);
                      } else {
                        Storage.deleteItem('recent_search');
                        setRecentSearches([]);
                      }
                    }}
                    style={styles.touch1}>
                    <Text style={styles.title2}>Clear</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            }
            ListEmptyComponent={
              <Text style={styles.title3}>No data found</Text>
            }
            stickyHeaderIndices={[0]}
            contentContainerStyle={{
              paddingBottom: normalize(30),
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SearchResults;

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
    borderBottomColor: Colors.dawn_pink,
    borderBottomWidth: normalize(1),
    paddingBottom: normalize(5),
  },
  touch: {
    minHeight: normalize(65),
    width: '90%',
    marginBottom: normalize(12),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  img: {
    height: normalize(65),
    width: normalize(85),
    borderRadius: normalize(8),
    resizeMode: 'cover',
  },
  v4: {
    flex: 1,
    paddingHorizontal: normalize(10),
  },
  title: {
    color: Colors.dark,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(15),
    marginTop: normalize(5),
  },
  address: {
    fontSize: normalize(11),
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    marginTop: normalize(5),
  },
  distance: {
    fontSize: normalize(12),
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
  },
  right_arrow: {
    height: normalize(12),
    width: normalize(12),
    resizeMode: 'contain',
    tintColor: Colors.river_bed,
  },
  v5: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(18),
    flexDirection: 'row',
    backgroundColor: Colors.white,
    height: normalize(40),
  },
  title1: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(15),
  },
  touch1: {
    height: '100%',
    justifyContent: 'center',
  },
  title2: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
  },
  title3: {
    color: Colors.pale_sky,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
    alignSelf: 'center',
    marginTop: verticalScale(100),
  },
});
