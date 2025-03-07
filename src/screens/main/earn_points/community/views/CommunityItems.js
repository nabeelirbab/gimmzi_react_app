import {FlatList} from 'react-native';
import React, {useCallback} from 'react';
import {STORE_DATA} from '../../../../../utils/constants';
import normalize from '../../../../../utils/orientation/normalize';
import StoreDetailsItem from '../components/StoreDetailsItem';

const CommunityItems = () => {
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderItem = useCallback(
    ({item, index}) => <StoreDetailsItem item={item} />,
    [],
  );

  return (
    <FlatList
      data={STORE_DATA}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: normalize(15),
        paddingBottom: normalize(15),
      }}
    />
  );
};

export default CommunityItems;
