import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import TextInput from '../../../../components/input/TextInput';
import CustomBottomView from '../../../../components/custom/CustomBottomView';
import Button from '../../../../components/button/Button';
import {Colors, Fonts, Icons, hexToRGB} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';
import {goBack} from '../../../../utils/helper/RootNaivgation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyStatusBar from '../../../../components/custom/MyStatusBar';
import {useFocusEffect} from '@react-navigation/native';

const PropertyListingFilter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [goingTo, setGoingTo] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [isShow, setIsShow] = useState(false);

  const [options, setOptions] = useState([
    {
      title: 'Adults',
      subTitle: 'Ages 13 above',
      value: 2,
      maximum: 2,
    },
    {
      title: 'Children',
      subTitle: 'Ages 1-12',
      value: 1,
      maximum: 0,
    },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.white);
      }
    }, []),
  );

  return (
    <View style={styles.modalView}>
      <MyStatusBar />
      <View style={styles.modalHV}>
        <TouchableOpacity onPress={() => goBack()} style={styles.modalTouch}>
          <Image source={Icons.close} style={styles.closeImg} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Filters</Text>
      </View>

      <KeyboardAwareScrollView
        style={{
          flex: 1,
        }}>
        <TextInput
          value={goingTo}
          onChangeText={v => setGoingTo(v)}
          isShowTitle={false}
          placeholder={'Going to'}
          leftIcon={Icons.location_point}
          marginVertical={normalize(8)}
        />
        <TextInput
          value={propertyType}
          onChangeText={v => setPropertyType(v)}
          isShowTitle={false}
          placeholder={'All Property Types'}
          leftIcon={Icons.hospital}
        />

        <TouchableOpacity
          style={styles.touch2}
          onPress={() => setIsShow(!isShow)}>
          <Image source={Icons.groups} style={styles.groups} />
          <Text style={styles.t1}>
            {'Guests\n'}
            {
              <Text
                style={{
                  fontSize: normalize(10),
                }}>
                3 Guests{' '}
              </Text>
            }
          </Text>
          <Image
            source={Icons.right_arrow}
            style={[
              styles.arrowRight,
              {
                transform: [{rotate: isShow ? '270deg' : '90deg'}],
              },
            ]}
          />
        </TouchableOpacity>
        {isShow && (
          <View
            style={{
              backgroundColor: Colors.white,
              width: '90%',
              alignSelf: 'center',
              shadowColor: hexToRGB(
                Colors.black,
                Platform.OS == 'android' ? 0.5 : 0.1,
              ),
              shadowOffset: {
                width: 0,
                height: normalize(8),
              },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 8,
              borderRadius: normalize(10),
              paddingBottom: normalize(10),
            }}>
            {options.map((item, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  height: 65,
                  width: '90%',
                  marginVertical: 2,
                  paddingVertical: normalize(10),
                  justifyContent: 'space-between',
                  borderBottomColor: Colors.iron,
                  borderBottomWidth: normalize(0.5),
                  alignSelf: 'center',
                }}>
                <View>
                  <Text
                    style={{
                      color: Colors.pickled_bluewood,
                      fontFamily: Fonts.InterSemiBold,
                      fontSize: normalize(14),
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: Colors.river_bed,
                      fontFamily: Fonts.InterRegular,
                      fontSize: normalize(12),
                      marginTop: normalize(2),
                    }}>
                    {item.subTitle}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {['-', 'num', '+'].map((it, i) => {
                    if (i == 1) {
                      return (
                        <Text
                          style={{
                            color: Colors.pickled_bluewood,
                            fontFamily: Fonts.InterMedium,
                            fontSize: normalize(15),
                            width: normalize(30),
                            textAlign: 'center',
                          }}>
                          {item.value}
                        </Text>
                      );
                    }

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (i == 2) {
                            let temp = [...options].map((itm, idx) => ({
                              ...itm,
                              value: index == idx ? itm.value + 1 : itm.value,
                            }));
                            setOptions(temp);
                          } else if (i == 0) {
                            let temp = [...options].map((itm, idx) => ({
                              ...itm,
                              value:
                                index == idx && itm.value > itm.maximum
                                  ? itm.value - 1
                                  : itm.value,
                            }));
                            setOptions(temp);
                          }
                        }}
                        style={{
                          borderColor: Colors.santa_grey,
                          borderWidth: normalize(1),
                          height: normalize(25),
                          width: normalize(25),
                          borderRadius: normalize(25),
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={i == 0 ? Icons.minus : Icons.plus}
                          style={{
                            height: normalize(16),
                            width: normalize(16),
                            resizeMode: 'contain',
                            tintColor: Colors.santa_grey,
                          }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}
      </KeyboardAwareScrollView>

      <CustomBottomView
        isVisible={true}
        children={
          <View style={styles.bottomView}>
            <Button
              title={'Clear Filters'}
              width={'48%'}
              fontFamily={Fonts.InterMedium}
              fontSize={normalize(15)}
              backgroundColor={Colors.white}
              textColor={Colors.ball_blue}
              marginBottom={normalize(20)}
              borderColor={Colors.white}
            />
            <Button
              title={'Search'}
              width={'48%'}
              fontFamily={Fonts.InterMedium}
              fontSize={normalize(15)}
              marginBottom={normalize(20)}
            />
          </View>
        }
      />
    </View>
  );
};

export default PropertyListingFilter;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS == 'android' ? normalize(30) : normalize(45),
  },
  modalHV: {
    backgroundColor: Colors.white,
    borderBottomColor: Colors.dawn_pink,
    borderBottomWidth: normalize(1),
    height: normalize(45),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  modalTouch: {
    width: normalize(35),
    height: normalize(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: normalize(5),
  },
  closeImg: {
    resizeMode: 'contain',
    height: normalize(20),
    width: normalize(20),
  },
  modalTitle: {
    color: Colors.dark,
    fontSize: normalize(18),
    fontFamily: Fonts.InterSemiBold,
  },
  bottomView: {
    backgroundColor: Colors.white,
    height: '60%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(18),
  },
  touch2: {
    width: '90%',
    height: normalize(40),
    borderRadius: normalize(6),
    borderColor: Colors.iron,
    borderWidth: normalize(1),
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(8),
    paddingHorizontal: normalize(10),
    flexDirection: 'row',
  },
  groups: {
    width: normalize(17),
    height: normalize(17),
    resizeMode: 'contain',
    tintColor: Colors.dark,
    marginRight: normalize(10),
  },
  t1: {
    fontSize: normalize(12),
    color: Colors.pickled_bluewood,
    fontFamily: Fonts.InterMedium,
    lineHeight: normalize(15),
  },
  arrowRight: {
    width: normalize(13),
    height: normalize(13),
    resizeMode: 'contain',
    tintColor: Colors.ball_blue,
    position: 'absolute',
    right: normalize(10),
  },
});
