import {
  I18nManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../constants/colors';
import CustomText from './CustomText';
import { decrementCounter, incrementCounter } from '../redux/ProductAddToCart';
import { decrementCounter as GD, incrementCounter as GI, clearCart } from '../redux/GiftData';

import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const IncrementDecrement = ({
  style,
  onpressPlus,
  onpressMinu,
  pCounter,
  firstBox,
  isGift,
  item
}) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [counter, setCounter] = useState(1);
  const incrementCounters = () => setCounter(counter + 1);
  const decrementCounters = () => {
    if (counter > 1) setCounter(counter - 1);
  };

  if (firstBox) {
    return (
      <View
        style={[
          styles.counterContainer,
          {
            backgroundColor: colors.white,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4.65,
            borderWidth: 0,
            elevation: 7,
          },
          style,
        ]}
      >
        <TouchableOpacity
          onPress={onpressMinu ? onpressMinu : decrementCounters}
        >
          <AntDesign name={'minus'} size={20} color={colors.black} />
        </TouchableOpacity>
        <CustomText>{pCounter ? pCounter : counter}</CustomText>
        <TouchableOpacity
          onPress={onpressPlus ? onpressPlus : incrementCounters}
        >
          <AntDesign name={'plus'} size={20} color={colors.black} />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={[styles.counterContainer, style]}>
        <TouchableOpacity
          // onPress={() => {isGift ? dispatch(GD(item?.id)) : dispatch(decrementCounter(item?.id))}}



          onPress={() => {
            if (isGift) {
              if (item?.counter && item?.counter > 1) {
                dispatch(GD(item?.id))
              } else {
                dispatch(clearCart());
                navigation.goBack();
              }
            } else {
              dispatch(decrementCounter(item?.id));
            }
          }}
        >

          <AntDesign name={'minus'} size={20} color={colors.black} />
        </TouchableOpacity>
        <CustomText>{item?.counter}</CustomText>
        <TouchableOpacity
          onPress={() => {
            if (isGift) {
              dispatch(GI(item?.id))
            } else {
              dispatch(incrementCounter(item?.id));
            }
          }
          }

        >
          <AntDesign name={'plus'} size={20} color={colors.black} />
        </TouchableOpacity>
      </View >
    );
  }
};

export default IncrementDecrement;

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: colors.gray,
  },
});
