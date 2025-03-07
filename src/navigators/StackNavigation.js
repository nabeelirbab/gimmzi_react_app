import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screens/auth/Splash';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import Test from '../screens/Test';
import {navigationRef} from '../utils/helper/RootNaivgation';
import TabNavigation from './TabNavigation';
import SignIn2 from '../screens/auth/SignIn2';
import ForgotPassword from '../screens/auth/ForgotPassword';
import CustomBottomSheet from '../components/custom/CustomBottomSheet';
import MyAccount from '../screens/main/my_hub/MyAccount';
import RewardDetails from '../screens/main/universe/RewardDetails';
import PropertyListingFilter from '../screens/main/earn_points/travel_tourism/PropertyListingFilter';
import SmartFamilyFriends from '../screens/main/family_and_friends/SmartFamilyFriends';
import MyListFamilyFriends from '../screens/main/family_and_friends/MyListFamilyFriends';
import {useAppSelector} from '../redux';
import MyHub from '../screens/main/my_hub/MyHub';
import AboutGimmzi from '../screens/main/my_hub/AboutGimmzi';

const Stack = createStackNavigator();

export default function StackNavigation() {
  const authState = useAppSelector(state => state.auth);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white', // Colors.bright_cerulean
    },
  };

  const AuthScreens = {
    SignIn: SignIn,
    SignIn2: SignIn2,
    ForgotPassword: ForgotPassword,
    SignUp: SignUp,
    TabNavigation: TabNavigation,
    RewardDetails:RewardDetails,
    SmartFamilyFriends: SmartFamilyFriends,
    AboutGimmzi:AboutGimmzi
  };

  const MainScreen = {
    // Test: Test,
    TabNavigation: TabNavigation,
    MyAccount: MyAccount,
    ForgotPassword: ForgotPassword,
    RewardDetails: RewardDetails,
    PropertyListingFilter: PropertyListingFilter,
    SmartFamilyFriends: SmartFamilyFriends,
    MyListFamilyFriends: MyListFamilyFriends,
   
    
  };

  const Screens = !authState.isLoggedIn ? AuthScreens : MainScreen; // AuthReducer?.token == null

  if (authState.loading) {
    return <Splash />;
  } else {
    return (
      <NavigationContainer ref={navigationRef} theme={theme}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {Object.entries({
            ...Screens,
          }).map(([name, component], index) => {
            return (
              <Stack.Screen
                key={index}
                options={{gestureEnabled: false}}
                name={name}
                component={component}
              />
            );
          })}
        </Stack.Navigator>
        <CustomBottomSheet />
      </NavigationContainer>
    );
  }
}
