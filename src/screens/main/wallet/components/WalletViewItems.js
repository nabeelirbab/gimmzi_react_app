/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Colors,
  Fonts,
  Icons,
  Images,
  hexToRGB,
} from '../../../../themes/Themes';
import Button from '../../../../components/button/Button';
import normalize from '../../../../utils/orientation/normalize';
import CustomModal from '../../../../components/modal/CustomModal';
import CustomScrollView from '../../../../components/custom/CustomScrollView';
import TextInput from '../../../../components/input/TextInput';
import OTPInput from '../../../../components/input/OTPInput';
import Slider from '../../../../components/slider/Slider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../../utils/orientation/scaleDimensions';
import _ from 'lodash';
import Picker from '../../../../components/modal/Picker';
import {loyaltyInfo} from '../../../../utils/constants';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {
  getWalletCount,
  redeemProgram,
  removeWallet,
} from '../../../../utils/service/WalletService';
import {showMessage} from '../../../../utils/helper/Toast';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const WalletViewItems = ({item, onUpdate = () => {}, onRefresh = () => {}}) => {
  // console.log(`Loyalty Punch Card: ${item.id}`, item);
  const dispatch = useAppDispatch();
  const totalWalletPoints = useAppSelector(state => state.wallet.total_points);
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [isVisibleRedeem, setIsVisibleRedeem] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState({
    status: false,
    id: null,
    type: null,
  });
  const [isShowLocations, setShowLocations] = useState(false);
  const [purchaseArr, setPurchaseArr] = useState([]);

  const [reciept, setReciept] = useState({
    isVisible: false,
    id: '',
  });
  const [gimmziId, setGimmziId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationArr, setLocationArr] = useState('');
  const [location, setLocation] = useState({
    title: '',
    details: {},
  });
  const [minValue, setMinValue] = useState(0);
  const [num, setNum] = useState({
    point1: '',
    point2: '',
  });
  const [redeemAmt, setRedemAmt] = useState({
    point1: '',
    point2: '',
  });

  const discountType = item?.deal?.discount_type;
  const discountAmount = item?.deal?.discount_amount;
  const _event_deals = getEventDeals(discountType, discountAmount);
  const instructions = [
    'Confirm you are at a participating location below',
    'Show this screen to an associate at checkout',
    'businessName Associate will provide to you or enter their Gimmzi ID and submit below the checkout.',
  ];

  // console.log("item?.business?.business_name",item);

  const spendAmount = item?.loyalty?.spend_amount
    ? Number(item.loyalty.spend_amount.replace(/[^0-9.]/g, ''))
    : 0;

  // console.log("Cleaned Spend Amount:", spendAmount);

  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    setImageUri(
      item?.type === 'deal'
        ? item?.deal?.deal_image || item?.business?.logo_image
        : item?.loyalty?.loyalty_image || item?.business?.logo_image,
    );
  }, [item]);

  function getEventDeals(type, amount) {
    switch (type) {
      case 'discount':
        return `$${amount} Discount`;
      case 'percentage':
        return `${amount}% OFF`;
      case 'free':
        return 'Free';
      default:
        return '';
    }
  }

  function onPressDeal(_item) {
    // console.log('_item_item_item', _item);
    if (_item?.deal?.point > totalWalletPoints) {
      // console.log("totalWalletPoints",totalWalletPoints,_item.deal?.point);
      setShowAlert(true);
    } else {
      setIsVisibleRedeem(true);
      const locations =
        _item?.deal?.deal_location?.filter(loc => loc?.location) || [];
      setLocationArr(locations);
      setLocation({
        title: locations?.[0]?.location?.full_location || '',
        details: locations?.[0] || {},
      });
    }
  }

  function onPressLoyalty(_item) {
    setReciept({id: '', isVisible: false});
    const locations =
      _item?.loyalty?.loyaltylocations?.filter(loc => loc?.locations) || [];
    setLocationArr(locations);
    setLocation({
      title: locations?.[0]?.locations?.full_location || '',
      details: locations?.[0] || {},
    });
  }

  const ShowAllAddress = useCallback(
    ({type}) => {
      return (
        <Picker
          isVisible={isShowLocations}
          onBackdropPress={() => setShowLocations(false)}
          backdropOpacity={0.5}
          height={verticalScale(280)}
          isVisibleBar={true}
          children={
            <View style={{flex: 1}}>
              <Text style={styles.title11}>Select Location</Text>
              {!_.isEmpty(locationArr) &&
                locationArr?.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setLocation({
                        title:
                          type == 'deal'
                            ? item?.location?.full_location
                            : item?.locations?.full_location,
                        details: item,
                      });
                      setShowLocations(false);
                    }}
                    style={styles.v7}>
                    <Text key={index} style={styles.title10}>
                      {type == 'deal'
                        ? item?.location?.full_location
                        : item?.locations?.full_location}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          }
        />
      );
    },
    [isShowLocations, locationArr],
  );

  const submitGoal = useCallback(async () => {
    const obj = {
      type: item?.type === 'deal' ? 'gimmziDeals' : 'loyaltyRewards',
      ...(item?.type === 'deal'
        ? {deal_id: item?.deal_id}
        : {loyalty_id: item?.loyalty_id}),
      ...(location?.details && {location_id: location.details.location_id}),
    };

    if (item?.loyalty?.purchase_goal === 'deal_discount') {
      const amount =
        num.point2 < 10
          ? Number(`${num.point1}.0${num.point2}`) -
            Number(item?.loyalty?.redeem_details?.program_process || 0)
          : Number(`${num.point1}.${num.point2}`) -
            Number(item?.loyalty?.redeem_details?.program_process || 0);

      if (
        amount === '0.0' ||
        amount === '.' ||
        amount === 0 ||
        amount === 0.0
      ) {
        return showMessage('Please select spend goal amount');
      }
      obj.program_process = amount;
    } else if (item?.loyalty?.purchase_goal === 'free') {
      const selectedItemLength =
        purchaseArr?.filter(p => p?.isSelected)?.length -
        Number(item?.loyalty?.redeem_details?.program_process || 0);
      if (!selectedItemLength) {
        return showMessage('Please select purchase goal');
      }
      obj.program_process = selectedItemLength;
    }

    if (item?.type !== 'deal' && reciept?.id) {
      obj.receipt_no = reciept?.id;
      // return showMessage('Please add receipt id');
    }

    if (!gimmziId) {
      return showMessage('Please enter your gimmzi id');
    }

    obj.gimmzi_id = gimmziId;

    setIsLoading(true);

    const result = await dispatch(redeemProgram(obj));

    setIsLoading(false);
    showMessage(result.message);

    if (!result?.success) {
      return null;
    }

    if (item?.type == 'deal') {
      setIsVisibleRedeem(false);
      onUpdate(item);
    } else {
      setIsVisible2(false);
      setIsVisible1(false);
    }
    onRefresh();
    const countRes = await dispatch(getWalletCount());
  }, [item, location, gimmziId, purchaseArr, num, reciept]);

  const isRedeem = item?.is_redeemed === 1;
  const isComplete = item?.loyalty?.redeem_details?.is_complete_redeemed === 1;

  /* ------------------------ */
  let endDate =
    item?.type === 'deal' ? item?.deal?.end_Date : item?.loyalty?.end_on;

  const isExpired = endDate ? new Date(endDate) < new Date() : false;

  // next order logic

  const createdAt = item?.deal?.created_at;
  const isNextOrder =
    item?.loyalty_id === null &&
    item?.deal?.deal_loyalty?.when_order === 'next';

  let isDealActive = false;

  if (isNextOrder && createdAt) {
    const createdAtTimestamp = new Date(createdAt).getTime(); // Convert to timestamp

    // Check if createdAtTimestamp is valid (not NaN)
    if (!isNaN(createdAtTimestamp)) {
      const expiryTimestamp = createdAtTimestamp + 24 * 60 * 60 * 1000; // Add 24 hours
      isDealActive = Date.now() < expiryTimestamp;

      // console.log("createdAtTimestamp:", createdAtTimestamp, "expiryTimestamp:", expiryTimestamp);
    } else {
      console.error('Invalid createdAt format:', createdAt);
    }
  }

  const isDisabled =
    isDealActive ||
    isExpired ||
    (isRedeem && (item?.type === 'deal' || isComplete));

  const createdAtDate = new Date(createdAt);
  let expiryDateValue = '';

  if (!isNaN(createdAtDate)) {
    const expiryDate = new Date(createdAtDate); // Clone the date
    expiryDate.setDate(expiryDate.getDate() + 45); // Add 45 days
    expiryDateValue = expiryDate.toISOString();
    // console.log('Created Datexxx:', createdAtDate.toISOString()); // Original date
    // console.log('Created Dateqqq:', expiryDate.toISOString()); // 45 days later
  }
  // console.log('expiryDateValue', expiryDateValue);

  const btnColor = isDealActive
    ? 'grey'
    : isExpired
    ? hexToRGB(Colors.carmine_pink, 0.15)
    : isRedeem
    ? item?.type === 'deal' || isComplete
      ? Colors.green
      : hexToRGB(Colors.mango_tango, 0.15)
    : Colors.ball_blue;

  const titleColor = isExpired
    ? Colors.carmine_pink
    : isRedeem
    ? item?.type === 'deal' || isComplete
      ? Colors.white
      : Colors.mango_tango
    : Colors.white;

  const isRemoveWallet = async id => {
    console.log('0000008888', id);

    setIsLoading(true);
    console.log('00000');
    const obj = {
      wallet_id: id,
      type: item?.type === 'deal' ? 'gimmziDeals' : 'loyaltyRewards',
      ...(item?.type === 'deal'
        ? {deal_id: item?.deal_id}
        : {loyalty_id: item?.loyalty_id}),
    };
    console.log('objobjobjobj', obj, item?.loyalty_id);

    // const result = await dispatch(removeWallet({wallet_id: id}));
    const result = await dispatch(removeWallet(obj));

    setIsLoading(false);
    showMessage(result.message);

    if (!result?.success) {
      return null;
    }

    onRefresh();
    dispatch(getWalletCount());
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.itemVC}
        onLongPress={() => {
          if (!isRedeem) {
            setIsVisible3({
              type: item?.type,
              id: item?.id,
              status: true,
            });
          }
        }}>
        {imageUri ? (
          <FastImage
            source={{uri: imageUri, priority: FastImage.priority.low}}
            style={styles.img}
            fallback={true}
            defaultSource={{uri: item?.business?.logo_image}}
            resizeMode={FastImage.resizeMode.contain}
            onError={() => {
              setImageUri(item?.business?.logo_image);
            }}
          />
        ) : (
          <View style={styles.v6}>
            <Image
              source={{uri: item?.business?.logo_image}}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
        )}

        {item?.type === 'deal' && _event_deals && (
          <View style={styles.pointV}>
            <Text style={styles.point}>{_event_deals}</Text>
          </View>
        )}

        {item?.type !== 'deal' && item?.loyalty?.program_points && (
          <View style={styles.pointV}>
            <Text
              style={
                styles.point
              }>{`Earn up to ${item?.loyalty?.program_points} points`}</Text>
          </View>
        )}

        <View
          style={{
            width: '64%',
          }}>
          <Text numberOfLines={1} style={styles.title}>
            {item?.business?.business_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '80%',
              marginTop: normalize(2),
            }}>
            <Image source={Icons.location} style={styles.locationIcon} />
            <Text numberOfLines={1} style={styles.locationText}>
              {item?.business?.main_location?.full_location}
            </Text>
          </View>
          {/* {item?.is_redeemed ? (<View style={styles.loyaltyView}>
            <Text style={styles.loyaltyText}>Loyalty Reward</Text>
          </View>):null} */}
          {item?.type === 'deal' && (
            <Text numberOfLines={2} style={styles.subTitle}>
              {/* {`${item?.deal?.point || 0} points to redeem`} */}
              {item?.deal?.suggested_description}
            </Text>
          )}

          {item?.type !== 'deal' && (
            <Text numberOfLines={2} style={styles.subTitle}>
              {item?.loyalty?.program_name}
            </Text>
          )}

          {(item?.type === 'deal' && item?.deal) ||
          (item?.type !== 'deal' && item?.loyalty?.end_on) ? (
            <Text
              style={[
                styles.date,
                {
                  color:
                    item?.type !== 'deal'
                      ? Colors.mist_blue
                      : Colors.carmine_pink,
                },
              ]}>
              {item?.type === 'deal' && item?.deal
                ? `Expires: ${moment(expiryDateValue).format('YYYY-MM-DD')}`
                : item?.type !== 'deal' && item?.loyalty?.end_on
                ? `Program Ends on ${item?.loyalty?.end_on}`
                : ''}
            </Text>
          ) : null}

          <Button
            height={normalize(30)}
            marginTop={normalize(6)}
            title={
              isExpired
                ? 'Expired'
                : item?.type !== 'deal'
                ? `${
                    isRedeem
                      ? isComplete
                        ? 'Redeemed' // Success! Punched
                        : 'In Progress'
                      : 'Punch'
                  }`
                : `${isRedeem ? 'Redeemed' : 'Redeem'}` //Success! Redeemed
            }
            width={'100%'}
            // position={'absolute'}
            disabled={isDisabled}
            fontSize={normalize(15)}
            textColor={titleColor}
            backgroundColor={btnColor}
            borderColor={btnColor}
            bottom={0}
            onPress={() => {
              setGimmziId('');
              if (item?.type === 'deal') {
                onPressDeal(item);
              } else if (item?.loyalty?.purchase_goal === 'deal_discount') {
                let obj = item?.loyalty?.redeem_details;
                if (!_.isEmpty(obj)) {
                  const hasDot = obj?.program_process.includes('.');

                  if (hasDot) {
                    const parts = obj?.program_process?.split('.');
                    const firstPart = parseInt(parts[0], 10); // 43
                    const secondPart = parseInt(parts[1], 10); // 20

                    setNum({
                      point1: String(firstPart),
                      point2: String(secondPart),
                    });
                    setRedemAmt({
                      point1: String(firstPart),
                      point2: String(secondPart),
                    });
                  } else {
                    const parts = obj?.program_process?.split('.');
                    const firstPart = parseInt(parts[0], 10); // 43

                    setNum({
                      point1: String(firstPart),
                      point2: '0',
                    });
                    setRedemAmt({
                      point1: String(firstPart),
                      point2: '0',
                    });
                  }
                  setMinValue(Number(obj?.program_process || 0));

                  // setMinValue(parseInt(parts[0], 10));
                } else {
                  // Call an API for remaining purchase amount and set it to the slider,
                  // also, adjust the slider accordingly, add the remaining amount when submit the goal.
                }

                onPressLoyalty(item);
                setIsVisible2(true);
              } else if (item?.loyalty?.purchase_goal === 'free') {
                onPressLoyalty(item);
                setIsVisible1(true);

                if (item?.loyalty?.have_to_buy) {
                  setPurchaseArr(
                    Array.from(
                      {length: parseInt(item?.loyalty?.have_to_buy) + 1},
                      (_, i) => ({
                        count: i,
                        isSelected: Boolean(
                          i < item?.loyalty?.redeem_details?.program_process,
                        ),
                        isDisabled: Boolean(
                          i < item?.loyalty?.redeem_details?.program_process,
                        ),
                      }),
                    ),
                  );
                } else {
                  setPurchaseArr([]);
                }
              }
            }}
          />
          <TouchableOpacity
            style={[styles.touch]}
            onPress={() => setIsVisibleInfo(true)}>
            <Image source={Icons.info} style={styles.infoImg} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Information */}
      <CustomModal
        isVisible={isVisibleInfo}
        onBackdropPress={setIsVisibleInfo}
        children={
          <View style={styles.v1}>
            <Text
              numberOfLines={2}
              style={[
                styles.title1,
                {
                  width: '92%',
                },
              ]}>
              {/* OFF ALL PRODUCTS */}
              {item?.type === 'deal'
                ? item?.deal?.suggested_description
                : item?.loyalty?.program_name}
            </Text>
            {item?.type === 'deal' || item?.loyalty?.program_points ? (
              <Text style={styles.title2}>
                {item?.type === 'deal'
                  ? `${item?.deal?.point} points to redeem`
                  : item?.loyalty?.program_points
                  ? `Earn up to ${item?.loyalty?.program_points} loyalty points`
                  : ''}
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={() => setIsVisibleInfo(false)}
              style={styles.touch1}>
              <Image source={Icons.close} style={styles.close} />
            </TouchableOpacity>
            <Text style={styles.title3}>
              {`About this program`}
              {/* ${item?.type} */}
            </Text>
            <CustomScrollView
              style={styles.scroll}
              content={`No minimum purchase necessary. To redeem rewards, you must be registered and logged into your account. Cannot be combined with any other coupons. Discounts, promotions and/or offers. Cannot be applied on promotional priced product(s).\n\nPromotion codes and offers please note: Deals and programs are not retroactive and price adjustments will not be issued to orders placed either before or after the duration of any promotion. If you forgot to use your deal or program we are unable to adjust orders after they've been placed. Only one deal or program can be applied in one order. ${item?.business?.business_name} reserves the right to modify or cancel promotion deals at any time without notice.`}
              /*
               item?.type === 'deal'
                  ? item?.deal?.suggested_description
                  : item?.loyalty?.program_name
              */
            />

            {/* {item?.deal?.terms_conditions && ( */}
            <>
              <Text style={styles.title4}>Terms and conditions</Text>
              <CustomScrollView
                style={styles.scroll}
                content={`Gimmzi Smart Rewards Program\n\n1. Eligibility:\nParticipation in the Gimmzi Loyalty Rewards Program ("Program") is open to individuals who are 13 years of age or older. Businesses must meet the eligibility criteria specified by Gimmzi.\n\n2. Program Overview:\nThe Program allows members to earn and redeem points for rewards offered by participating businesses. Gimmzi reserves the right to modify or terminate the Program at any time.\n\n3. Earning Points:\nPoints are earned through qualifying purchases, referrals, or other activities as specified by Gimmzi or participating businesses. Points have no cash value and are non-transferable.\n\n4. Redeeming Rewards:\nMembers can redeem points for rewards offered by participating businesses. Gimmzi is not responsible for the quality, safety, legality, or any other aspect of the rewards provided by businesses.\n\n5. Account Termination:\nGimmzi reserves the right to terminate or suspend a member's account for any reason, including but not limited to violation of these terms, fraudulent activity, or misuse of the Program.\n\n6. Privacy:\nBy participating in the Program, members agree to the collection and use of personal information as outlined in Gimmzi's Privacy Policy.\n\n7. Changes to Terms:\nGimmzi reserves the right to modify these terms and conditions at any time. Changes will be communicated to members through the Gimmzi platform.\n\n8. Limitation of Liability:\nGimmzi and participating businesses are not liable for any direct, indirect, incidental, special, or consequential damages arising out of or related to the Program.\n\n9. Governing Law:\nThese terms and conditions are governed by and construed in accordance with the laws of the United States of America.\n\n10. Contact Information:\nFor questions or concerns regarding the Program, please contact legal@gimmzi.com.`}
                // item?.deal?.terms_conditions
              />
            </>
            {/* )} */}
          </View>
        }
      />

      {/* Redeem */}
      <CustomModal
        isVisible={isVisibleRedeem}
        disabled={isLoading}
        onBackdropPress={setIsVisibleRedeem}
        children={
          <>
            <View
              style={[
                styles.v1,
                {
                  alignItems: 'center',
                },
              ]}>
              <Image source={Images.logo2} style={styles.logo} />
              <Text style={styles.title1}>{item?.business?.business_name}</Text>
              <Text style={styles.title5}>
                {item?.deal?.suggested_description}
              </Text>

              {instructions.map((instruction, index) => {
                const dynamicText = instruction.replace(
                  'businessName',
                  item?.business?.business_name,
                );

                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      width: '90%',
                      marginTop: verticalScale(15),
                      marginBottom: index === 2 ? verticalScale(15) : 0,
                    }}>
                    <View style={styles.dot} />
                    <Text style={styles.title6}>{dynamicText}</Text>
                  </View>
                );
              })}

              <TextInput
                value={location.title}
                onChangeText={v => {}}
                editable={false}
                placeholder="Location"
                rightIcon={Icons.down_arrow}
                width={'100%'}
                isShowTitle={false}
                marginVertical={verticalScale(15)}
                borderColor={Colors.ball_blue}
                height={normalize(35)}
                fontSize={moderateScale(14)}
                onPress={() => setShowLocations(true)}
              />

              <OTPInput length={7} onChangeOTP={otp => setGimmziId(otp)} />

              <Button
                title={'Submit'}
                width={'100%'}
                loading={isLoading}
                disabled={isLoading}
                height={normalize(35)}
                fontFamily={Fonts.InterMedium}
                fontSize={horizontalScale(18)}
                marginTop={verticalScale(15)}
                onPress={() => submitGoal()}
              />
            </View>
            {/* Show All Locations Modal */}
            {<ShowAllAddress type={'deal'} />}
          </>
        }
      />

      {/* alert */}
      <CustomModal
        isVisible={showAlert}
        disabled={isLoading}
        onBackdropPress={setShowAlert}
        children={
          <>
            <View
              style={[
                styles.v1,
                {
                  alignItems: 'center',
                },
              ]}>
              <Image source={Images.logo2} style={styles.logo} />
              <Text style={styles.title1}>Insufficient Points to Redeem </Text>
              <Text style={[styles.title5, {paddingVertical: normalize(6)}]}>
                You don’t have enough points to add this deal to your wallet.
                Explore Loyalty Punch Cards to earn more points and unlock more
                rewards today!
              </Text>
            </View>
          </>
        }
      />

      {/* All --> Purchase Goal ( Gift ) */}
      <CustomModal
        isVisible={isVisible1}
        disabled={isLoading}
        onBackdropPress={setIsVisible1}
        children={
          <>
            <View style={[styles.v1, styles.scrollAble]}>
              <ScrollView
                style={{width: '100%'}}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View style={styles.scrollAbleInner}>
                  <Image source={Images.logo2} style={styles.logo2} />
                  <Text style={styles.title1}>
                    {item?.business?.business_name}
                  </Text>
                  <Text style={styles.title5}>
                    {item?.loyalty?.program_name}
                  </Text>

                  {/* {loyaltyInfo.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        width: '90%',
                        marginTop: verticalScale(12),
                        marginBottom: index == 2 ? verticalScale(15) : 0,
                      }}>
                      <View style={styles.dot} />
                      <Text style={styles.title6}>{item}</Text>
                    </View>
                  ))} */}

                  {loyaltyInfo.map((text, index) => {
                    const dynamicText = text.replace(
                      'businessName',
                      item?.business?.business_name || 'The business',
                    );

                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          marginTop: verticalScale(12),
                          marginBottom: index == 2 ? verticalScale(15) : 0,
                        }}>
                        <View style={styles.dot} />
                        <Text style={styles.title6}>{dynamicText}</Text>
                      </View>
                    );
                  })}

                  <View style={styles.v2}>
                    <Text style={styles.title7}>{`Remaining ${
                      item?.loyalty?.have_to_buy -
                      (item?.loyalty?.redeem_details?.program_process || 0)
                    } out of ${item?.loyalty?.have_to_buy}`}</Text>
                    <View
                      style={[
                        styles.v3,
                        {
                          justifyContent:
                            parseInt(item?.loyalty?.have_to_buy) + 1 < 6
                              ? 'flex-start'
                              : 'space-between',
                        },
                      ]}>
                      {purchaseArr?.map((_item, index) => {
                        let isFree =
                          index + 1 == parseInt(item?.loyalty?.have_to_buy) + 1;

                        let isCompleted = 0;

                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setPurchaseArr(prevArr =>
                                prevArr?.map(item => {
                                  if (item.count === _item?.count) {
                                    return {
                                      ...item,
                                      isSelected: !item?.isSelected,
                                    };
                                  }
                                  return item;
                                }),
                              );
                            }}
                            key={index}
                            style={[
                              {
                                backgroundColor: isFree
                                  ? Colors.ball_blue
                                  : _item?.isSelected
                                  ? _item?.isDisabled
                                    ? hexToRGB(Colors.tropical_blue, 0)
                                    : hexToRGB(Colors.tropical_blue, 0.3)
                                  : Colors.white,
                                width: isFree
                                  ? horizontalScale(70)
                                  : horizontalScale(33),
                                borderWidth: !isFree ? moderateScale(1) : 0,
                                borderColor: _item?.isSelected
                                  ? Colors.tropical_blue
                                  : Colors.dawn_pink,
                              },
                              styles.v4,
                            ]}
                            disabled={_item?.isDisabled || isFree}>
                            <Image
                              source={
                                isFree
                                  ? Icons.gift_card
                                  : _item?.isSelected
                                  ? Icons.gift_active
                                  : Icons.gift_deactive
                              }
                              style={styles.img1}
                            />
                            {index < isCompleted && (
                              <Image source={Icons.tick1} style={styles.img2} />
                            )}
                            {isFree && (
                              <Text style={styles.title8}>
                                {item?.loyalty?.off_percentage
                                  ? item?.loyalty?.off_percentage
                                  : 'FREE'}
                              </Text>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {reciept.isVisible ? (
                    <TextInput
                      width={'98%'}
                      isShowTitle={false}
                      height={normalize(35)}
                      placeholder="Add Reciept #"
                      fontSize={moderateScale(12)}
                      value={reciept.id}
                      onChangeText={v =>
                        setReciept(pre => ({
                          ...pre,
                          id: v,
                        }))
                      }
                    />
                  ) : (
                    <Button
                      title={'Add Reciept #'}
                      width={'45%'}
                      height={normalize(35)}
                      fontFamily={Fonts.InterMedium}
                      onPress={() =>
                        setReciept({
                          isVisible: true,
                          id: '',
                        })
                      }
                      borderColor={Colors.dawn_pink}
                      backgroundColor={Colors.white}
                      textColor={Colors.ball_blue}
                      fontSize={horizontalScale(16)}
                    />
                  )}

                  <TextInput
                    value={location.title}
                    onChangeText={v => {}}
                    editable={false}
                    placeholder="Location"
                    rightIcon={Icons.down_arrow}
                    width={'98%'}
                    isShowTitle={false}
                    marginVertical={verticalScale(18)}
                    borderColor={Colors.ball_blue}
                    height={normalize(35)}
                    fontSize={moderateScale(14)}
                    onPress={() => setShowLocations(true)}
                  />

                  <OTPInput
                    length={7}
                    onChangeOTP={otp => setGimmziId(otp)}
                    width="98%"
                  />

                  <Button
                    title={'Submit'}
                    width={'98%'}
                    disabled={isLoading}
                    loading={isLoading}
                    height={normalize(35)}
                    fontFamily={Fonts.InterMedium}
                    marginTop={moderateScale(15)}
                    onPress={() => submitGoal()}
                    fontSize={moderateScale(18)}
                  />
                </View>
              </ScrollView>
            </View>
            {/* Show All Locations Modal */}
            {<ShowAllAddress type={'loyalty'} />}
          </>
        }
      />

      {/* All --> Spend Goal */}
      <CustomModal
        isVisible={isVisible2}
        disabled={isLoading}
        onBackdropPress={setIsVisible2}
        children={
          <>
            <View style={[styles.v1, styles.v5, styles.scrollAble]}>
              <ScrollView
                style={{width: '100%'}}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View style={styles.scrollAbleInner}>
                  {/* <View style={[styles.v1, styles.v5]}> */}
                  <Image source={Images.logo2} style={styles.logo2} />
                  <Text style={styles.title1}>
                    {item?.business?.business_name}
                  </Text>
                  <Text style={styles.title5}>
                    {item?.loyalty?.program_name}
                  </Text>

                  {/* {loyaltyInfo.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        width: '90%',
                        marginTop: verticalScale(12),
                        marginBottom: index == 2 ? verticalScale(15) : 0,
                      }}>
                      <View style={styles.dot} />
                      <Text style={styles.title6}>{item}</Text>
                    </View>
                  ))} */}
                  {loyaltyInfo.map((text, index) => {
                    const dynamicText = text.replace(
                      'businessName',
                      item?.business?.business_name || 'The business',
                    );

                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          marginTop: verticalScale(12),
                          marginBottom: index == 2 ? verticalScale(15) : 0,
                        }}>
                        <View style={styles.dot} />
                        <Text style={styles.title6}>{dynamicText}</Text>
                      </View>
                    );
                  })}

                  {item?.loyalty?.spend_amount ? (
                    <Slider
                      width={normalize(250)}
                      maxValue={parseInt(spendAmount)}
                      value={
                        num.point1 !== '' || num.point2 !== ''
                          ? Math.min(
                              Number(`${num.point1}.${num.point2}`),
                              parseInt(spendAmount),
                            )
                          : 0
                      }
                      minValue={0} // minValue
                      setValue={number => {
                        try {
                          // Split the number
                          const whole = Math.floor(number);
                          const decimal = Math.round((number - whole) * 100);

                          setNum({
                            point1: String(whole),
                            point2: String(decimal),
                          });
                        } catch (error) {
                          console.log('error  - - ', error);
                        }
                      }}
                    />
                  ) : null}

                  <Text style={styles.title9}>Dollar</Text>

                  <View style={styles.v6}>
                    <TextInput
                      defaultValue={num.point1}
                      onChangeText={v => {
                        setNum(s => ({
                          ...s,
                          point1: Number(redeemAmt.point1) + Number(v),
                        }));
                      }}
                      placeholder="0000"
                      width={'30%'}
                      isShowTitle={false}
                      borderColor={Colors.iron}
                      backgroundColor={Colors.smoke}
                      height={normalize(35)}
                      textAlign={'center'}
                      placeholderColor={Colors.iron}
                      keyboardType="numeric"
                      maxLength={4}
                    />
                    <View style={styles.dot2} />
                    <TextInput
                      value={num.point2}
                      onChangeText={v => {
                        setNum(s => ({
                          ...s,
                          point2: Number(redeemAmt.point2) + Number(v),
                        }));
                      }}
                      placeholder="00"
                      titleFontFamily={Fonts.InterMedium}
                      onPressRight={() => {}}
                      width={'30%'}
                      isShowTitle={false}
                      borderColor={Colors.iron}
                      backgroundColor={Colors.smoke}
                      height={normalize(35)}
                      placeholderColor={Colors.iron}
                      textAlign={'center'}
                      fontSize={moderateScale(15)}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>

                  {reciept.isVisible ? (
                    <TextInput
                      width={'98%'}
                      isShowTitle={false}
                      height={normalize(35)}
                      placeholder="Add Reciept #"
                      fontSize={moderateScale(12)}
                      value={reciept.id}
                      onChangeText={v =>
                        setReciept(pre => ({
                          ...pre,
                          id: v,
                        }))
                      }
                    />
                  ) : (
                    <Button
                      title={'Add Reciept #'}
                      width={'45%'}
                      height={normalize(35)}
                      fontFamily={Fonts.InterMedium}
                      onPress={() =>
                        setReciept({
                          isVisible: true,
                          id: '',
                        })
                      }
                      borderColor={Colors.dawn_pink}
                      backgroundColor={Colors.white}
                      textColor={Colors.ball_blue}
                      fontSize={horizontalScale(16)}
                    />
                  )}

                  <TextInput
                    value={location.title}
                    onChangeText={v => {}}
                    editable={false}
                    placeholder="Location"
                    rightIcon={Icons.down_arrow}
                    width={'98%'}
                    isShowTitle={false}
                    marginVertical={verticalScale(18)}
                    borderColor={Colors.ball_blue}
                    height={normalize(35)}
                    fontSize={moderateScale(14)}
                    onPress={() => setShowLocations(true)}
                  />

                  <OTPInput
                    length={7}
                    onChangeOTP={otp => setGimmziId(otp)}
                    width="98%"
                  />

                  <Button
                    title={'Submit'}
                    width={'98%'}
                    disabled={isLoading}
                    loading={isLoading}
                    height={normalize(35)}
                    fontFamily={Fonts.InterMedium}
                    marginTop={moderateScale(15)}
                    onPress={() => submitGoal()}
                    fontSize={horizontalScale(18)}
                  />
                  {/* </View> */}
                </View>
              </ScrollView>
            </View>

            {/* Show All Locations Modal */}
            {<ShowAllAddress type={'loyalty'} />}
          </>
        }
      />

      {/* Remove Warning */}
      <CustomModal
        isVisible={isVisible3.status}
        onBackdropPress={() => setIsVisible3(pre => ({...pre, status: false}))}
        children={
          <View style={styles.v8}>
            <Text style={styles.title12}>Remove from Wallet?</Text>
            <Text style={styles.title13}>
              {`Do you want to remove this ${
                isVisible3?.type == 'deal' ? 'deal' : 'loyalty punch card'
              }?`}
            </Text>
            <View style={styles.v9}>
              <Button
                title={'Cancel'}
                width={'47.5%'}
                borderColor={Colors.dawn_pink}
                backgroundColor={Colors.white}
                textColor={Colors.ball_blue}
                fontFamily={Fonts.InterMedium}
                height={normalize(38)}
                onPress={() => setIsVisible3(pre => ({...pre, status: false}))}
              />
              <Button
                title={'Yes, Remove'}
                width={'47.5%'}
                backgroundColor={Colors.carmine_pink}
                fontFamily={Fonts.InterMedium}
                height={normalize(38)}
                borderColor={Colors.carmine_pink}
                onPress={() => {
                  setIsVisible3(pre => ({...pre, status: false}));

                  setTimeout(() => {
                    isRemoveWallet(isVisible3?.id);
                  }, 800);
                }}
              />
            </View>
          </View>
        }
      />
    </>
  );
};

