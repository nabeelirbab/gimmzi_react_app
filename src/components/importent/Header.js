import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  InteractionManager,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {Colors, Fonts, Icons, Images} from '../../themes/Themes';
import normalize from '../../utils/orientation/normalize';
import PropTypes from 'prop-types';
import {
  navigateToMyHubScreen,
  navigateToTabScreen,
  navigateToUniverseScreen,
} from '../../utils/helper/RootNaivgation';
import {useAppDispatch, useAppSelector} from '../../redux';
import CustomModal from '../modal/CustomModal';
import LinearGradient from 'react-native-linear-gradient';
import { getEarnedLoyaltyPoints, getUpdatedEarnedPoint } from '../../utils/service/WalletService';
import Button from '../button/Button';
import { useNavigation } from '@react-navigation/native';

const Header = props => {
  const navigation=useNavigation();
  const walletState = useAppSelector(state => state.wallet);
  const userState = useAppSelector(state => state.user);
const authState = useAppSelector(state => state.auth);
  const isLoggedIn = authState.isLoggedIn;
  const [timeLeft, setTimeLeft] = useState('');
  const [showPointModal, setShowPointModal] = useState(false);
  const [hasDispatched, setHasDispatched] = useState(false);
  const dispatch = useAppDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  // console.log("walletState",walletState);
  // console.log("userState?.userInfo?.user?.point",userState);

  

  function isPressPoint() {
    if (props.onPressPoint) {
      props.onPressPoint();
    }
  }

  function isPressNotify() {
    if (props.onPressNotify) {
      props.onPressNotify();
    }
  }

  function togglePointModal() {
    setShowPointModal(preState => !preState);
  }

  function handleClose() {
    setShowPointModal(false);
  }

 
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!props.targetDate) {
        if (!hasDispatched) {
          dispatch(getUpdatedEarnedPoint());
          dispatch(getEarnedLoyaltyPoints());
          setHasDispatched(true); 
        }
        return '0d 0h 0m 0s';
      } else {
        const now = new Date();
        const difference = new Date(props.targetDate) - now;
      // console.log("difference",difference);
      if(!Number.isNaN(difference)){
        if (difference <= 0 ) {
          if (!hasDispatched) {
            dispatch(getUpdatedEarnedPoint());
            dispatch(getEarnedLoyaltyPoints());
            setHasDispatched(true);
          }
          return '0d 0h 0m 0s';
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
      }
    };

    const timer = setInterval(() => {
      if(isLoggedIn){
      setTimeLeft(calculateTimeLeft());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, hasDispatched,props.targetDate]);
  
  const currentDate = new Date();
  const nextMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
  );
  const nextMonthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(nextMonthDate);
  // console.log("Next Month:", nextMonthName);

  return (
    <Fragment>
      <View style={styles.v1}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigateToTabScreen('UniverseStack')}>
          <Image source={Images.logo} style={styles.logo} />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => togglePointModal()}
            style={[
              styles.v2,
              {
                width: undefined,
                paddingHorizontal: normalize(12),
              },
            ]}>
            <Image source={Icons.points} style={styles.img} />
            <Text style={styles.title}>{walletState.total_points}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              {if(isLoggedIn){
              navigateToMyHubScreen('MyWallet', {
                select: '',
              })}else{
                setOpenAlert(true)
              }}
            }
            style={[styles.v2, {marginLeft: normalize(3)}]}>
            <Image source={Icons.wallet} style={styles.img} />
            {walletState?.count !== null &&
            walletState?.count !== 0 &&
            walletState?.count !== undefined ? (
              <View style={styles.circle}>
                <Text style={styles.count}>
                  {walletState?.count}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              isPressNotify();
              navigateToMyHubScreen('MyInbox');
            }}
            style={[styles.v2, {marginLeft: normalize(3)}]}>
            <Image source={Icons.notification} style={styles.img} />
            {/* <View style={styles.circle}>
              <Text numberOfLines={1} style={styles.count}>
                5
              </Text>
            </View> */}
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal isVisible={showPointModal} onBackdropPress={handleClose}>
        <View style={styles.pointModalContainer}>
          <TouchableOpacity
            onPress={handleClose}
            style={{alignSelf: 'flex-end', marginBottom: normalize(12)}}>
            <Image source={Icons.close} style={[styles.iconXs]} />
          </TouchableOpacity>
          <View style={[styles.pointsContainer]}>
            <Image source={Icons.points} style={[styles.iconXs]} />
            <Text style={[styles.txtBody, {paddingHorizontal: normalize(6),color:'white'}]}>
              Total points:{' '}
              <Text style={[styles.txtBold,{color:walletState.total_points<20?'red':'white'}]}>{walletState.total_points||0}</Text>
            </Text>
          </View>
          <Text style={[styles.splTxt]}>
            Need More Points?{' '}
            <Text style={[styles.highlightedTxt]}>Earn Loyalty points</Text> by
            adding <Text style={[styles.txtBold]}>Friends and Family</Text> or
            participating {'\n'}in{' '}
            <Text style={[styles.txtBold]}>Loyalty Punch Cards</Text> at local
            businesses!
          </Text>
          <TouchableOpacity
            style={[styles.btnContainer]}
            onPress={() => {
              handleClose();
              InteractionManager.runAfterInteractions(() => {
                navigateToUniverseScreen('Home', {
                  select: 'LoyaltyPunchCards',
                });
              });
            }}>
            <Text style={[styles.txtBody, {fontFamily: Fonts.InterSemiBold}]}>
              Browse Punch Cards
            </Text>
          </TouchableOpacity>
          <View style={[styles.cardRow, {justifyContent: 'space-between'}]}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#25A5DD', '#94C63F']}
              style={styles.card}>
              <View style={styles.iconContainer}>
                <Image source={Icons.IcLoyaltyPoints} style={[styles.iconSm]} />
              </View>

              <Text style={[styles.txtLabel]}>Earned Loyalty points</Text>
              {timeLeft === '0d 0h 0m 0s' ? (
                <Text style={[styles.txtLabel]}>0 point</Text>
              ) : (
                <Text style={[styles.txtLabel]}>
                  {walletState.earned_points || 0} points
                </Text>
              )}

              {walletState.earned_points>0 && (
                <>
                  <Text style={[styles.txtBody]}>Expires In</Text>
                  <Text style={[styles.txtTimer]}>{timeLeft}</Text>
                </>
              )}
            </LinearGradient>

            <LinearGradient colors={['#25A5DD', '#94C63F']} style={styles.card}>
              <View style={styles.iconContainer}>
                <Image source={Icons.IcTourism} style={[styles.iconSm]} />
              </View>

              <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Text style={[styles.txtLabel]}>Travel & Tourism Badges</Text>

                <Text style={[styles.txtDanger]}>Coming Soon</Text>
              </View>
            </LinearGradient>
          </View>

          <View
            style={[
              styles.cardRow,
              {justifyContent: 'space-between', marginTop: normalize(12)},
            ]}>
            <LinearGradient colors={['#25A5DD', '#94C63F']} style={styles.card}>
              <View style={styles.iconContainer}>
                <Image source={Icons.IcBadge} style={[styles.iconSm]} />
              </View>

              <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Text style={[styles.txtLabel]}>Community{'\n'} Badge</Text>

                <Text style={[styles.txtDanger]}>Coming Soon</Text>
              </View>
            </LinearGradient>
            <LinearGradient
              colors={['#25A5DD', '#94C63F']}
              style={styles.card2}>
              <View style={styles.iconContainer}>
                <Image source={Icons.universe} style={[styles.iconSm]} />
              </View>

              <Text style={[styles.txtLabel]}>Gimmzi Badge</Text>

              <Text style={[styles.txtLabel]}>
                {userState?.userInfo?.user?.point} points
              </Text>

              <Text style={[styles.txtBody]}>Refills to 80 points on</Text>
              <Text style={[styles.txtTimer]}>1st {nextMonthName}</Text>
            </LinearGradient>
          </View>
        </View>
      </CustomModal>

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
    </Fragment>
  );
};

