import {
  View,
  Text,
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors, Fonts, Icons} from '../../../themes/Themes';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import Header from '../../../components/importent/Header';
import normalize from '../../../utils/orientation/normalize';
import {MY_HUB_OPTIONS} from '../../../utils/constants';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CustomModal from '../../../components/modal/CustomModal';
import Button from '../../../components/button/Button';
import {navigateToMyHubScreen} from '../../../utils/helper/RootNaivgation';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {deleteAccount, logout} from '../../../utils/service/AuthService';
import {showMessage} from '../../../utils/helper/Toast';
import Loader from '../../../components/custom/Loader';
import {getEarnedLoyaltyPoints} from '../../../utils/service/WalletService';

const MyHub = () => {
  const dispatch = useAppDispatch();
  const navigation=useNavigation();
  const authState = useAppSelector(state => state.auth);
    const isLoggedIn = authState.isLoggedIn;
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userState = useAppSelector(state => state.user);
  const [options, setAllOptions] = useState(MY_HUB_OPTIONS);
  const UD = userState?.userInfo;
    const [openAlert, setOpenAlert] = useState(false);

  console.log('UD -- -', UD);

  // Fetch Earned Loyalty Points
  const getLoyaltyPoints = useCallback(() => {
    // fetch earned loyalty points
    dispatch(getEarnedLoyaltyPoints());
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getLoyaltyPoints();
      StatusBar.setBarStyle('light-content');

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }

      if (UD) {
        setAllOptions(prevOptions =>
          prevOptions.map(section => {
            if (section.type === 'My Wallet') {
              return {
                ...section,
                options: section.options.map(option => {
                  if (option.title === 'My Deals') {
                    return {...option, notify: UD?.deals};
                  } else if (option.title === 'My Loyalty Punch Cards') {
                    return {...option, notify: UD?.loyalty};
                  }
                  return option;
                }),
              };
            }
            return section;
          }),
        );
      }
    }, [UD]),
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderItem = useCallback(
    ({item, index}) => (
      <View style={styles.v3}>
        <Text style={styles.title}>{item.type}</Text>
        {item?.options.map((option, idx) =>{
          console.log("option",option);
          
          return(
            <TouchableOpacity
            onPress={() => {
              if (option.isTab) {
                if (isLoggedIn) {
                  navigateToMyHubScreen('MyWallet', {
                    select: option?.page,
                  });
                } else {
                  setOpenAlert(true);
                }
              } else if (option?.page) {
                if (isLoggedIn) {
                  navigation.navigate(option?.page);
                } else if(!isLoggedIn && option?.page==='SmartFamilyFriends'||option?.page==='AboutGimmzi'){
                  navigation.navigate(option?.page);
                }else{
                  setOpenAlert(true);
                }
              }
            }}
            
            style={styles.touch}>
            <View style={styles.v4}>
              <Image source={option.icon} style={styles.img} />
            </View>
            <Text style={styles.title1}>
              {option?.title}
              {option?.notify ? ` (${option?.notify})` : ''}
            </Text>

            <Image
              source={Icons.arrow_right2}
              style={[
                styles.img,
                {
                  position: 'absolute',
                  right: 0,
                },
              ]}
            />
          </TouchableOpacity>
          )
        } )}
      </View>
    ),
    [],
  );

  function ListFooterComponent() {
    return (
      <>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={[styles.touch, styles.touch1]}>
        <View style={[styles.v4, {backgroundColor: Colors.pearl}]}>
          <Image source={Icons.logout} style={styles.img} />
        </View>
        <Text style={[styles.title1, {color: Colors.carmine_pink}]}>
          Logout
        </Text>
      </TouchableOpacity>
     {isLoggedIn && <TouchableOpacity
        onPress={() => deleteAccountFunc()}
        style={[styles.touch, styles.touch1]}>
        <View style={[styles.v4, {backgroundColor: Colors.pearl}]}>
          <Image source={Icons.bin} style={[styles.img,{tintColor:'red'}]} />
        </View>
        <Text style={[styles.title1, {color: Colors.carmine_pink}]}>
          Delete Account
        </Text>
      </TouchableOpacity>}
      </>
    );
  }

  const deleteAccountFunc = () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress:async () => {
            setIsLoading(true);
            const result = await dispatch(deleteAccount());
            setIsLoading(false);
            showMessage(result?.message);
            if(result?.success){
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'SignIn',
                  },
                ],
              });
            }
            if (!result?.success) {
              return;
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  function ListHeaderComponent() {
    return (
      <View style={styles.v5}>
        <Text style={styles.title2}>My Hub</Text>
      </View>
    );
  }

  async function handleLogout() {
    setIsLoading(true);
    const result = await dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'SignIn',
        },
      ],
    });
    setIsLoading(false);
    showMessage(result?.message);
    if (!result?.success) {
      return;
    }
  }

  return (
    <View style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle={'light-content'} />
      <Loader visible={isLoading} />
      <View style={styles.v1}>
        <Header />
      </View>
      <View style={styles.v2}>
        <FlatList
          bounces={false}
          data={options}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: normalize(30),
          }}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          stickyHeaderIndices={[0]}
        />
      </View>

      {/* Logout Warning */}
      <CustomModal
        isVisible={isVisible}
        onBackdropPress={setIsVisible}
        children={
          <View style={styles.v6}>
            <Text style={styles.title3}>Logout</Text>
            <Text style={styles.title4}>Are you sure you want to log out?</Text>
            <View style={styles.v7}>
              <Button
                title={'Cancel'}
                width={'47.5%'}
                borderColor={Colors.dawn_pink}
                backgroundColor={Colors.white}
                textColor={Colors.ball_blue}
                fontFamily={Fonts.InterMedium}
                height={normalize(38)}
                onPress={() => setIsVisible(false)}
              />
              <Button
                title={'Yes, Logout'}
                width={'47.5%'}
                backgroundColor={Colors.carmine_pink}
                fontFamily={Fonts.InterMedium}
                height={normalize(38)}
                borderColor={Colors.carmine_pink}
                onPress={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    handleLogout();
                  }, 800);
                }}
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
            <Text style={styles.title4}>Sign in to add deals and loyalty punch cards to your wallet. Redeem rewards!</Text>
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

export default MyHub;

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
    // backgroundColor: Colors.red,
  },
  v3: {
    width: '90%',
    alignSelf: 'center',
    borderBottomColor: Colors.iron,
    borderBottomWidth: normalize(1),
    paddingBottom: normalize(6),
    paddingTop: normalize(12),
  },
  title: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(13),
    marginVertical: normalize(4),
  },
  touch: {
    width: '100%',
    height: normalize(48),
    marginVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  touch1: {
    width: '90%',
    alignSelf: 'center',
    marginTop: normalize(6),
  },
  v4: {
    backgroundColor: Colors.catskill_white,
    height: normalize(35),
    width: normalize(35),
    borderRadius: normalize(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    resizeMode: 'contain',
    height: normalize(18),
    width: normalize(18),
  },
  title1: {
    color: Colors.pickled_bluewood,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(12),
    marginLeft: normalize(10),
  },
  v5: {
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(40),
    borderBottomColor: Colors.iron,
    borderBottomWidth: normalize(1),
    backgroundColor: Colors.white,
  },
  title2: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(16),
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
});
