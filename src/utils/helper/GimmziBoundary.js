import React, {useState} from 'react';
import _ from 'lodash';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';
import Geolocations from '@react-native-community/geolocation';
import {GOOGLE_API_KEY} from '@env';
import axios from 'axios';
import {showMessage} from './Toast';

export const GimmziContext = React.createContext();

let _states = false;

export default function (props) {
  const [states, setStates] = useState('');

  function getStatesData(callback = () => {}) {
    // console.log('states', states);
    callback(_states);
  }

  function convert(value, callback = () => {}) {
    if (value == 0) {
      callback('Hii');
    } else {
      callback('Hello');
    }
  }

  function getImageFromGallery(callback = () => {}) {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        const imageUri = Platform.OS === 'ios' ? image.path : image.path;
        // console.log("image---------->",image)
        let arr = image.path.split('/');
        let getOriginalname = arr[arr.length - 1];
        let imageObj = {
          name: getOriginalname,
          type: image.mime,
          uri:
            Platform.OS === 'android'
              ? image.path
              : image.path.replace('file://', ''),
        };
        callback({
          uri: imageUri,
          path: imageObj,
        });
      })
      .catch(err => {
        callback({
          uri: '',
          path: '',
        });
        console.log(err);
      });
  }

  function getImageFromCamera(isCrop, callback = () => {}, size) {
    ImagePicker.openCamera({
      width: size?.width ? size?.width : 400,
      height: size?.height ? size?.height : 400,
      cropping: isCrop,
      mediaType: 'photo',
    })
      .then(image => {
        const imageUri = Platform.OS === 'ios' ? image.path : image.path;

        let arr = image.path.split('/');
        let getOriginalname = arr[arr.length - 1];
        let imageObj = {
          name: getOriginalname,
          type: image.mime,
          uri:
            Platform.OS === 'android'
              ? image.path
              : image.path.replace('file://', ''),
        };

        callback({
          uri: imageUri,
          path: imageObj,
        });
      })
      .catch(err => {
        callback({
          uri: '',
          path: '',
        });
        console.log(err);
      });
  }

  // Get Current Location
  function getCurrentLocation(callback = () => {}) {
    if (Platform.OS == 'ios') {
      getCurrentPosition(res => callback(res));
    } else {
      requestPermission(res => {
        if (res) {
          setTimeout(() => {
            getCurrentPosition(res => callback(res));
          }, 5000);
        }
      });
    }
  }

  // Get Watch Current Location
  function getWatchLocation(callback = () => {}) {
    if (Platform.OS == 'ios') {
      getWatchPosition(res => callback(res));
    } else {
      requestPermission(res => {
        if (res) {
          setTimeout(() => {
            getWatchPosition(res => callback(res));
          }, 5000);
        }
      });
    }
  }

  // Check Permission
  async function requestPermission(callback = () => {}) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Gimmzi Location Permission',
          message: 'Gimmzi needs to access your location',
          //   buttonNeutral: "Ask Me Later",
          //   buttonNegative: "Cancel",
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        callback(true);
      } else {
        callback(false);
        console.log('location permission denied');
      }
    } catch (err) {
      callback(false);
      // console.warn(err);
    }
  }

  // Get Location
  function getCurrentPosition(callback = () => {}) {
    if (Platform.OS == 'ios') {
      Geolocations.getCurrentPosition(
        position => {
          let obj = {
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            heading: position?.coords.heading,
          };
          callback(obj);
        },
        error => {
          callback({
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 200000,
          maximumAge: 3600000,
        },
      );
    } else {
      Geolocation.getCurrentPosition(
        position => {
          let currentRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            heading: position?.coords.heading,
          };
          callback(currentRegion);
        },
        error => {
          console.log('error : ', error);
          callback({
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 200000,
          maximumAge: 3600000,
        },
      );
    }
  }

  // Watch Location
  function getWatchPosition(callback = () => {}) {
    if (Platform.OS == 'ios') {
      Geolocations.watchPosition(
        position => {
          let obj = {
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            heading: position?.coords.heading,
          };
          callback(obj);
        },
        error => {
          callback({
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 200000,
          maximumAge: 3600000,
        },
      );
    } else {
      Geolocation.watchPosition(
        position => {
          let currentRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            heading: position?.coords.heading,
          };
          callback(currentRegion);
        },
        error => {
          console.log('error : ', error);
          callback({
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 200000,
          maximumAge: 3600000,
        },
      );
    }
  }

  // Get Current Address
  const getAddressFromCoords = async (latitude, longitude) => {
    // console.log('Fetching address from coordinates...');

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await axios.get(url);

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;

        const state = addressComponents.find(component =>
          component.types.includes('administrative_area_level_1'),
        )?.long_name;

        const city = addressComponents.find(component =>
          component.types.includes('locality'),
        )?.long_name;

        const country = addressComponents.find(component =>
          component.types.includes('country'),
        )?.long_name;

        const postalCode = addressComponents.find(component =>
          component.types.includes('postal_code'),
        )?.long_name;

        return {
          state,
          city,
          country,
          postalCode,
        };
      } else {
        console.log('No results found');
        return null;
      }
    } catch (error) {
      console.log('Error fetching address: ', error);
      return null;
    }
  };

  // Phone Call
  const makePhoneCall = phoneNumber => {
    let phoneUrl = '';

    if (Platform.OS === 'android') {
      phoneUrl = `tel:${phoneNumber}`;
    } else if (Platform.OS === 'ios') {
      phoneUrl = `telprompt:${phoneNumber}`;
    }

    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          showMessage(
            'Phone call functionality is not available on this device',
          );
        }
      })
      .catch(err => showMessage('Error opening phone dialer', err));
  };

  return (
    <GimmziContext.Provider
      value={{
        getImageFromGallery: getImageFromGallery,
        getImageFromCamera: getImageFromCamera,
        getCurrentLocation: getCurrentLocation,
        getWatchLocation: getWatchLocation,
        getAddressFromCoords: getAddressFromCoords,
        setStateData: val => {
          // console.log('_________', val);
          _states = val;
          setStates(val);
        },
        getStatesData: getStatesData,
        convert: convert,
        makePhoneCall: makePhoneCall,
      }}>
      {props.children}
    </GimmziContext.Provider>
  );
}

/*
  const context = useContext(GimmziContext);
    context.getStatesData(val => {
      console.log('context.getStatesData', val);
    });
*/
