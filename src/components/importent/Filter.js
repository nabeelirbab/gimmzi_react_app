import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts, Icons} from '../../themes/Themes';

const Filter = ({isVisible = false, onBackdropPress}) => {
  const FILTER_OPTIONS_1 = ['All', 'Apartment', 'COA/HOA', 'Other'];
  const FILTER_OPTIONS_2 = ['All', '1', '2', '3', '4+'];
  const [selectFilter, setSelectFilter] = useState({
    options1: -1,
    options2: -1,
    options3: -1,
  });

  function FilterOptions({data, onSelect, select}) {
    return (
      <View
        style={{
          width: '100%',
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: '5%',
          }}>
          {data.map((item, index) => (
            <TouchableOpacity
              onPress={() => onSelect(index)}
              key={index}
              style={[
                {
                  backgroundColor:
                    select == index ? Colors.ball_blue : undefined,
                  borderColor: select == index ? Colors.ball_blue : Colors.iron,
                },
                styles.filterContainer,
              ]}>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: select == index ? Colors.white : Colors.river_bed,
                  fontFamily: Fonts.InterMedium,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating={true}
      isVisible={isVisible}
      avoidKeyboard={true}
      style={{
        width: '100%',
        alignSelf: 'center',
        margin: 0,
      }}
      backdropOpacity={0.5}
      animationInTiming={600}
      animationOutTiming={800}
      onBackButtonPress={onBackdropPress}
      onBackdropPress={onBackdropPress}>
      <View style={styles.main}>
        <View style={styles.v1}>
          <View style={styles.line} />
          <View style={styles.h1}>
            <TouchableOpacity onPress={onBackdropPress} style={styles.t1}>
              <Image source={Icons.close} style={styles.close} />
            </TouchableOpacity>
            <Text style={styles.ht}>Filters</Text>
          </View>

          <Text style={styles.text}>Types</Text>

          <FilterOptions
            data={FILTER_OPTIONS_1}
            onSelect={idx =>
              setSelectFilter(pre => ({
                ...pre,
                options1: pre.options1 == idx ? -1 : idx,
              }))
            }
            select={selectFilter.options1}
          />

          <Text style={[styles.text, {marginTop: normalize(12)}]}>
            Bedrooms and Bathrooms
          </Text>

          <Text style={styles.text2}>Bedrooms</Text>

          <FilterOptions
            data={FILTER_OPTIONS_2}
            onSelect={idx =>
              setSelectFilter(pre => ({
                ...pre,
                options2: pre.options2 == idx ? -1 : idx,
              }))
            }
            select={selectFilter.options2}
          />

          <Text style={styles.text3}>Bathrooms</Text>

          <FilterOptions
            data={FILTER_OPTIONS_2}
            onSelect={idx =>
              setSelectFilter(pre => ({
                ...pre,
                options3: pre.options3 == idx ? -1 : idx,
              }))
            }
            select={selectFilter.options3}
          />
          <View
            style={{
              width: '100%',
              height: normalize(90),
              backgroundColor: Colors.white,
              position: 'absolute',
              bottom: 0,
              shadowColor: 'rgba(156, 156, 156, 0.6)',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 1,
              shadowRadius: 10,
              paddingHorizontal: normalize(15),
            }}>
            <View style={styles.v5}>
              {['Clear Filters', 'View 65 Results'].map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectFilter({
                        options1: -1,
                        options2: -1,
                        options3: -1,
                      });
                    }}
                    key={index}
                    style={[
                      {
                        backgroundColor:
                          index == 0 ? Colors.white : Colors.ball_blue,
                      },
                      styles.button,
                    ]}>
                    <Text
                      style={{
                        color: index !== 0 ? Colors.white : Colors.ball_blue,
                        fontFamily: Fonts.InterMedium,
                        fontSize: normalize(15),
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Filter;

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 'auto',
  },
  v1: {
    backgroundColor: Colors.white,
    height: normalize(450),
    width: '100%',
    borderTopLeftRadius: normalize(18),
    borderTopRightRadius: normalize(18),
  },
  line: {
    backgroundColor: Colors.dark,
    height: normalize(5),
    width: normalize(65),
    borderRadius: normalize(6),
    alignSelf: 'center',
    marginTop: normalize(10),
  },
  h1: {
    height: normalize(40),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.dawn_pink,
    borderBottomWidth: normalize(1),
    marginTop: normalize(5),
  },
  t1: {
    height: '100%',
    width: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    height: normalize(18),
    width: normalize(18),
    resizeMode: 'contain',
  },
  ht: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(14),
  },
  filterContainer: {
    borderWidth: normalize(1),
    height: normalize(29),
    paddingHorizontal: normalize(10),
    marginVertical: 5,
    borderRadius: normalize(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(10),
  },
  text: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(14),
    marginLeft: normalize(15),
    marginTop: normalize(20),
    marginBottom: normalize(8),
  },
  text2: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(11),
    marginLeft: normalize(15),
    marginVertical: normalize(2),
  },
  text3: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(11),
    marginLeft: normalize(15),
    marginBottom: normalize(2),
    marginTop: normalize(8),
  },
  v5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(12),
  },
  button: {
    height: normalize(36),
    borderRadius: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '48%',
  },
});
