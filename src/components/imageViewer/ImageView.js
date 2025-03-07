import {View, Text, Pressable, Image, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../themes/Themes';
import normalize from '../../utils/orientation/normalize';

const ImageView = ({onPress, style, source}) => {
  const [loading, setLoading] = useState(true);

  return (
    <Pressable
      disabled={onPress == undefined}
      onPress={onPress}
      style={[
        {
          borderRadius: normalize(10),
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f8f8',
        },
        style,
      ]}>
      {loading && (
        <View style={{position: 'absolute'}}>
          <ActivityIndicator size={'small'} color={Colors.dark} />
        </View>
      )}

      <Image
        source={source}
        style={{height: '100%', width: '100%', resizeMode: 'contain'}}
        onLoad={() => setLoading(false)}
      />
    </Pressable>
  );
};

export default ImageView;
