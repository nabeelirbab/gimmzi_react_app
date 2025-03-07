import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useCallback} from 'react';
import {Colors, Fonts} from '../../../themes/Themes';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import Header from '../../../components/importent/Header';
import normalize from '../../../utils/orientation/normalize';
import Button from '../../../components/button/Button';
import {GimmziNetworkData} from '../../../utils/constants';
import {
  navigate,
  navigateToMyHubScreen,
} from '../../../utils/helper/RootNaivgation';
import ERNetworkItem from './components/ERNetworkItem';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {showMessage} from '../../../utils/helper/Toast';
import {getEarnedLoyaltyPoints} from '../../../utils/service/WalletService';
import {useAppDispatch} from '../../../redux';

const ERNetworkDetails = () => {
  const navigation = useNavigation();
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const dispatch = useAppDispatch();

  useFocusEffect(
    React.useCallback(() => {
      getLoyaltyPoints();
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.dark);
      }
    }, []),
  );

  // Fetch Earned Loyalty Points
  const getLoyaltyPoints = useCallback(() => {
    // fetch earned loyalty points
    dispatch(getEarnedLoyaltyPoints());
  }, []);

  return (
    <View style={styles.conatiner}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle={'light-content'} />
      <View style={styles.conatiner}>
        <View style={styles.v1}>
          <Header />
        </View>
        <View style={styles.v2}>
          <Text style={styles.title}>Earn Points</Text>

          <View
            style={{
              flex: 1,
            }}>
            <FlatList
              data={GimmziNetworkData}
              keyExtractor={keyExtractor}
              renderItem={({item, index}) => (
                <ERNetworkItem
                  key={index}
                  item={item}
                  onPress={item => {
                    if (item?.type == 'Community') {
                      // navigate('Community');
                      showMessage('Coming Soon');
                    } else if (item?.type == 'TravelPartners') {
                      // navigate('PropertyListing');
                      showMessage('Coming Soon');
                    } else if (item?.type == 'DigitalPunchCards') {
                      // navigateToMyHubScreen('MyWallet', {
                      //   select: 'LoyaltyPunchCards',
                      // });
                      navigate('Home',{
                        select: 'loyaltyRewards',
                      })
                    }
                  }}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: normalize(45),
              }}
              ListFooterComponent={
                <View>
                  {/* <Text
                    style={{
                      color: Colors.dark,
                      fontFamily: Fonts.InterRegular,
                      textAlign: 'center',
                      width: '60%',
                      alignSelf: 'center',
                      marginTop: normalize(15),
                    }}>
                    Check to see if my community is in the Gimmzi Network
                  </Text>

                  <Button
                    onPress={() => {
                      navigation.navigate('EarnPoint');
                    }}
                    title={'Scan Gimmzi Network'}
                    marginTop={normalize(15)}
                    fontFamily={Fonts.InterMedium}
                    fontSize={normalize(15)}
                    marginBottom={normalize(20)}
                  /> */}
                </View>
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ERNetworkDetails;

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
  title: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(20),
    color: Colors.dark,
    width: '90%',
    alignSelf: 'center',
    marginVertical: normalize(10),
  },
});
