import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import Header from '../../../components/importent/Header';
import Search from '../../../components/importent/Search';
import {Colors, Fonts, Icons, Images} from '../../../themes/Themes';
import normalize from '../../../utils/orientation/normalize';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {setSelectCategory} from '../../../redux/slice/universe.slice';
import {getEarnedLoyaltyPoints} from '../../../utils/service/WalletService';

const Categories = () => {
  const universeState = useAppSelector(state => state.universe);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  console.log('universe - - - ', universeState);

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(universeState?.category);
  const [showAll, setShowAll] = useState(true);
  const authState = useAppSelector(state => state.auth);
    const isLoggedIn = authState.isLoggedIn;

  useFocusEffect(
    React.useCallback(() => {
      getLoyaltyPoints();
    }, []),
  );

  // Fetch Earned Loyalty Points
  const getLoyaltyPoints = useCallback(() => {
    // fetch earned loyalty points
    if(isLoggedIn){
      dispatch(getEarnedLoyaltyPoints());
    }
   
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const isSelectedCategory = useCallback(
    (i, status) => {
      let temp = [...categories].map((item, index) => {
        return {
          ...item,
          isSelected: index === i ? !status : false,
        };
      });
      setCategories(temp);
    },
    [categories],
  );

  const renderItem = useCallback(({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          isSelectedCategory(index, item?.isSelected);
          dispatch(setSelectCategory(item?.isSelected ? null : item));
        }}
        style={{
          backgroundColor: item?.isSelected ? Colors.dark : Colors.white,
          marginVertical: normalize(7),
          height: normalize(100),
          width: '47.5%',
          borderRadius: normalize(6),
          borderColor: Colors.dawn_pink,
          borderWidth: normalize(1),
          padding: normalize(10),
        }}>
        <View
          style={{
            height: Platform.OS == 'android' ? normalize(30) : normalize(35),
            width: Platform.OS == 'android' ? normalize(30) : normalize(35),
            backgroundColor: item?.isSelected ? Colors.white : Colors.dawn_pink,
            borderRadius: normalize(35),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={item?.icon_url ? {uri: item?.icon_url} : Icons.question}
            style={{
              resizeMode: 'contain',
              height: Platform.OS == 'android' ? normalize(16) : normalize(19),
              width: Platform.OS == 'android' ? normalize(16) : normalize(19),
              tintColor: item?.isSelected ? Colors.ball_blue : Colors.river_bed,
            }}
          />
        </View>

        <Text
          style={{
            fontSize: Platform.OS == 'android' ? normalize(12) : normalize(13),
            fontFamily: Fonts.InterSemiBold,
            marginTop: Platform.OS == 'android' ? normalize(10) : normalize(12),
            color: item?.isSelected ? Colors.white : Colors.dark,
          }}>
          {item.category_name}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  function ListHeaderComponent() {
    return (
      <View style={styles.v4}>
        <Text
          style={{
            fontFamily: Fonts.InterSemiBold,
            fontSize: normalize(20),
            color: Colors.dark,
          }}>
          Categories
        </Text>

        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          style={{
            paddingVertical: normalize(5),
          }}>
          <Text style={styles.t1}>{showAll ? 'Show Less' : 'ALL'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
    }, []),
  );

  const handleSearch = query => {
    setSearchQuery(query);

    if (query === '') {
      setCategories(universeState?.category);
    } else {
      const filteredList = universeState?.category.filter(category =>
        category?.category_name.toLowerCase().includes(query.toLowerCase()),
      );
      setCategories(filteredList);
    }
  };

  useEffect(() => {
    if ((isFocused, universeState?.category)) {
      let temp = [...universeState?.category].map((item, index) => ({
        ...item,
        isSelected: universeState?.selectCategory
          ? item?.id == universeState?.selectCategory?.id
          : false,
      }));
      setCategories(temp);
    }
  }, [isFocused, universeState?.category]);

  return (
    <View style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle={'light-content'} />
      <KeyboardAvoidingView style={styles.conatiner}>
        <View style={styles.v1}>
          <Image source={Images.shadow_arrow} style={styles.imgArrow} />
          <Header />
          <Search
            isSearchOptions={true}
            value={searchQuery}
            onChangeText={v => handleSearch(v)}
          />
        </View>
        <View style={styles.v2}>
          <FlatList
            data={showAll ? categories : categories.slice(0, 6)}
            ListHeaderComponent={ListHeaderComponent}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
            contentContainerStyle={{
              paddingBottom: normalize(30),
              paddingTop: normalize(8),
              width: '90%',
              alignSelf: 'center',
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    backgroundColor: Colors.dark,
    borderBottomLeftRadius: normalize(28),
    borderBottomRightRadius: normalize(28),
    height: Platform.OS == 'android' ? normalize(135) : normalize(140),
  },
  imgArrow: {
    height: Platform.OS == 'ios' ? normalize(120) : normalize(108),
    width: Platform.OS == 'ios' ? normalize(120) : normalize(108),
    resizeMode: 'contain',
    position: 'absolute',
    bottom: normalize(-25),
    left: normalize(-5),
  },
  v2: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v3: {
    height: normalize(45),
    width: '100%',
    marginBottom: normalize(5),
    backgroundColor: Colors.white,
    paddingTop: normalize(5),
  },
  v4: {
    height: normalize(45),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  t1: {
    fontFamily: Fonts.InterMedium,
    color: Colors.ball_blue,
    fontSize: normalize(12),
  },
});
