import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import All from '../screens/main/wallet/category/All';
import Deals from '../screens/main/wallet/category/Deals';
import LoyaltyPunchCards from '../screens/main/wallet/category/LoyaltyPunchCards';
import Badges from '../screens/main/wallet/category/Badges';
import CustomTabBar from './CustomTabBar';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigation = ({initialRoute = 'All'}) => {
  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="All" component={All} />
      <Tab.Screen name="Deals" component={Deals} />
      <Tab.Screen name="LoyaltyPunchCards" component={LoyaltyPunchCards}/>
      <Tab.Screen name="Badges" component={Badges} />
    </Tab.Navigator>
  );
};

export default TopTabNavigation;
