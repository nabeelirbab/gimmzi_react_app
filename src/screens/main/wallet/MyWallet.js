import {View, StyleSheet, StatusBar, Platform} from 'react-native';
import React, {useCallback} from 'react';
import TopTabNavigation from '../../../navigators/TopTabNavigation';
import {Colors, hexToRGB} from '../../../themes/Themes';
import MyStatusBar from '../../../components/custom/MyStatusBar';
import TopHeader from '../../../components/importent/TopHeader';
import {resetToNavigateMyHubScreen} from '../../../utils/helper/RootNaivgation';
import {useFocusEffect} from '@react-navigation/native';

const MyWallet = ({route}) => {
  const {select} = route?.params;
  console.log('My Wallet:', route?.params);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
    }, []),
  );

  return (
    <View style={styles.conatiner}>
      <MyStatusBar />
      <TopHeader
        title="My Wallet"
        justifyContent={'flex-start'}
        isGoBack={false}
        onPress={() => resetToNavigateMyHubScreen('MyHub')}
        borderColor={hexToRGB(Colors.iron, 0.3)}
      />
      <TopTabNavigation initialRoute={select} />
    </View>
  );
};

export default MyWallet;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
