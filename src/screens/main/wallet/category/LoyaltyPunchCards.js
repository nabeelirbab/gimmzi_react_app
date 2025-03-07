import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Fonts} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';
import FilterOptions from '../components/FilterOptions';
import WalletViewItems from '../components/WalletViewItems';
import {useAppDispatch} from '../../../../redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getWalletList} from '../../../../utils/service/WalletService';
import _ from 'lodash';
import {
  moderateScale,
  verticalScale,
} from '../../../../utils/orientation/scaleDimensions';

const LoyaltyPunchCards = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const [count, setCount] = useState({
    active: 0,
    expired: 0,
    redeem: 0,
  });
  const [filterOption, setFilterOption] = useState(1);
console.log("data3333",data);

useEffect(() => {
  setFilterOption(1);
  getDetails(1);
},[]);

  const getDetails =async (type)=> {
    console.log('Loyalty Punch Filter: ', type);
    setIsLoading(true);

    let obj = {
      type: 'loyaltyRewards',
    };

    if (type == 1 || type == 2 || type == 3) {
      obj.filter_by =
        type == 1 ? 'is_active' : type == 2 ? 'is_expired' : 'is_redeemed';
    }

    const result = await dispatch(getWalletList(obj));
console.log(result,"resultresult");

    setIsLoading(false);
    // if (!result?.success) {
    //   showMessage(result.message);
    // }

    if (!_.isEmpty(result?.data?.totalWalletBusiness)) {
      let temp = [...result?.data?.totalWalletBusiness]
        .map((item, index) => ({
          ...item,
          type: item?.deal ? 'deal' : 'loyalty',
        }))
        .sort((a, b) => {
          if (
            (a?.loyalty?.redeem_details?.is_complete_redeemed === undefined ||
              a?.loyalty?.redeem_details?.is_complete_redeemed === null) &&
            a?.is_redeemed === 0
          ) {
            return -1;
          }
          if (
            (b?.loyalty?.redeem_details?.is_complete_redeemed === undefined ||
              b?.loyalty?.redeem_details?.is_complete_redeemed === null) &&
            b?.is_redeemed === 0
          ) {
            return 1;
          }

          if (a?.is_redeemed !== b?.is_redeemed) {
            return a?.is_redeemed === 0 ? -1 : 1;
          }

          const aIsCompleteRedeemed =
            a?.loyalty?.redeem_details?.is_complete_redeemed ?? 0;
          const bIsCompleteRedeemed =
            b?.loyalty?.redeem_details?.is_complete_redeemed ?? 0;

          return aIsCompleteRedeemed - bIsCompleteRedeemed;
        });

      setData(temp);

      setCount({
        active: result?.data?.total_active_count,
        redeem: result?.data?.total_redeemed_count,
        expired: result?.data?.total_expired_count,
      });
    } else {
      setData([]);
    }
  }

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderItem = 
    ({item, index}) => (
      <WalletViewItems
        item={item}
        key={index}
        isPuchCard={true}
        onUpdate={_item => {
          setData(prevArr =>
            prevArr?.map(item => {
              if (item.id === _item?.id) {
                return {...item, is_redeemed: 1};
              }
              return item;
            }),
          );
        }}
        onRefresh={() => {
          getDetails(filterOption);
        }}
      />
    )
  

  return (
    <View style={styles.container}>
      <FilterOptions
        options={[
          'All',
          `Active (${count.active})`,
          `Expired (${count.expired})`,
          `Redeemed (${count.redeem})`,
        ]}
        setSelect={select => {
          console.log("select",select);
          
          setFilterOption(select);
          getDetails(select);
        }}
        disabled={isLoading}
        focus={filterOption}
      />

      <FlatList
        style={{
          flex: 1,
        }}
        data={isLoading ? [] : data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: normalize(30),
          width: '90%',
          alignSelf: 'center',
        }}
        ListEmptyComponent={
          <Text style={styles.t1}>{isLoading ? '' : 'No data found'}</Text>
        }
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <>
            {isLoading && (
              <ActivityIndicator
                color={'grey'}
                style={{
                  marginVertical: verticalScale(10),
                }}
              />
            )}
          </>
        }
      />
    </View>
  );
};

export default LoyaltyPunchCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  t1: {
    alignSelf: 'center',
    fontFamily: Fonts.InterRegular,
    fontSize: moderateScale(16),
    color: Colors.santa_grey,
    marginTop: verticalScale(150),
  },
});
