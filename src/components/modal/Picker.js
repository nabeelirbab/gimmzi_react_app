import {View, StyleSheet} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {Colors} from '../../themes/Themes';
import normalize from '../../utils/orientation/normalize';

const Picker = ({
  isVisible = false,
  onBackdropPress,
  children,
  isVisibleBar = false,
  radius = normalize(18),
  height = normalize(150),
  backdropOpacity = 0.5,
}) => {
  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating={true}
      isVisible={isVisible}
      avoidKeyboard={false}
      style={{
        width: '100%',
        alignSelf: 'center',
        margin: 0,
      }}
      backdropOpacity={backdropOpacity}
      animationInTiming={600}
      animationOutTiming={800}
      onBackButtonPress={onBackdropPress}
      onBackdropPress={onBackdropPress}>
      <View style={styles.main}>
        <View
          style={[
            styles.v1,
            {
              height: height,
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
            },
          ]}>
          {isVisibleBar && <View style={styles.line} />}
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default Picker;

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
