import {View, Platform, StyleSheet, FlatList, StatusBar} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../../../components/importent/Header';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import {Colors, Fonts} from '../../../themes/Themes';
import normalize from '../../../utils/orientation/normalize';
import {FavouriteCardList} from '../../../utils/constants';
import FavouriteCard from './components/FavouriteCard';
import {useFocusEffect, useIsFocused, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {
  addFavourite,
  dealsLoyalityAddFavourite,
  getFavourites,
} from '../../../utils/service/UniverseService';
import {Text} from 'react-native';
import Loader from '../../../components/custom/Loader';
import {getEarnedLoyaltyPoints} from '../../../utils/service/WalletService';
import CustomModal from '../../../components/modal/CustomModal';
import {moderateScale} from '../../../utils/orientation/scaleDimensions';
import Button from '../../../components/button/Button';
import {showMessage} from '../../../utils/helper/Toast';

const Favorites = () => {
  const dispatch = useAppDispatch();
    const navigation=useNavigation();
  const authState = useAppSelector(state => state.auth);
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const isFocused = useIsFocused();
  const isLoggedIn = authState.isLoggedIn;
  // console.log("favourites",favourites);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     StatusBar.setBarStyle('light-content');
  //     if (Platform.OS === 'android') {
  //       StatusBar.setBackgroundColor(Colors.dark);
  //     }
  //     fetchFavourite();
  //     getLoyaltyPoints();
  //   }, []),
  // );

  useEffect(() => {
    if (isFocused && isLoggedIn) {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
      fetchFavourite();
      getLoyaltyPoints();
    }else{
      setOpenAlert(true)
    }
  }, [isFocused]);

  // Fetch Earned Loyalty Points
  const getLoyaltyPoints = useCallback(() => {
    // fetch earned loyalty points
    dispatch(getEarnedLoyaltyPoints());
  }, []);

  const fetchFavourite = useCallback(async () => {
    if (isFocused) {
      try {
        setIsLoading(true);
        const result = await dispatch(getFavourites());
        console.log(result, 'result get fav list');

        setIsLoading(false);
        setFavourites(result.data);
      } catch (error) {
        console.log('error in fetch favourites: ' + error);
      }
    }
  }, [favourites, dispatch, isFocused]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderItem = ({item, index}) => {
    const newitem = {...item};

    return (
      <FavouriteCard
        item={item}
        onPressFavorite={item => {
          console.log('Favorite pressed:', item);
          setSelectedItem(item);
          setShowAlert(true);
        }}
      />
    );
  };

  async function onPressYes() {
    if (!selectedItem?.deal && !selectedItem?.loyalty) {
      let obj = {
        business_id: selectedItem?.business_id,
      };
      const result = await dispatch(addFavourite(obj));
      console.log('result0000', result);
      showMessage(result.message);
      setShowAlert(false);
      if (result.success) {
        fetchFavourite();
      }
    } else {
      const obj = {
        type: selectedItem?.deal_id !== null ? 'gimmziDeals' : 'loyaltyRewards',
        ...(selectedItem?.deal_id !== null && {deal_id: selectedItem?.deal_id}),
        ...(selectedItem?.loyalty_id !== null && {
          loyalty_id: selectedItem?.loyalty_id,
        }),
      };
      console.log('add fav obj', obj);
      const result = await dispatch(dealsLoyalityAddFavourite(obj));
      console.log('result0000', result);
      showMessage(result.message);
      setShowAlert(false);
      if (result.success) {
        fetchFavourite();
      }
    }
  }

  return (
    <View style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle={'light-content'} />
      <Loader visible={isLoading} />
      <View style={styles.conatiner}>
        <View style={styles.v1}>
          <Header />
        </View>
        <View style={styles.v2}>
          <FlatList
            data={favourites}
            keyExtractor={item => item?._id?.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: normalize(30),
            }}
            ListEmptyComponent={() => (
              <Text
                style={{
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: Colors.santa_grey,
                  fontSize: normalize(13),
                  fontFamily: Fonts.InterRegular,
                  marginTop: normalize(50),
                }}>
                No Favorites Found
              </Text>
            )}
          />
        </View>
      </View>
      <CustomModal
        isVisible={showAlert}
        onBackdropPress={() => {
          setShowAlert(false);
        }}
        children={
          <View style={styles.v6}>
            <Text style={styles.alertTitle}>Remove from Favorites?</Text>
            <View style={styles.flexView}>
              <Button
                onPress={() => onPressYes()}
                title={'Yes'}
                marginTop={normalize(15)}
                width={'48%'}
                fontSize={normalize(11)}
                height={normalize(30)}
              />
              <Button
                onPress={() => setShowAlert(false)}
                title={'No'}
                marginTop={normalize(15)}
                width={'48%'}
                fontSize={normalize(11)}
                height={normalize(30)}
                backgroundColor={'white'}
                borderColor={'#D0D5DD'}
                textColor={'#182230'}
              />
            </View>
          </View>
        }
      />

<CustomModal
        isVisible={openAlert}
        onBackdropPress={()=>setOpenAlert(false)}
        children={
          <View style={styles.v6}>
            <Text style={styles.title3}>SignIn Required!</Text>
            <Text style={styles.title4}>Sign in to save this deal and redeem rewards!?</Text>
            <View style={styles.v7}>
              <Button
                title={'Sign In'}
                width={'100%'}
                borderColor={Colors.dawn_pink}
                backgroundColor={Colors.white}
                textColor={Colors.ball_blue}
                fontFamily={Fonts.InterMedium}
                height={normalize(38)}
                onPress={() => {
                  setOpenAlert(false);
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'SignIn',
                      },
                    ],
                  });
                }}
              />
            </View>
          </View>
        }
      />
    </View>
  );
};

export default Favorites;

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
  },
  v6: {
    backgroundColor: Colors.white,
    width: '85%',
    alignSelf: 'center',
    paddingVertical: moderateScale(45),
    borderRadius: moderateScale(8),
    paddingHorizontal: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: normalize(14),
    color: Colors.black,
    fontFamily: Fonts.InterBold,
  },
  flexView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  v7: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: normalize(20),
    paddingTop: normalize(15),
    borderTopColor: Colors.dawn_pink,
    borderTopWidth: normalize(1),
  },
  v6: {
    width: '90%',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    borderRadius: normalize(10),
    alignItems: 'center',
    padding: normalize(15),
  },
  title3: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    marginBottom: normalize(5),
  },
  title4: {
    color: Colors.mist_blue,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(15),
    marginTop: normalize(5),
    textAlign:'center'
  },
});
