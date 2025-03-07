import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {horizontalScale} from '../../utils/helpers/scaleDimensions';
import ImageViewer from './ImageView';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';
import {Colors, Fonts, Icons} from '../../themes/ImagePath';
import ImageView from 'react-native-image-viewing';
import Modal from 'react-native-modal';
import _ from 'lodash';

const ViewImages = ({arr = [], end_point = '', field, width = '90%'}) => {
  var URL = constants.BASE_IMG + end_point;

  const [showModal, setShowModal] = useState(false);
  const [imagesArr, setImagesArr] = useState({
    visible: false,
    index: 0,
    images: [],
    outside: false,
  });

  function setImagesViewerProps(visible, images, index, status = false) {
    let arr = images.map((img, index) => ({
      uri: URL.concat(img?.[field]),
    }));

    setImagesArr({
      images: arr,
      visible: visible,
      index: index,
      outside: status,
    });
  }


  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <>
      <View
        style={{
          width: width,
          alignSelf: 'center',
          marginVertical: horizontalScale(20),
          justifyContent: arr?.length == 0 ? 'center' : null,
        }}>
        {arr.length == 4 && (
          <View style={styles.v}>
            <View style={{justifyContent: 'space-between'}}>
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 0, true)}
                uri={URL.concat(arr[0][field])}
                style={styles.img41}
              />
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 2, true)}
                uri={URL.concat(arr[2][field])}
                style={styles.img42}
              />
            </View>
            <View style={{justifyContent: 'space-between'}}>
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 1, true)}
                uri={URL.concat(arr[1][field])}
                style={styles.img41}
              />
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 3, true)}
                uri={URL.concat(arr[3][field])}
                style={styles.img42}
              />
            </View>
          </View>
        )}

        {arr.length == 3 && (
          <View style={styles.v}>
            <ImageViewer
              onPress={() => setImagesViewerProps(true, arr, 0, true)}
              uri={URL.concat(arr[0][field])}
              style={styles.img31}
            />
            <View style={{justifyContent: 'space-between'}}>
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 1, true)}
                uri={URL.concat(arr[1][field])}
                style={styles.img41}
              />
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 2, true)}
                uri={URL.concat(arr[2][field])}
                style={styles.img42}
              />
            </View>
          </View>
        )}

        {arr.length == 2 && (
          <View style={styles.v}>
            <ImageViewer
              onPress={() => setImagesViewerProps(true, arr, 0, true)}
              uri={URL.concat(arr[0][field])}
              style={styles.img32}
            />
            <ImageViewer
              onPress={() => setImagesViewerProps(true, arr, 1, true)}
              uri={URL.concat(arr[1][field])}
              style={styles.img32}
            />
          </View>
        )}

        {arr.length == 1 && (
          <View style={styles.v}>
            <ImageViewer
              onPress={() => setImagesViewerProps(true, arr, 0, true)}
              uri={URL.concat(arr[0][field])}
              style={styles.img1}
            />
          </View>
        )}

        {arr?.length > 4 && (
          <View style={styles.v}>
            <View style={{justifyContent: 'space-between'}}>
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 0, true)}
                uri={URL.concat(arr[0][field])}
                style={styles.img41}
              />
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 2, true)}
                uri={URL.concat(arr[2][field])}
                style={styles.img42}
              />
            </View>
            <View style={{justifyContent: 'space-between'}}>
              <ImageViewer
                onPress={() => setImagesViewerProps(true, arr, 1, true)}
                uri={URL.concat(arr[1][field])}
                style={[styles.img41]}
              />
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <ImageViewer
                  uri={URL.concat(arr[3][field])}
                  style={[
                    styles.img42,
                    {
                      opacity: 0.8,
                    },
                  ]}
                />
                <View style={[styles.img43, styles.img42]}>
                  <Text style={styles.text}>{`${
                    arr?.length - 4
                  }+ Images`}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <ImageView
        images={imagesArr.images}
        imageIndex={imagesArr.index}
        visible={imagesArr.visible}
        onRequestClose={() => setImagesViewerProps(false, [], 0, false)}
        keyExtractor={keyExtractor}
      />

      <Modal
        animationType="fade"
        visible={showModal}
        backdropColor={'black'}
        animationIn={'slideInUp'}
        animationOut={'slideInDown'}
        animationInTiming={700}
        animationOutTiming={800}
        style={styles.modal}
        onBackdropPress={() => setShowModal(false)}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.v1}>
            <Text style={styles.title}>Images</Text>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.touch}>
              <Image
                source={Icons.cross}
                style={styles.close}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.v2}>
            <FlatList
              data={arr}
              keyExtractor={keyExtractor}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              contentContainerStyle={{
                width: '90%',
                alignSelf: 'center',
              }}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setImagesViewerProps(true, arr, index, false);
                    }}
                    style={styles.item}>
                    <ImageViewer
                      onPress={() =>
                        setImagesViewerProps(true, arr, index, true)
                      }
                      uri={URL + item[field]}
                      style={{
                        height: normalize(138),
                        width: normalize(138),
                        borderRadius: normalize(10),
                        marginBottom: normalize(10),
                        resizeMode: 'cover',
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
            />

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
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default ViewImages;

const styles = StyleSheet.create({
  v: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  img1: {height: normalize(220), width: '100%'},
  img31: {height: normalize(252), width: normalize(138)},
  img32: {height: normalize(138), width: normalize(138)},
  img41: {
    height: normalize(120),
    width: normalize(138),
    marginBottom: normalize(12),
  },
  img42: {
    height: normalize(120),
    width: normalize(138),
  },
  img43: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    fontSize: normalize(14),
    fontFamily: Fonts.Roboto_Bold,
  },
  v1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: horizontalScale(15),
    paddingHorizontal: normalize(5),
  },
  title: {
    color: Colors.black,
    fontSize: normalize(16),
    marginLeft: normalize(10),
    fontFamily: Fonts.Roboto_Bold,
  },
  touch: {
    height: normalize(22),
    width: normalize(22),
    borderRadius: normalize(20),
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: normalize(10),
  },
  close: {
    height: normalize(12),
    width: normalize(12),
    borderRadius: normalize(10),
    tintColor: 'white',
  },
  modal: {
    width: '100%',
    margin: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: Colors.white,
  },
  v2: {
    paddingVertical: normalize(20),
    width: '100%',
    flex: 1,
  },
});
