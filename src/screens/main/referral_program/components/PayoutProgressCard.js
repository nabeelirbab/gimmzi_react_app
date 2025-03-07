import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts} from '../../../../themes/Themes';
import normalize from '../../../../utils/orientation/normalize';

const {width} = Dimensions.get('window');

const PayoutProgressCard = ({item}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>

    <Text style={styles.t1}>{item.description}</Text>
    {item.plans.map((item, index) => (
      <View
        key={index}
        style={{
          width: '100%',
          borderTopColor: Colors.white,
          borderTopWidth: index !== 0 ? normalize(1) : 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: normalize(10),
          paddingTop: normalize(index !== 0 ? 10 : 3)
        }}>
            <Text style={styles.t1}>{item.title}</Text>
            <Text style={styles.t1}>{item.value}</Text>
        </View>
    ))}
    {/* <Text style={styles.cardText}>{item.description}</Text>
    <View style={styles.separator} />
    <Text style={styles.cardText}>
      Expected Payout Amount:{' '}
      <Text style={styles.boldText}>{item.payoutAmount}</Text>
    </Text>
    <Text style={styles.cardText}>
      Expected Payout Date:{' '}
      <Text style={styles.boldText}>{item.payoutDate}</Text>
    </Text> */}
  </View>
);

export default PayoutProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.water,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(16),
    paddingTop: normalize(16),
    paddingBottom: normalize(5),
    marginBottom: normalize(15),
    width: width - normalize(36), // to add padding around the card
    marginHorizontal: normalize(18),
  },
  cardTitle: {
    fontSize: normalize(16),
    fontFamily: Fonts.InterMedium,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: normalize(10)
  },
  t1: {
    color: Colors.dark,
    fontFamily: Fonts.InterMedium,
    fontSize: normalize(12)
  }
});
