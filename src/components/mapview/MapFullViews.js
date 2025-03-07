import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {memo, useContext, useEffect, useRef, useState} from 'react';
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {useIsFocused} from '@react-navigation/native';
import {GimmziContext} from '../../utils/helper/GimmziBoundary';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts, Icons} from '../../themes/Themes';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421; // LATITUDE_DELTA * ASPECT_RATIO;

const MapFullViews = ({
  isMax = false,
  setIsMax = () => {},
  mTop = normalize(15),
  isCloseButton = false,
}) => {
  const context = useContext(GimmziContext);
  const isFocused = useIsFocused();
  const mapRef = useRef();
  const markerRef = useRef();

  const [isMapType, setisMapType] = useState(0);

  const [state, setState] = useState({
    currentLocation: {
      latitude: 22.57543893621918,
      longitude: 88.4271534572498,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 22.57543893621918,
      longitude: 88.4271534572498,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      pitch: 45,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });

  const {
    currentLocation,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
  } = state;
  const updateState = data => setState(state => ({...state, ...data}));

  const [region, setRegion] = useState({
    latitude: 22.57543893621918,
    longitude: 88.4271534572498,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  // -------------------------------- On Start ----------------------------------------

  useEffect(() => {
    if (isFocused) {
      getLiveLocation();
    }
  }, [isFocused]);

  const getLiveLocation = async () => {
    await context.getCurrentLocation(coords => {
      if (coords) {
        animate(coords?.latitude, coords?.longitude);
        animateMap(coords?.latitude, coords?.longitude);
        setRegion(pre => ({
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }));
        updateState({
          heading: coords?.heading,
          currentLocation: {
            latitude: coords?.latitude,
            longitude: coords?.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          coordinate: new AnimatedRegion({
            latitude: coords?.latitude,
            longitude: coords?.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        });
      }
    });
    /*
    {
        "heading": -1, 
        "latitude": 22.575397,
        "latitudeDelta": 0.01,
        "longitude": 88.42748814780172,
        "longitudeDelta": 0.01}
    */
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  function animateMap(latitude, longitude) {
    try {
      mapRef.current.animateCamera({
        center: {
          latitude: latitude,
          longitude: longitude,
        },
        pitch: 45,
        heading: 0,
        altitude: 1000,
        zoom: 12,
        rotateValue: 5,
      });
    } catch (error) {
      console.log('error --- ', error);
    }
  }

  const zoomIn = () => {
    setRegion(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={{...StyleSheet.absoluteFill}}
        followsUserLocation={true}
        initialRegion={{
          ...currentLocation,
        }}
        region={region}
        showsCompass={false}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        showsBuildings={true}
        mapType={isMapType == 0 ? 'standard' : 'satellite'}
        rotateEnabled={true}
        showsIndoors={true}
        provider={PROVIDER_GOOGLE}
        onLayout={() => {
          mapRef.current.animateCamera({
            center: {
              latitude: state.currentLocation.latitude,
              longitude: state.currentLocation.longitude,
            },
            heading: state.heading,
            pitch: 45,
            zoom: 16,
          });
        }}>
        <Marker.Animated
          ref={markerRef}
          coordinate={coordinate}
          anchor={{x: 0.5, y: 0.5}}
        />
      </MapView>

      {/* Map Type Options */}
      <View
        style={[
          styles.v1,
          {
            top: mTop,
          },
        ]}>
        {['Map', 'Satellite'].map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              setisMapType(isMapType == 1 ? 0 : 1);
            }}
            key={index}
            style={{
              backgroundColor: Colors.white,
              paddingHorizontal: 15,
              paddingVertical: normalize(8),
              marginRight: index == 0 ? 1 : 0,
            }}>
            <Text
              style={{
                fontFamily:
                  isMapType == index ? Fonts.InterSemiBold : Fonts.InterRegular,
                color: isMapType == index ? Colors.dark : Colors.mist_blue,
                fontSize: normalize(12),
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Close */}
      {isCloseButton && (
        <View
          style={[
            styles.v3,
            {
              top: mTop,
            },
          ]}>
          <TouchableOpacity onPress={() => setIsMax()} style={styles.touch}>
            <Image source={Icons.close} style={styles.img} />
          </TouchableOpacity>
        </View>
      )}

      {/* Maximize Options */}
      <View
        style={[
          styles.v1,
          styles.v2,
          {
            right: normalize(95),
          },
        ]}>
        <TouchableOpacity onPress={() => setIsMax()} style={styles.touch1}>
          <Image
            source={isMax ? Icons.minimize : Icons.maximize}
            style={styles.img}
          />
        </TouchableOpacity>
      </View>

      {/* Zoom In & Zoom Out Options */}
      <View style={[styles.v1, styles.v2]}>
        {['+', '-'].map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              if (index == 0) {
                zoomIn();
              } else {
                zoomOut();
              }
            }}
            key={index}
            style={{
              backgroundColor: Colors.white,
              paddingHorizontal: 12,
              paddingVertical: normalize(8),
              marginRight: index == 0 ? 1 : 0,
            }}>
            <Image
              source={index == 0 ? Icons.plus : Icons.minus}
              style={styles.img}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default memo(MapFullViews);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  v1: {
    position: 'absolute',
    top: normalize(15),
    left: normalize(15),
    flexDirection: 'row',
    backgroundColor: Colors.cyne_blue,
    borderRadius: normalize(6),
    overflow: 'hidden',
  },
  v2: {
    top: undefined,
    right: normalize(15),
    left: undefined,
    bottom: normalize(15),
  },
  v3: {
    backgroundColor: 'red',
    right: normalize(15),
    position: 'absolute',
    backgroundColor: Colors.cyne_blue,
    borderRadius: normalize(6),
    overflow: 'hidden',
  },
  touch: {
    backgroundColor: Colors.white,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(7),
  },
  img: {
    resizeMode: 'contain',
    height: normalize(16),
    width: normalize(16),
  },
  touch1: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: normalize(8),
  },
});
