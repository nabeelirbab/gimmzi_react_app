import { useState, useEffect } from 'react';
import { Dimensions, AppState } from 'react-native';

const useOrientation = () => {
  const [orientation, setOrientation] = useState('PORTRAIT');

  const getOrientation = () => {
    const { width, height } = Dimensions.get('window');
    setOrientation(width > height ? 'LANDSCAPE' : 'PORTRAIT');
  };

  useEffect(() => {
    // Initial orientation check
    getOrientation();

    // Event listener for orientation change
    const dimensionsListener = () => {
      getOrientation();
    };

      const subsDimension = Dimensions.addEventListener('change', dimensionsListener);

    // Event listener for app state change (e.g., when the app comes back from background)
    const appStateListener = (nextAppState) => {
      if (nextAppState === 'active') {
        getOrientation();
      }
    };

    const subsAppState =  AppState.addEventListener('change', appStateListener);

    // Clean up event listeners on unmount
    return () => {
        subsDimension.remove();
        subsAppState.remove();     
    };
  }, []);

  return orientation;
};

export default useOrientation;