export default WalletViewItems;

const styles = StyleSheet.create({
  itemVC: {
    width: '100%',
    marginBottom: normalize(10),
    borderColor: Colors.catskill_white,
    borderWidth: normalize(1),
    borderRadius: normalize(8),
    // height: normalize(115),
    padding: normalize(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    resizeMode: 'cover',
    height: normalize(90),
    width: normalize(90),
    borderRadius: normalize(6),
  },
  pointV: {
    backgroundColor: Colors.green,
    height: normalize(20),
    paddingHorizontal: normalize(6),
    position: 'absolute',
    top: normalize(8),
    justifyContent: 'center',
    borderTopRightRadius: normalize(6),
    borderBottomRightRadius: normalize(6),
  },
  point: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(9),
    color: Colors.white,
  },
  title: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(13),
    color: Colors.dark,
    width: '80%',
  },
  subTitle: {
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(10),
    color: Colors.ball_blue,
    marginTop: Platform.OS == 'android' ? normalize(1) : normalize(3),
    width: '85%',
  },
  date: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(11),
    marginTop: normalize(6),
    // marginBottom: normalize(5),
    // position: 'absolute',
    // bottom: verticalScale(35),
  },
  touch: {
    backgroundColor: Colors.catskill_white,
    height: normalize(25),
    width: normalize(25),
    borderRadius: normalize(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  infoImg: {
    resizeMode: 'contain',
    height: normalize(12),
    width: normalize(12),
  },
  close: {
    height: normalize(14),
    width: normalize(14),
    resizeMode: 'contain',
  },
  scroll: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(5),
  },
  v1: {
    backgroundColor: Colors.white,
    width: '85%',
    alignSelf: 'center',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
  },
  scrollAble: {
    alignItems: 'center',
    padding: moderateScale(12),
    maxHeight: Dimensions.get('window').height - normalize(180),
  },
  scrollAbleInner: {width: '100%', alignItems: 'center'},
  title1: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: horizontalScale(18),
  },
  title2: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    fontSize: horizontalScale(13),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(5),
  },
  touch1: {
    backgroundColor: Colors.catskill_white,
    height: horizontalScale(25),
    width: horizontalScale(25),
    borderRadius: horizontalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: moderateScale(12),
    right: moderateScale(12),
  },
  title3: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: horizontalScale(16),
    marginTop: verticalScale(10),
  },
  title4: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: horizontalScale(16),
    marginTop: verticalScale(10),
  },
  logo: {
    height: verticalScale(40),
    width: horizontalScale(115),
    resizeMode: 'contain',
    marginBottom: verticalScale(8),
  },
  title5: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterSemiBold,
    fontSize: moderateScale(13),
    marginTop: verticalScale(6),
    textAlign: 'center',
    width: '80%',
  },
  dot: {
    backgroundColor: Colors.river_bed,
    height: verticalScale(3),
    width: horizontalScale(3),
    borderRadius: moderateScale(3),
    marginTop: verticalScale(6),
    marginRight: horizontalScale(6),
  },
  title6: {
    fontSize: moderateScale(12),
    flex: 1,
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
  },
  logo2: {
    height: verticalScale(35),
    width: horizontalScale(100),
    resizeMode: 'contain',
    marginBottom: verticalScale(5),
  },
  v2: {
    backgroundColor: 'white',
    width: '98%',
    shadowColor: hexToRGB(Colors.black, 0.2),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(10),
    elevation: 8,
    borderRadius: moderateScale(6),
    paddingBottom: verticalScale(6),
    paddingHorizontal: verticalScale(8),
    marginBottom: verticalScale(18),
  },
  title7: {
    fontFamily: Fonts.InterMedium,
    color: Colors.dark,
    fontSize: moderateScale(12),
    alignSelf: 'center',
    marginVertical: verticalScale(8),
  },
  v3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  v4: {
    height: moderateScale(32),
    marginTop: verticalScale(10),
    borderRadius: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: horizontalScale(3),
  },
  img1: {
    resizeMode: 'contain',
    height: moderateScale(14),
    width: moderateScale(14),
  },
  img2: {
    resizeMode: 'contain',
    height: moderateScale(10),
    width: moderateScale(10),
    position: 'absolute',
    right: normalize(2),
    top: normalize(3),
  },
  title8: {
    color: Colors.white,
    fontFamily: Fonts.InterMedium,
    fontSize: Platform.OS == 'android' ? moderateScale(10) : moderateScale(12),
    marginLeft: horizontalScale(3),
    textTransform: 'uppercase',
  },
  v5: {
    alignItems: 'center',
    padding: moderateScale(12),
    borderColor: Colors.ball_blue,
    borderWidth: moderateScale(1.5),
  },
  title9: {
    fontFamily: Fonts.InterMedium,
    color: Colors.dark,
    fontSize: moderateScale(13),
  },
  v6: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: verticalScale(8),
  },
  dot2: {
    marginHorizontal: normalize(8),
    height: normalize(3),
    width: normalize(3),
    borderRadius: normalize(3),
    backgroundColor: Colors.pickled_bluewood,
    marginBottom: normalize(6),
  },
  v7: {
    paddingVertical: verticalScale(10),
    borderBottomColor: Colors.santa_grey,
    borderBottomWidth: moderateScale(1),
    width: '95%',
    alignSelf: 'center',
  },
  title10: {
    alignSelf: 'center',
    width: '90%',
    fontFamily: Fonts.InterRegular,
    fontSize: moderateScale(16),
    color: Colors.elephant,
  },
  title11: {
    margin: verticalScale(18),
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: moderateScale(16),
  },
  v8: {
    width: '90%',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    borderRadius: normalize(10),
    alignItems: 'center',
    padding: normalize(15),
  },
  title12: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
    marginBottom: normalize(5),
  },
  title13: {
    color: Colors.mist_blue,
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(14),
    marginTop: normalize(5),
    textAlign: 'center',
  },
  v9: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: normalize(20),
    paddingTop: normalize(15),
    borderTopColor: Colors.dawn_pink,
    borderTopWidth: normalize(1),
  },
  locationIcon: {
    height: normalize(10),
    width: normalize(10),
    resizeMode: 'contain',
    marginRight: normalize(2),
  },
  locationText: {
    color: 'grey',
    fontSize: normalize(9),
    fontFamily: Fonts.InterRegular,
  },
  loyaltyText: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(10),
    color: 'green',
  },
  loyaltyView: {
    backgroundColor: 'yellow',
    width: normalize(85),
    paddingVertical: Platform.OS === 'ios' ? normalize(2) : normalize(1),
    alignItems: 'center',
    marginTop: normalize(3),
  },
});
