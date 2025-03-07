import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useRef, useState} from 'react';
import GridImageViewer from '../../../../components/imageViewer/GridImageViewer';
import {
  ASDATA,
  REVIEW_FOR_LOCATION,
  TravelAndTourismImages,
} from '../../../../utils/constants';
import normalize from '../../../../utils/orientation/normalize';
import {
  Colors,
  Fonts,
  Icons,
  Images,
  hexToRGB,
} from '../../../../themes/Themes';
import {goBack, navigate} from '../../../../utils/helper/RootNaivgation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Picker from '../../../../components/modal/Picker';
import MapFullViews from '../../../../components/mapview/MapFullViews';
import _ from 'lodash';

const {height} = Dimensions.get('window');

const TravelDetails = () => {
  const mapRef = useRef();
  const [isMaximize, setIsMaximize] = useState(false);

  const location = {
    latitude: 22.575247051153607,
    longitude: 88.42743006257447,
    latitudeDelta: 0.001,
    longitudeDelta: 0.002,
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{flex: 1}}
        contentContainerStyle={{
          paddingBottom: normalize(10),
        }}>
        <GridImageViewer
          images={TravelAndTourismImages}
          marginTop={0}
          height={normalize(280)}
          width={'100%'}
          borderRadius={0}
          mWidth="88%"
          mBackgroundColor="rgba(0,0,0,0.40)"
          mBottom={normalize(18)}
        />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()} style={styles.touch}>
            <Image source={Icons.arrow_left2} style={styles.img} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            {[0, 1].map((item, i) => (
              <TouchableOpacity
                style={[
                  styles.touch,
                  {
                    marginLeft: i == 1 ? normalize(12) : 0,
                  },
                ]}>
                <Image
                  source={i == 0 ? Icons.share3 : Icons.heart1}
                  style={styles.img}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.v1}>
          <Text style={styles.title}>
            200 steps to beach, Clean quiet residential get away! Near Barefoot
            Landing!
          </Text>

          <View style={styles.v2}>
            <Image source={Icons.location} style={styles.img1} />
            <Text style={styles.title1}>
              {'Beaumount, California '}
              {<View style={styles.dot} />}
              {' Condo'}
            </Text>
          </View>

          <View style={styles.v3}>
            {['1 Bed', '1 Bath', 'Sleeps 4'].map((item, i) => (
              <View style={styles.v4}>
                <Image
                  source={
                    i == 0 ? Icons.bed : i == 1 ? Icons.shower : Icons.groups
                  }
                  style={styles.img}
                />
                <Text style={styles.title2}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.title3}>View Property Website</Text>
        </View>

        <View style={styles.main}>
          <Text style={styles.title4}>About This Property</Text>
          <Text style={styles.title5}>
            {
              "If you find a better price somewhere else, let us know. We'll cover the difference, worry free. See full details at gr.pn/bpg Please place au linen in the front room by exit door. "
            }
            {<Text style={styles.title6}>{'Read More'}</Text>}
          </Text>

          {ASDATA.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  paddingVertical: normalize(20),
                  borderBottomColor: Colors.iron,
                  borderBottomWidth: index == 0 ? normalize(1) : 0,
                }}>
                <Text style={styles.title7}>{item.title}</Text>

                {item.data.map((itm, idx) => (
                  <View key={index} style={styles.v5}>
                    <Text style={styles.type}>{itm.type}</Text>
                    <Text style={styles.title6}>{itm.value}</Text>
                  </View>
                ))}
              </View>
            );
          })}

          <Text style={styles.title7}>Location</Text>

          <View style={styles.v6}>
            <Text numberOfLines={1} style={styles.location}>
              Beaumount, California
            </Text>
            <TouchableOpacity
              onPress={() => setIsMaximize(true)}
              style={styles.touch1}>
              <Image source={Icons.map} style={styles.img} />
              <Text style={styles.map}>View in Map</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: normalize(100),
              width: '100%',
              borderRadius: normalize(8),
              overflow: 'hidden',
              marginBottom: normalize(15),
            }}>
            <MapView
              ref={mapRef}
              style={{...StyleSheet.absoluteFill}}
              followsUserLocation={true}
              initialRegion={location}
              region={location}
              showsCompass={false}
              scrollEnabled={false}
              zoomEnabled={true}
              pitchEnabled={true}
              showsBuildings={true}
              mapType={'standard'}
              rotateEnabled={true}
              showsIndoors={true}
              provider={PROVIDER_GOOGLE}>
              <Marker coordinate={location} anchor={{x: 0.5, y: 0.5}}>
                <Image
                  source={Icons.location1}
                  style={{
                    height: normalize(45),
                    width: normalize(45),
                  }}
                />
              </Marker>
            </MapView>
          </View>

          {REVIEW_FOR_LOCATION.map((item, index) => (
            <View key={index} style={styles.v7}>
              <Text style={styles.title8}>{item.title}</Text>
              <Text style={styles.title9}>{item.description}</Text>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => navigate('RequestInfo')}
            style={styles.button}>
            <Text style={styles.buttonTitle}>Request Info on Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigate('TravelCheckAvailability')}
            style={styles.v8}>
            <Text style={styles.title10}>Host</Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image source={Images.logo1} style={styles.logo1} />
              <View
                style={{
                  width: '70%',
                }}>
                <Text style={styles.title11}>Ocean Breeze Beach Vacations</Text>
                <Text style={styles.title12}>
                  More properties from Host (5)
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.v9}>
        <View
          style={{
            justifyContent: 'space-evenly',
          }}>
          <Text style={styles.title13}>Earn rewards starting at</Text>
          <Text style={styles.title14}>80 points per night book</Text>
        </View>

        <TouchableOpacity style={styles.touch2} onPress={() => {}}>
          <Text style={styles.title15}>Check Availability</Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <Picker
        isVisible={isMaximize}
        // onBackdropPress={() => setIsMaximize(false)}
        height={height}
        backdropOpacity={0}
        children={
          <MapFullViews
            isMax={isMaximize}
            setIsMax={() => setIsMaximize(false)}
            mTop={Platform.OS == 'android' ? normalize(20) : normalize(50)}
            isCloseButton={true}
          />
        }
      />

      {Platform.OS == 'android' && isMaximize && (
        <View
          style={{
            backgroundColor: Colors.dark,
            height: normalize(35),
            width: '100%',
            position: 'absolute',
          }}
        />
      )}
    </View>
  );
};

