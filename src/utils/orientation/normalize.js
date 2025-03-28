import {PixelRatio, Dimensions} from 'react-native';

const scale = Dimensions.get('window').width / 320;

const normalize = size => {
  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
export default normalize;
