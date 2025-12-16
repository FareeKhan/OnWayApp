import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DividerLine from './DividerLine';
import CustomText from './CustomText';
import IncrementDecrement from './IncrementDecrement';
import { currency } from '../constants/data';
import { fonts } from '../constants/fonts';
import { useSelector } from 'react-redux';
import RemoteImage from './RemoteImage';

const CartProducts = ({ data ,isGift}) => {

  const cartData = useSelector((state) => state?.cart?.cartProducts)

  return (
    <View style={styles.cartContainer}>
      <FlatList
        data={data ? data : cartData}
        contentContainerStyle={styles.cartContent}
        keyExtractor={item => item?.toString()}
        scrollEnabled={false}
        ItemSeparatorComponent={
          <DividerLine style={styles.itemSeparator} h={true} />
        }
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <CustomText style={{ fontFamily: fonts.semiBold }}>{item?.title}</CustomText>
              <View style={styles.priceRow}>
                <CustomText>{currency} {item?.price}</CustomText>
                <IncrementDecrement isGift={isGift} item={item} style={styles.incrementer} />
              </View>
            </View>
            <RemoteImage
              uri={item?.image}
              style={styles.productImage}
            />
          </View>
        )}
      />
    </View>
  );
};


export default CartProducts

const styles = StyleSheet.create({
  cartContainer: {},
  cartContent: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  itemSeparator: {
    marginVertical: 15,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  incrementer: {
    borderWidth: 0,
    gap: 25,
  },
  productImage: {
    width: 62,
    height: 60,
    borderRadius: 10,
  },
})