import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {BlurView} from '@react-native-community/blur';
import normalize from '../../utils/orientation/normalize';

const CustomModal = ({
  isVisible,
  children,
  onBackdropPress,
  disabled = false,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.9}
      animationIn="bounceIn"
      animationOut="zoomOut"
      animationInTiming={400}
      animationOutTiming={500}
      avoidKeyboard={true}
      onBackdropPress={() => onBackdropPress(false)}
      style={{
        width: '100%',
        margin: 0,
        padding: 0,
      }}
      customBackdrop={
        <View style={styles.customBackdrop}>
          <BlurView
            style={styles.absolute}
            blurType="dark"
            blurAmount={1}
            reducedTransparencyFallbackColor="white"></BlurView>
        </View>
      }>
      <Pressable
        disabled={disabled}
        onPress={() => onBackdropPress(false)}
        style={{
          flex: 1,
        }}></Pressable>
      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          width: '100%',
        }}>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  customBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default CustomModal;
