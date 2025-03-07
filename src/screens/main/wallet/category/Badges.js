import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback} from 'react';
import {
  Colors,
  Fonts,
  Icons,
  Images,
  hexToRGB,
} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';
import FilterOptions from '../components/FilterOptions';
import Button from '../../../../components/button/Button';

const Badges = () => {
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderItem = useCallback(
    ({item, index}) => (
      <View
        style={{
          backgroundColor: Colors.white,
          width: '100%',
          marginVertical: normalize(8),
          shadowColor: hexToRGB(Colors.black, 0.1),
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 1,
          shadowRadius: normalize(3),
          elevation: 8,
          borderRadius: normalize(8),
          paddingBottom: normalize(15),
        }}>
        <View
          style={{
            backgroundColor: Colors.dawn_pink,
            // height: normalize(160),
            borderTopLeftRadius: normalize(8),
            borderTopRightRadius: normalize(8),
            paddingBottom: normalize(15),
          }}>
            <Image
            source={Images.gimmziBadgeLogo}
            style={{
              resizeMode: 'contain',
              height: normalize(40),
              width: normalize(40),
              position: 'absolute',
              left: normalize(15),
              top: normalize(15),
            }}
          />
          <View>
          <Image
            source={Images.gimmziLogo}
            style={{
              resizeMode: 'contain',
              height: normalize(100),
              width: normalize(100),
              alignSelf: 'center',
            }}
          />
<Image
            source={Images.gimmziBadge}
            style={{
              resizeMode: 'contain',
              height: normalize(50),
              width: normalize(50),
              alignSelf: 'center',
              position:'absolute',
              bottom:normalize(-13)
            }}
          />
            
            </View>
          

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {[0, 1].map((item, index) => (
              <View
                key={index}
                style={{
                  marginHorizontal: normalize(15),
                  justifyContent: 'flex-end'
                }}>
                {/* <TouchableOpacity
                  style={{
                    padding: normalize(5),
                    position: 'absolute',
                    left: index == 0 ? normalize(-15) : undefined,
                    right: index == 1 ? normalize(-15) : undefined,
                    top: normalize(-35),
                  }}>
                  <Image
                    source={Icons.arrow_right2}
                    style={{
                      resizeMode: 'contain',
                      height: normalize(20),
                      width: normalize(20),
                      tintColor: Colors.dark,
                      transform: [{rotate: index == 1 ? '0deg' : '180deg'}],
                    }}
                  />
                </TouchableOpacity> */}

                {/* <Text
                  style={{
                    color: Colors.pickled_bluewood,
                    fontFamily: Fonts.InterRegular,
                    fontSize: normalize(11),
                    marginTop: normalize(10),
                  }}>
                  Next badge level
                </Text> */}
                <Text
                  style={{
                    color: Colors.green,
                    fontFamily: Fonts.InterSemiBold,
                    fontSize: normalize(14),
                    marginVertical: normalize(2),
                    textAlign: index == 0 ? 'left' : 'right',
                  }}>
                  {index == 0 ? '' : '80'}
                </Text>
                {index == 0 ?(
                  <Text
                    style={{
                      color: Colors.pickled_bluewood,
                      fontFamily: Fonts.InterRegular,
                      fontSize: normalize(11),
                    }}>
                    Refills every month
                  </Text>
                ):(
                  <Text
                    style={{
                      color: Colors.pickled_bluewood,
                      fontFamily: Fonts.InterRegular,
                      fontSize: normalize(11),
                    }}>
                    Points per month
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <Text
          style={{
            color: Colors.dark,
            fontFamily: Fonts.InterSemiBold,
            fontSize: normalize(15),
            textAlign: 'center',
            width: '90%',
            alignSelf: 'center',
            marginTop: normalize(15),
            lineHeight: normalize(22),
          }}>
   Your Gimmzi Badge
        </Text>

        <Text
          style={{
            color: Colors.river_bed,
            fontFamily: Fonts.InterRegular,
            fontSize: normalize(10),
            textAlign: 'center',
            width: '90%',
            alignSelf: 'center',
            marginTop: normalize(5),
            lineHeight: normalize(16),
            marginBottom: normalize(15),
          }}>
          As a Gimmzi Smart Rewards member, you have access to an exclusive Gimmzi badge. This badge unlocks our full database of deals offered by Gimmzi’s small business partners. Be sure to use all 80 points each month to enjoy the maximum benefits!
        </Text>

        {/* <Button title={'Check Badge Power'} /> */}
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <FilterOptions
        options={['All', 'Gimmzi Badges (1)', 'Community Badges (0)']}
        // setSelect={select => getDetails(select)}
        // disabled={isLoading}
      />

      <FlatList
        style={{
          flex: 1,
        }}
        data={[0]}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: normalize(30),
          width: '90%',
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default Badges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
