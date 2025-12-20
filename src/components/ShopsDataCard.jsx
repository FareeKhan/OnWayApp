import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import CustomText from './CustomText';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import { mainUrl } from '../constants/data';
import FastImage from 'react-native-fast-image';

const ShopsDataCard = ({ data, scrollEnabled, onPress }) => {
  const navigation = useNavigation();
  console.log('datadatadata', data)

  const [useFallback, setUseFallback] = useState(false);


  const renderItem = ({ item, index }) => {
    const remoteImage = item?.logo ? `${mainUrl}${item?.logo}` : `${mainUrl}${item?.image}`

    return (
      <TouchableOpacity
        onPress={() => onPress ? onPress(item) : navigation.navigate('ShopDetail', {
          id: item?.restaurant_id ? item?.restaurant_id : item?.id,
        })}
        style={styles.cardBox}
      >
        <View style={{ backgroundColor: 'red', borderRadius: 50, overflow: "hidden", borderWidth: 1, borderColor: colors.gray6 }}>
          <FastImage
            style={{ width: 70, height: 70 }}
            source={{
              uri: remoteImage,
              priority: FastImage.priority.normal,
            }}
            onError={() => setUseFallback(true)}
          />
        </View>

        <View style={{ gap: 2, width: '75%' }}>
          <CustomText style={styles.title}>{item?.name}</CustomText>
          <CustomText style={styles.subTitle}>
            {item?.description}
          </CustomText>

          <CustomText style={{ fontSize: 12, color: colors.gray1, textTransform: "capitalize" }}>
            {/* 3KM */}
            {[...new Set(item?.location?.split(/\r?\n/).map(s => s.trim()))].join(", ")}
            {/* {item?.location} */}
          </CustomText>

          <CustomText
            style={{
              fontSize: 12,
              color: colors.black,
              textAlign: 'right',
              width: '100%',
            }}
          >
            4.3
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{}}
        contentContainerStyle={{ paddingBottom: 30 }}
        scrollEnabled={scrollEnabled ? scrollEnabled : false}
      />
    </View>
  );
};

export default ShopsDataCard;

const styles = StyleSheet.create({
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    backgroundColor: colors.gray5?.concat('99'),
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 16,
  },
  subTitle: {
    color: colors.gray1,
    fontSize: 10,
    fontFamily: fonts.medium,
  },
});
