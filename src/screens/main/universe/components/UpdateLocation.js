import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import {Colors, Fonts, hexToRGB, Icons} from '../../../../themes/Themes';
import MyStatusBar from '../../../../components/custom/MyStatusBar';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../../utils/orientation/scaleDimensions';
import normalize from '../../../../utils/orientation/normalize';
import {GOOGLE_API_KEY} from '@env';
import axios from 'axios';
import {useAppDispatch} from '../../../../redux';
import {
  setUserAddress,
  setUserCurrentLocation,
} from '../../../../redux/slice/user.slice';
import {updateCurrentLocation} from '../../../../utils/service/UserService';
import {showMessage} from '../../../../utils/helper/Toast';
import Loader from '../../../../components/custom/Loader';
import Storage from '../../../../utils/stroage';
import _ from 'lodash';
import {GimmziContext} from '../../../../utils/helper/GimmziBoundary';
import {useFocusEffect} from '@react-navigation/native';

const UpdateLocation = ({onClose = () => {}, onChangeLocation = () => {}}) => {
  const context = useContext(GimmziContext);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const fetchSuggestions = async text => {
    if (!text) {
      setSuggestions([]);
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}&language=en&types=geocode`;

    try {
      const response = await axios.get(url);
      if (response.data.predictions) {
        setSuggestions(response.data.predictions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = async suggestion => {
    saveRecent({
      description: suggestion?.description,
      place_id: suggestion?.place_id,
    });

    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.place_id}&key=${GOOGLE_API_KEY}`;
      const response = await axios.get(detailsUrl);
      const details = response.data.result;

      if (details) {
        setSearch(suggestion.description);
        setSuggestions([]);

        updateLocation(
          details.geometry.location.lat,
          details.geometry.location.lng,
          details.formatted_address,
        );

        // Fetch address components based on the selected suggestion's coordinates
        // getAddressFromCoordinates(
        //   details.geometry.location.lat,
        //   details.geometry.location.lng,
        // );
      }
    } catch (error) {
      console.error('Error selecting suggestion:', error);
    }
  };

  async function updateLocation(lat, long, address) {
    dispatch(
      setUserCurrentLocation({
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        heading: -1,
      }),
    );
    dispatch(setUserAddress(address));
    setIsLoading(true);
    const result = await dispatch(
      updateCurrentLocation({
        current_lat: lat,
        current_long: long,
      }),
    );
    setIsLoading(false);

    if (result.success) {
      onChangeLocation();
      setSearch('');
      onClose();
      showMessage('Location updated successfully');
    }
  }

  const saveRecent = _item => {
    let recent = Storage.getItem('recent_location_search');
    let updatedSearches = recent !== null ? JSON.parse(recent) : [];

    // Check if the search already exists
    const existingIndex = updatedSearches.findIndex(
      item => item.place_id === _item?.place_id,
    );

    if (existingIndex !== -1) {
      updatedSearches.splice(existingIndex, 1); // Remove the old search
    }

    updatedSearches.unshift(_item); // Add the new search at the beginning

    if (updatedSearches.length > 5) {
      updatedSearches.pop(); // Remove the oldest search if the limit is exceeded
    }

    setRecentSearches(updatedSearches);
    Storage.setItem('recent_location_search', JSON.stringify(updatedSearches));
  };

  const getLiveLocation = useCallback(async () => {
    console.log('getLiveLocation  -  -- - ');

    await context.getCurrentLocation(async coords => {
      if (coords) {
        dispatch(setUserCurrentLocation(coords));
        setIsLoading(true);
        const result = await dispatch(
          updateCurrentLocation({
            current_lat: coords?.latitude,
            current_long: coords?.longitude,
          }),
        );

        context
          .getAddressFromCoords(coords?.latitude, coords?.longitude)
          .then(address => {
            if (address) {
              dispatch(
                setUserAddress(
                  `${address?.city},${address?.state},${address?.country},${address?.postalCode}`,
                ),
              );
            } else {
              console.log('Could not retrieve address.');
            }
          });
        setIsLoading(false);

        if (result?.success) {
          onChangeLocation();
          setSearch('');
          onClose();
          showMessage('Location updated successfully');
        } else {
          showMessage(result.message);
        }
      }
    });
  }, [context, dispatch]);

  //   const getAddressFromCoordinates = async (latitude, longitude) => {
  //     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

  //     try {
  //       const response = await axios.get(url);
  //       if (response.data.results.length > 0) {
  //         const addressComponents = response.data.results[0].address_components;
  //         const state = addressComponents.find(component =>
  //           component.types.includes('administrative_area_level_1'),
  //         )?.long_name;
  //         const pincode = addressComponents.find(component =>
  //           component.types.includes('postal_code'),
  //         )?.long_name;

  //         let obj = {state};

  //         if (pincode !== undefined && pincode !== null) {
  //           obj.pincode = pincode;
  //         }

  //         console.log('Other Information ', obj);
  //       }
  //     } catch (error) {
  //       console.error('Error getting address from coordinates:', error);
  //     }
  //   };

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.v3}
        onPress={() => {
          handleSelectSuggestion(item);
        }}>
        <Text style={styles.title2}>{item.description}</Text>
      </TouchableOpacity>
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
    }, []),
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.conatiner}>
        <MyStatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <Loader visible={isLoading} />
        <TouchableOpacity style={styles.touch} onPress={() => onClose()}>
          <Image source={Icons.close} style={styles.img} />
        </TouchableOpacity>

        <View style={styles.v2}>
          <Image source={Icons.search} style={styles.search} />
          <TextInput
            placeholder={'Search for a city or neighborhood'}
            value={search}
            placeholderTextColor={Colors.pale_sky}
            onChangeText={text => {
              setSearch(text);
              fetchSuggestions(text);
            }}
            onFocus={() => {
              setIsFocused(true);
              let recent = Storage.getItem('recent_location_search');
              if (recent !== null) {
                setRecentSearches(JSON.parse(recent));
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              setRecentSearches([]);
            }}
            style={styles.input}
          />
        </View>

        <FlatList
          data={isFocused && search == '' ? recentSearches : suggestions}
          keyboardShouldPersistTaps={'handled'}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <TouchableOpacity
                onPress={() => getLiveLocation()}
                style={[
                  styles.v2,
                  {
                    borderBottomWidth: 0,
                    paddingHorizontal: 0,
                  },
                ]}>
                <Image
                  source={Icons.navigation}
                  style={[styles.search, {tintColor: Colors.ball_blue}]}
                />
                <Text style={styles.title1}>Use My Location</Text>
              </TouchableOpacity>

              {isFocused && search == '' && !_.isEmpty(recentSearches) && (
                <View style={styles.v3}>
                  <Text style={styles.title3}>Recent Places</Text>
                </View>
              )}
            </>
          }
          contentContainerStyle={{
            paddingHorizontal: horizontalScale(15),
          }}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: verticalScale(70),
              }}>
              <View style={styles.v1}>
                <Image source={Icons.location2} style={styles.loctaionImg} />
              </View>
              <Text style={styles.title}>
                Search for a city or neighborhood to see the nearest deals!
              </Text>
            </View>
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UpdateLocation;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  touch: {
    height: 45,
    width: 45,
    marginHorizontal: horizontalScale(10),
    // marginTop: verticalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: moderateScale(25),
    width: moderateScale(25),
    resizeMode: 'contain',
  },
  title: {
    color: Colors.santa_grey,
    fontSize: moderateScale(16),
    textAlign: 'center',
    width: '40%',
    marginTop: verticalScale(10),
    fontFamily: Fonts.InterMedium,
    lineHeight: verticalScale(20),
  },
  loctaionImg: {
    height: moderateScale(28),
    width: moderateScale(28),
    tintColor: Colors.white,
  },
  v1: {
    backgroundColor: '#e9eaee',
    padding: moderateScale(15),
    borderRadius: moderateScale(80),
  },
  v2: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(15),
    height: verticalScale(45),
    alignItems: 'center',
    borderBottomColor: Colors.dawn_pink,
    borderBottomWidth: moderateScale(0.5),
  },
  search: {
    height: moderateScale(18),
    width: moderateScale(18),
    resizeMode: 'contain',
    marginRight: normalize(10),
    tintColor: Colors.pale_sky,
  },
  input: {
    height: verticalScale(45),
    flex: 1,
    color: Colors.dark,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
  },
  title1: {
    color: Colors.ball_blue,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  v3: {
    padding: normalize(10),
    borderTopWidth: 1,
    borderTopColor: hexToRGB(Colors.iron, 0.5),
  },
  title2: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(13),
    color: Colors.pale_sky,
  },
  title3: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(13),
    color: Colors.dark,
  },
});
