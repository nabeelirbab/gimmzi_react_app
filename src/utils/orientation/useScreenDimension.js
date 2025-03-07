import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const useScreenDimension = () => {
  const [screenDimensions, setScreenDimensions] = useState({
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height,
  });

  const handleOrientationChange = () => {
    const newScreenWidth = Dimensions.get('window').width;
    const newScreenHeight = Dimensions.get('window').height;
    setScreenDimensions({ screenWidth: newScreenWidth, screenHeight: newScreenHeight });
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    return () => {
      subscription.remove();
    };
  }, []);

  return screenDimensions;
};

export default useScreenDimension;