export default TravelDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    height: normalize(50),
    width: '100%',
    position: 'absolute',
    marginTop: Platform.OS == 'android' ? normalize(35) : normalize(45),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(18),
    alignItems: 'center',
  },
  touch: {
    backgroundColor: 'rgba(24, 34, 48, 0.32)',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(30),
    width: normalize(30),
    borderRadius: normalize(30),
  },
  img: {
    height: normalize(16),
    width: normalize(16),
    resizeMode: 'contain',
  },
  v1: {
    backgroundColor: Colors.catskill_white,
    width: '90%',
    borderRadius: normalize(8),
    alignSelf: 'center',
    marginVertical: normalize(10),
    padding: normalize(10),
  },
  title: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(20),
  },
  v2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: normalize(10),
  },
  img1: {
    resizeMode: 'contain',
    height: normalize(17),
    width: normalize(17),
    tintColor: Colors.dark,
    marginRight: normalize(8),
  },
  title1: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pickled_bluewood,
    fontSize: normalize(14),
  },
  dot: {
    backgroundColor: Colors.ball_blue,
    height: normalize(6),
    width: normalize(6),
    borderRadius: normalize(6),
    marginBottom: 2,
  },
  v3: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(10),
    marginVertical: normalize(15),
  },
  v4: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title2: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pickled_bluewood,
    fontSize: normalize(14),
    marginLeft: normalize(8),
  },
  title3: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(13),
    textDecorationLine: 'underline',
    marginVertical: normalize(5),
  },
  title4: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.dark,
    fontSize: normalize(18),
  },
  title5: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pickled_bluewood,
    fontSize: normalize(14),
    marginTop: normalize(8),
  },
  title6: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(14),
    textDecorationLine: 'underline',
  },
  main: {
    width: '90%',
    alignSelf: 'center',
    marginTop: normalize(10),
  },
  title7: {
    fontFamily: Fonts.InterMedium,
    color: Colors.dark,
    fontSize: normalize(18),
    marginBottom: normalize(12),
  },
  v5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(6),
  },
  type: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(14),
    width: '50%',
  },
  title6: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(14),
    width: '50%',
  },
  button: {
    borderColor: Colors.dawn_pink,
    width: '100%',
    height: normalize(40),
    borderRadius: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(1),
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: normalize(15),
  },
  buttonTitle: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(15),
  },
  v6: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  location: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(14),
    width: normalize(165),
  },
  touch1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.alabaster,
    width: '40%',
    borderColor: Colors.catskill_white,
    borderWidth: normalize(1),
    height: normalize(35),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(4),
  },
  map: {
    fontFamily: Fonts.InterRegular,
    color: Colors.dark,
    fontSize: normalize(14),
    marginLeft: normalize(10),
  },
  v7: {
    backgroundColor: hexToRGB(Colors.water, 0.5),
    padding: normalize(10),
    marginVertical: normalize(5),
    borderRadius: normalize(8),
  },
  title8: {
    fontFamily: Fonts.InterSemiBold,
    color: Colors.green,
    fontSize: normalize(16),
  },
  title9: {
    fontFamily: Fonts.InterRegular,
    color: Colors.pickled_bluewood,
    fontSize: normalize(14),
    marginTop: normalize(10),
  },
  v8: {
    backgroundColor: Colors.alabaster,
    padding: normalize(10),
    marginTop: normalize(18),
  },
  title10: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(18),
  },
  logo1: {
    height: normalize(60),
    width: normalize(60),
    borderRadius: normalize(60),
    borderColor: Colors.dawn_pink,
    borderWidth: normalize(1),
    overflow: 'hidden',
    resizeMode: 'cover',
    marginRight: normalize(15),
  },
  title11: {
    color: Colors.dark,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(15),
  },
  title12: {
    color: Colors.ball_blue,
    fontFamily: Fonts.InterSemiBold,
    fontSize: normalize(13),
    textDecorationLine: 'underline',
    marginTop: normalize(10),
  },
  v9: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(18),
    alignSelf: 'center',
    backgroundColor: Colors.white,
    shadowColor: hexToRGB(Colors.black,0.3),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    elevation: 8,
    shadowRadius: 10,
    borderTopLeftRadius: normalize(6),
    borderTopRightRadius: normalize(6),
  },
  title13: {
    color: Colors.dark,
    fontFamily: Fonts.InterRegular,
    fontSize: Platform.OS == 'android' ? normalize(12) : normalize(13),
  },
  title14: {
    color: Colors.green,
    fontFamily: Fonts.InterMedium,
    fontSize: Platform.OS == 'android' ? normalize(12) : normalize(13),
  },
  touch2: {
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(12),
    backgroundColor: Colors.ball_blue,
    width: '45%',
  },
  title15: {
    color: Colors.white,
    fontFamily: Fonts.InterMedium,
    fontSize: Platform.OS == 'android' ? normalize(12) : normalize(14),
  },
});
