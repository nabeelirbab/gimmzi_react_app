import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import normalize from '../../utils/orientation/normalize';
import {Colors, Fonts} from '../../themes/Themes';
import Image from './ImageView';
import ViewAllImages from './ViewAllImages';
import ImageView from 'react-native-image-viewing';
import _ from 'lodash';

const GridImageViewer = ({
  images,
  marginTop = normalize(12),
  height = normalize(200),
  width = '90%',
  borderRadius = normalize(8),
  mWidth = '95%',
  mBackgroundColor = 'rgba(255,255,255,0.60)',
  mBottom = normalize(10),
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isShowAll, setIsShowAll] = useState(false);

  const [imagesArr, setImagesArr] = useState({
    visible: false,
    index: 0,
    images: [],
    outside: false,
  });

  function setImagesViewerProps(visible, images, index) {
    let arr = images.map((img, index) => ({
      uri: img,
    }));

    setImagesArr({
      images: arr,
      visible: visible,
      index: index,
    });
  }

  return (
    <>
      <View
        style={{
          width: width,
          alignSelf: 'center',
          height: height,
          marginTop: marginTop,
        }}>
        <Image
          source={{uri: images[selectedIndex]}}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
            borderRadius: borderRadius,
          }}
          onPress={img => setImagesViewerProps(true, images, selectedIndex)}
        />

        <View
          style={{
            height: normalize(50),
            // width: mWidth,
            backgroundColor: mBackgroundColor,
            position: 'absolute',
            alignSelf: 'center',
            bottom: mBottom,
            borderRadius: normalize(6),
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: normalize(3),
            // justifyContent: images.length > 5 ? 'space-evenly' : 'flex-end',
          }}>
          {[...images].slice(0, 6).map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (5 < index + 1 && 6 < images.length) {
                    setIsShowAll(true);
                  } else {
                    setSelectedIndex(index);
                  }
                }}>
                <Image
                  source={{uri: item}}
                  style={{
                    height: normalize(40),
                    width: normalize(40),
                    borderRadius: normalize(5),
                    // marginRight: images.length > 5 ? 0 : normalize(5),
                    marginHorizontal: normalize(3),
                  }}
                />
                {5 < index + 1 && 6 < images.length && (
                  <View
                    style={{
                      height: normalize(40),
                      width: normalize(40),
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      position: 'absolute',
                      borderRadius: normalize(5),
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: normalize(3),
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: normalize(14),
                        fontFamily: Fonts.InterSemiBold,
                      }}>
                      +{images.length - 6}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {/* View All Images */}
      <ViewAllImages
        onBackdropPress={() => setIsShowAll(false)}
        isVisible={isShowAll}
        images={images}
      />

      {!_.isEmpty(imagesArr.images) && imagesArr.visible && (
        <ImageView
          images={imagesArr.images}
          imageIndex={imagesArr.index}
          visible={imagesArr.visible}
          onRequestClose={() => setImagesViewerProps(false, [], 0, false)}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </>
  );
};

export default GridImageViewer;
