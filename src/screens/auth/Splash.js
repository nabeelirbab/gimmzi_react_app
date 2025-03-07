import {View, StyleSheet, Image, Animated} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Images} from '../../themes/Themes';
import normalize from '../../utils/orientation/normalize';
import MyStatusBar from '../../components/custom/MyStatusBar';
import Storage from '../../utils/stroage';
import {useAppDispatch} from '../../redux';
import {setUserStatus} from '../../redux/slice/auth.slice';

const Splash = () => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const dispatch = useAppDispatch();

  useEffect(() => {
    Animated.timing(progress, {
      toValue: normalize(108),
      duration: 2000,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      let token = Storage.getItem('token');
      dispatch(setUserStatus(token ? true : false));
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor={Colors.dark} barStyle={'light-content'} />
      <View style={styles.main}>
        <Image
          source={Images.logo}
          style={{
            resizeMode: 'contain',
            height: normalize(55),
            width: '100%',
          }}
        />
        <View style={styles.barContainer}>
          <Animated.View style={[styles.bar, {width: progress}]} />
        </View>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    width: '78%',
    height: 80,
  },
  barContainer: {
    height: normalize(10),
    borderColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 2,
    position: 'absolute',
    bottom: 0,
    right: normalize(37),
    width: normalize(113),
    marginBottom: normalize(2),
    borderWidth: normalize(1),
  },
  bar: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
});
