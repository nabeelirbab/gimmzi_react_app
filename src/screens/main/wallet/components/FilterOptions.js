import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Icons} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';

function FilterOptions({
  options,
  setSelect = () => {},
  disabled = false,
  focus = '',
}) {
  const [selectFilterIdx, setSelectFilterIdx] = useState(0);

  useEffect(() => {
    // console.log("focus",focus);
    
    if (focus) {
      setSelectFilterIdx(focus);
    }
  }, [focus]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: '5%',
        }}>
        {options.map((item, index) => (
          <TouchableOpacity
            disabled={disabled}
            onPress={() => {
              setSelectFilterIdx(selectFilterIdx == index ? -1 : index);
              setSelect(selectFilterIdx == index ? 0 : index);
            }}
            key={index}
            style={[
              {
                backgroundColor:
                  selectFilterIdx == index ? Colors.ball_blue : undefined,
                borderColor:
                  selectFilterIdx == index ? Colors.ball_blue : Colors.iron,
              },
              styles.filterContainer,
            ]}>
            <Text
              style={{
                fontSize: normalize(12),
                color:
                  selectFilterIdx == index ? Colors.white : Colors.river_bed,
                fontFamily: Fonts.InterMedium,
              }}>
              {item}
            </Text>
            {index == 0 && (
              <Image
                source={index == 0 ? Icons.filter : Icons.down_arrow}
                style={[
                  {
                    tintColor:
                      selectFilterIdx == index
                        ? Colors.white
                        : Colors.river_bed,
                    height: normalize(index == 0 ? 14 : 16),
                    width: normalize(index == 0 ? 14 : 16),
                  },
                  styles.filterImg,
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default FilterOptions;

const styles = StyleSheet.create({
  container: {
    height: normalize(45),
    width: '100%',
    marginTop: normalize(10),
  },
  filterContainer: {
    borderWidth: normalize(1),
    height: normalize(29),
    paddingHorizontal: normalize(10),
    marginVertical: 5,
    borderRadius: normalize(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(10),
  },
  filterImg: {
    resizeMode: 'contain',
    marginLeft: normalize(5),
  },
});
