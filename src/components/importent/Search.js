import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity as Button,
  Platform,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Colors, Fonts, Icons} from '../../themes/Themes';
import normalize from '../../utils/orientation/normalize';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {navigateToUniverseScreen} from '../../utils/helper/RootNaivgation';
import {useAppSelector} from '../../redux';

const Search = ({
  isSearchOptions = false,
  value = '',
  onChangeText = () => {},
  onPressLocation = () => {},
}) => {
  const userState = useAppSelector(state => state.user);

  const Options = [
    {title: userState?.address, icon: Icons.location},
    {title: 'Find on Gimmzi', icon: Icons.search},
  ];

  const [isSearch, setIsSearch] = useState(false);
  const searchRef = useRef(null);

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        height: normalize(40),
        width: '90%',
        borderRadius: normalize(6),
        alignSelf: 'center',
        marginTop: Platform.OS == 'android' ? normalize(12) : normalize(30),
      }}>
      {isSearch ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={Icons.search}
            style={{
              height: Platform.OS == 'android' ? normalize(16) : normalize(18),
              width: Platform.OS == 'android' ? normalize(16) : normalize(18),
              resizeMode: 'contain',
              marginLeft: normalize(12),
              marginRight: normalize(8),
              tintColor: Colors.santa_grey,
            }}
          />
          <TextInput
            placeholderTextColor={Colors.pickled_bluewood}
            placeholder="Search here.."
            ref={searchRef}
            value={value}
            onChangeText={v => onChangeText(v)}
            style={{
              flex: 1,
              height: '100%',
              color: Colors.dark,
              fontFamily: Fonts.InterRegular,
              fontSize: normalize(14),
            }}
          />
          <TouchableOpacity
            onPress={() => setIsSearch(false)}
            style={{
              width: normalize(40),
              height: normalize(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Icons.cancel}
              style={{
                height:
                  Platform.OS == 'android' ? normalize(16) : normalize(18),
                width: Platform.OS == 'android' ? normalize(16) : normalize(18),
                resizeMode: 'contain',
                marginLeft: normalize(12),
                marginRight: normalize(8),
                tintColor: Colors.santa_grey,
              }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: normalize(40),
            }}>
            {Options.map((item, index) => (
              <Button
                onPress={() => {
                  if (index == 1) {
                    if (isSearchOptions) {
                      setIsSearch(true);

                      setTimeout(() => {
                        if (searchRef.current) {
                          searchRef.current?.focus();
                        }
                      }, 500);
                    } else {
                      navigateToUniverseScreen('SearchResults');
                    }
                  } else {
                    onPressLocation();
                  }
                }}
                key={index}
                style={{
                  width: '49%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={item.icon}
                  style={{
                    height:
                      Platform.OS == 'android' ? normalize(16) : normalize(18),
                    width:
                      Platform.OS == 'android' ? normalize(16) : normalize(18),
                    resizeMode: 'contain',
                    marginLeft: normalize(12),
                    marginRight: normalize(8),
                    tintColor: Colors.santa_grey,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: Fonts.InterRegular,
                    color: Colors.pale_sky,
                    flex: 1,
                    fontSize:
                      Platform.OS == 'android' ? normalize(11) : normalize(13),
                  }}>
                  {item.title}
                </Text>
              </Button>
            ))}
          </View>
          <View
            style={{
              backgroundColor: Colors.dawn_pink,
              height: normalize(18),
              width: normalize(2),
              position: 'absolute',
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Search;
