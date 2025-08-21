import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';

const ShopsDataCard = ({ data, scrollEnabled, onPress }) => {
  const navigation = useNavigation();
  const renderItem = () => {
    return (
      <TouchableOpacity
        onPress={onPress ? onPress : () => navigation.navigate('ShopDetail')}
        style={styles.cardBox}
      >
        <Image
          source={require('../assets/shopName.png')}
          style={{ width: 70, height: 65 }}
          borderRadius={10}
          resizeMode="contain"
        />

        <View style={{ gap: 2, width: '75%' }}>
          <CustomText style={styles.title}>Parkero</CustomText>
          <CustomText style={styles.subTitle}>
            lorem ipsum lorem ipsum
          </CustomText>

          <CustomText style={{ fontSize: 12, color: colors.gray1 }}>
            3KM
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
    backgroundColor: colors.gray5,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
