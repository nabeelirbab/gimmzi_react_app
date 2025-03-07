import {
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import normalize from '../../../../../utils/orientation/normalize';
import {Colors, Fonts, Icons, Images} from '../../../../../themes/Themes';
import ImageSlider from '../../../../../components/importent/ImageSlider';
import {navigate} from '../../../../../utils/helper/RootNaivgation';

const StoreDetailsItem = ({item}) => {
  const tempImage = [...item.images].map((item, index) => ({
    id: index,
    image: item,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <ImageSlider data={tempImage} />

        <View style={styles.v1}>
          {[1, 2].map((item, index) => (
            <TouchableOpacity key={index} style={styles.touch}>
              <Image
                source={index == 0 ? Icons.share : Icons.heart}
                style={styles.optionsImg}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{padding: normalize(10)}}>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.subTitle}>{'Receive ' + item?.rewards}</Text>
        <Text style={styles.sub_title}>{item?.sub_title}</Text>
        <Text style={styles.location}>{item?.location}</Text>
        <View style={styles.v2}>
          <View style={styles.v3}>
            <Image source={Icons.bed} style={styles.bed} />
            <Text style={styles.bed_text}>{item?.bed}</Text>
          </View>
          <Image source={Images.brand_logo} style={styles.logo} />
        </View>
        <View style={styles.v5}>
          {['View Gimmzi Page', 'Call'].map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (index == 0) {
                    navigate('CommunityDetails');
                  }
                }}
                key={index}
                style={[
                  {
                    backgroundColor:
                      index == 0 ? Colors.white : Colors.ball_blue,
                    borderColor:
                      index == 0 ? Colors.dawn_pink : Colors.ball_blue,
                    width: index == 0 ? '58%' : '38%',
                  },
                  styles.button,
                ]}>
                {index == 1 && (
                  <Image source={Icons.call} style={styles.call} />
                )}
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
  );
};

export default StoreDetailsItem;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: Colors.white,
    shadowColor: Platform.OS == 'ios' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: normalize(2),
    elevation: normalize(2),
    marginBottom: normalize(16),
    alignSelf: 'center',
    borderRadius: normalize(8),
  },
  bg: {
    height: normalize(180),
    width: '100%',
    borderRadius: normalize(8),
    overflow: 'hidden',
  },
  discount: {
    height: normalize(23),
    paddingHorizontal: normalize(10),
    borderTopRightRadius: normalize(4),
    borderBottomRightRadius: normalize(4),
    position: 'absolute',
    top: normalize(8),
    justifyContent: 'center',
  },
  v1: {
    height: 35,
    position: 'absolute',
    top: normalize(8),
    right: 0,
    flexDirection: 'row',
  },
  touch: {
    height: normalize(26),
    width: normalize(26),
    backgroundColor: Colors.cyne_blue,
    borderRadius: normalize(30),
    marginRight: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsImg: {
    resizeMode: 'contain',
    height: normalize(15),
    width: normalize(15),
  },
  title: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(16),
  },
  subTitle: {
    color: Colors.green,
    fontFamily: Fonts.InterSemiBold,
    marginTop: normalize(4),
    fontSize: normalize(12),
  },
  sub_title: {
    color: Colors.dark,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
    marginTop: normalize(10),
  },
  location: {
    color: Colors.river_bed,
    fontFamily: Fonts.InterRegular,
    marginTop: normalize(4),
    fontSize: normalize(11),
  },
  v2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  v3: {
    height: normalize(25),
    paddingHorizontal: normalize(5),
    borderRadius: normalize(6),
    backgroundColor: Colors.catskill_white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bed: {
    height: normalize(15),
    width: normalize(15),
    resizeMode: 'contain',
  },
  bed_text: {
    fontFamily: Fonts.InterRegular,
    fontSize: normalize(10),
    color: Colors.dark,
    marginLeft: normalize(5),
  },
  logo: {
    resizeMode: 'contain',
    height: normalize(25),
    width: normalize(85),
  },
  v5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(16),
  },
  button: {
    height: normalize(36),
    borderRadius: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(1),
    flexDirection: 'row',
  },
  call: {
    width: normalize(14),
    height: normalize(14),
    resizeMode: 'contain',
    marginRight: normalize(10),
  },
});
