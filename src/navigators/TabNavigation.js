import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  Keyboard,
  Platform,
} from 'react-native';
import TabBar from './tabview/ColorfulTabBar';
import {Icons} from '../themes/Themes';
import Home from '../screens/main/universe/Home';
import Categories from '../screens/main/categories/Categories';
import Favorites from '../screens/main/favourite/Favorites';
import MyHub from '../screens/main/my_hub/MyHub';
import CommunityDetails from '../screens/main/earn_points/community/CommunityDetails';
import EarnPoint from '../screens/main/earn_points/EarnPoint';
import Community from '../screens/main/earn_points/community/Community';
import ERNetworkDetails from '../screens/main/earn_points/ERNetworkDetails';
import TravelDetails from '../screens/main/earn_points/travel_tourism/TravelDetails';
import TravelCheckAvailability from '../screens/main/earn_points/travel_tourism/TravelCheckAvailability';
import AboutGimmzi from '../screens/main/my_hub/AboutGimmzi';
import Preferences from '../screens/main/my_hub/Preferences';
import RequestInfo from '../screens/main/earn_points/travel_tourism/RequestInfo';
import PropertyListing from '../screens/main/earn_points/travel_tourism/PropertyListing';
import normalize from '../utils/orientation/normalize';
import MyWallet from '../screens/main/wallet/MyWallet';
import SearchResults from '../screens/main/universe/SearchResults';
import MyInbox from '../screens/main/my_hub/MyInbox';
import ReferralProgram from '../screens/main/referral_program/ReferralProgram';
import PayoutProgress from '../screens/main/referral_program/PayoutProgress';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const UniverseStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="SearchResults" component={SearchResults} />
  </Stack.Navigator>
);

const CommunityStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ERNetworkDetails" component={ERNetworkDetails} />
    <Stack.Screen name="EarnPoint" component={EarnPoint} />
    <Stack.Screen name="Community" component={Community} />
    <Stack.Screen name="CommunityDetails" component={CommunityDetails} />
    <Stack.Screen name="TravelDetails" component={TravelDetails} />
    <Stack.Screen
      name="TravelCheckAvailability"
      component={TravelCheckAvailability}
    />
    <Stack.Screen name="RequestInfo" component={RequestInfo} />
    <Stack.Screen name="PropertyListing" component={PropertyListing} />
  </Stack.Navigator>
);

const CategoriesStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Categories" component={Categories} />
  </Stack.Navigator>
);

const FavouriteStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Favorites" component={Favorites} />
  </Stack.Navigator>
);

const MyHubStack = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="MyHub">
    <Stack.Screen name="MyHub" component={MyHub} />
    <Stack.Screen name="AboutGimmzi" component={AboutGimmzi} />
    <Stack.Screen name="Preferences" component={Preferences} />
    <Stack.Screen name="MyWallet" component={MyWallet} />
    <Stack.Screen name="MyInbox" component={MyInbox} />
    <Stack.Screen name="ReferralProgram" component={ReferralProgram} />
    <Stack.Screen name="PayoutProgress" component={PayoutProgress} />
  </Stack.Navigator>
);

export default function TabNavigation() {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or do something
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or do something
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="UniverseStack"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => (
        <TabBar
          height={95}
          display={
            Platform.OS == 'android' && isKeyboardVisible ? 'none' : 'flex'
          }
          {...props}
          openIcon={({color, size}) => (
            <Image
              source={Icons.universe}
              style={{
                height: size,
                width: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          )}
          closeIcon={({color, size}) => (
            <Image
              source={Icons.universe}
              style={{
                height: size,
                width: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          )}
        />
      )}>
      <Tab.Screen
        name="UniverseStack"
        component={UniverseStack}
        options={{
          title: 'Universe',
          icon: ({focused, color, size}) => (
            <Image
              source={Icons.universe}
              style={{
                height: size,
                width: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
          color: 'primary',
        }}
      />
      <Tab.Screen
        name="CategoriesStack"
        component={CategoriesStack}
        options={{
          title: 'Categories',
          icon: ({focused, color, size}) => (
            <Image
              source={Icons.categories}
              style={{
                height: size,
                width: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
          color: 'info',
        }}
      />
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          title: 'Earn Points',
          icon: ({focused, color, size}) => (
            <Image
              source={Icons.earn_points}
              style={{
                height: size,
                width: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
          color: 'warning',
        }}
      />
      <Tab.Screen
        name="FavouriteStack"
        component={FavouriteStack}
        options={{
          title: 'Favorites',
          icon: ({focused, color, size}) => (
            <Image
              source={focused ? Icons.heart4 : Icons.favourite}
              style={{
                height: focused ? normalize(15) : size,
                width: focused ? normalize(15) : size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
          color: 'danger',
        }}
      />
      <Tab.Screen
        name="MyHubStack"
        component={MyHubStack}
        options={{
          title: 'My Hub',
          icon: ({focused, color, size}) => (
            <Image
              source={Icons.my_hub}
              style={{
                height: size,
                width: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
          color: 'success',
        }}
      />
    </Tab.Navigator>
  );
}