export default Header;

Header.propTypes = {
  onPressPoint: PropTypes.func,
  onPressWallet: PropTypes.func,
  onPressNotify: PropTypes.func,
};

const styles = StyleSheet.create({
  v1: {
    width: '90%',
    height: normalize(45),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Platform.OS == 'android' ? normalize(10) : normalize(4),
  },
  v2: {
    height: normalize(37),
    width: normalize(37),
    backgroundColor: Colors.picton_blue,
    borderRadius: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  img: {
    height: normalize(17),
    width: normalize(17),
    resizeMode: 'contain',
  },
  title: {
    fontFamily: Fonts.InterMedium,
    color: Colors.white,
    fontSize: normalize(15),
    marginLeft: normalize(8),
  },
  logo: {
    height: normalize(45),
    width: normalize(95),
    resizeMode: 'contain',
  },
  circle: {
    backgroundColor: Colors.brick_red,
    height: Platform.OS == 'android' ? normalize(11.5) : normalize(11),
    width: Platform.OS == 'android' ? normalize(11.5) : normalize(11),
    borderRadius: Platform.OS == 'android' ? normalize(11.5) : normalize(11),
    borderColor: Colors.white,
    borderWidth: normalize(1),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: normalize(3.8),
    right: normalize(4),
    padding:normalize(1)
  },
  count: {
    color: Colors.white,
    fontFamily: Fonts.InterRegular,
    fontSize: Platform.OS == 'ios' ? normalize(7) : normalize(6),
  },
  pointModalContainer: {
    flex: 1,
    margin: normalize(12),
    backgroundColor: Colors.white,
    padding: normalize(12),
    borderRadius: normalize(12),
  },
  cardRow: {
    flexDirection: 'row',
  },
  card: {
    padding: normalize(12),
    borderRadius: normalize(8),
    width: normalize(130),
    height: normalize(175),
  },
  card2: {
    paddingVertical: normalize(12),
    borderRadius: normalize(8),
    width: normalize(130),
    height: normalize(175),
  },
  iconSm: {
    width: normalize(24),
    height: normalize(24),
  },
  iconXs: {
    width: normalize(16),
    height: normalize(16),
  },
  iconContainer: {
    backgroundColor: Colors.white,
    alignSelf: 'center',
    padding: normalize(6),
    borderRadius: normalize(50),
  },
  txtLabel: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.white,
    textAlign: 'center',
    fontSize: normalize(11),
    paddingVertical: normalize(12),
  },
  txtTimer: {
    color: '#FECD3B',
    fontSize: normalize(11),
    fontFamily: Fonts.InterSemiBold,
    textAlign: 'center',
  },
  txtBody: {
    fontFamily: Fonts.InterRegular,
    color: Colors.white,
    textAlign: 'center',
  },
  txtDanger: {
    fontFamily: Fonts.InterRegular,
    color: '#808080',
    textAlign: 'center',
    fontSize: normalize(11),
    paddingBottom: normalize(12),
  },
  btnContainer: {
    backgroundColor: Colors.dark,
    alignSelf: 'center',
    margin: normalize(12),
    padding: normalize(8),
    borderRadius: normalize(50),
  },
  highlightedTxt: {
    color: Colors.green,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(12),
    fontWeight: '600',
  },
  splTxt: {fontFamily: Fonts.InterRegular, fontSize: normalize(12.5),color:'black'},
  txtBold: {fontWeight: '600',color:'black'},
  pointsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark,
    padding: normalize(8),
    borderRadius: normalize(50),
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: normalize(12),
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
