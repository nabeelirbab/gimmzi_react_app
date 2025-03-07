import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Modal from 'react-native-modal';
import {Colors} from '../../themes/Themes';
import normalize from '../../utils/orientation/normalize';
import MasonryList from '../masonry/MasonryList';
import ImageView from 'react-native-image-viewing';
import _ from 'lodash';

const {width} = Dimensions.get('window');

const ViewAllImages = ({
  isVisible = false,
  onBackdropPress = () => {},
  radius = normalize(18),
  backdropOpacity = 0.5,
  images = [],
}) => {
  let DATA = [...images].map((item, index) => ({
    id: String(index + 1),
    title: `${index + 1}`,
    height: Math.floor(Math.random() * (300 - 150 + 1)) + 150,
    image: item,
  }));

  const [imagesArr, setImagesArr] = useState({
    visible: false,
    index: 0,
    images: [],
    outside: false,
  });

  function setImagesViewerProps(visible, images, index) {
    let arr = images.map((img, index) => ({
      uri: img?.image,
    }));

    setImagesArr({
      images: arr,
      visible: visible,
      index: index,
    });
  }

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => setImagesViewerProps(true, DATA, index)}
      key={index}
      style={{marginVertical: normalize(4)}}>
      <Image
        source={{uri: item.image}}
        style={{
          height: item.height,
          width: width / 2 - normalize(12),
          resizeMode: 'cover',
          borderRadius: normalize(6),
        }}
      />
    </TouchableOpacity>
  );


  const keyExtractor = useCallback((item, index) => index.toString(), []);

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
      backdropOpacity={backdropOpacity}
      animationInTiming={600}
      animationOutTiming={500}
      onBackButtonPress={() => {
        if (onBackdropPress) {
          onBackdropPress();
        }
      }}
      onBackdropPress={() => {
        if (onBackdropPress) {
          onBackdropPress();
        }
      }}>
      <View style={styles.main}>
        <View
          style={[
            styles.v1,
            {
              height: '100%',
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
            },
          ]}>
          <View style={styles.line} />
          <View
            style={{
              height: normalize(450),
              width: '100%',
              paddingTop: normalize(10),
            }}>
            <MasonryList
              data={DATA}
              numColumns={2}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>

          {!_.isEmpty(imagesArr.images) && imagesArr.visible && (
            <ImageView
              images={imagesArr.images}
              imageIndex={imagesArr.index}
              visible={imagesArr.visible}
              onRequestClose={() => setImagesViewerProps(false, [], 0, false)}
              keyExtractor={keyExtractor}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ViewAllImages;

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
    width: '100%',
  },
  line: {
    backgroundColor: Colors.dark,
    height: normalize(5),
    width: normalize(65),
    borderRadius: normalize(6),
    alignSelf: 'center',
    marginTop: normalize(10),
  },
});
