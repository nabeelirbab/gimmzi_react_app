// import {View, Text} from 'react-native';
// import React from 'react';
// import useOrientation from '../utils/orientation/useOrientation';
// import useScreenDimension from '../utils/orientation/useScreenDimension';
// import normalize from '../utils/orientation/normalize';

// const Test = () => {
//   const orientation = useOrientation();
//   const {screenWidth, screenHeight} = useScreenDimension();

//   // orientation == 'LANDSCAPE' ? css.fs20 : css.fs15,

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'green',
//       }}>
//       <View
//         style={{
//           width: orientation == 'LANDSCAPE' ? normalize(290) : normalize(210),
//           height: orientation == 'LANDSCAPE' ? normalize(210) : normalize(250),
//           backgroundColor: 'white',
//           borderRadius: normalize(10),
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}>
//           <Text style={{
//             fontSize: orientation == 'LANDSCAPE' ? normalize(30) : normalize(20)
//           }}>Welcome</Text>
//         </View>
//     </View>
//   );
// };

// export default Test;

// /*
// RequestInfo,TravelCheckAvailability
// */

