import {
  FlatList,
  I18nManager,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import ScreenView from '../components/ScreenView';
import HeaderBox from '../components/HeaderBox';
import HeaderWithAll from '../components/HeaderWithAll';
import CustomText from '../components/CustomText';
import { colors } from '../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Subtitle from '../components/Subtitle';
import { drinks } from '../constants/data';
import ProductListing from '../components/ProductListing';

const ShopDetail = ({ isHeader = true, isGifterPage,hideArrow }) => {
  const [selectedDrink, setSelectedDrink] = useState(drinks[0]);
  const [showList, setShowList] = useState(false);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedDrink(item)}
        style={[
          styles.innerDrinkBox,
          item?.id == selectedDrink?.id && {
            borderColor: colors.primary,
            borderBottomWidth: 4,
          },
        ]}
      >
        <CustomText
          style={[
            { fontSize: 14 },
            item?.id == selectedDrink?.id && { color: colors.black },
          ]}
        >
          {item?.name}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenView
      scrollable={true}
      mh={true}
      style={!isHeader && { paddingTop: 0 }}
    >
      {isHeader && (
        <HeaderBox
          smallLogo={false}
          style={{ paddingHorizontal: 20 }}
          {...(showList && { onPressBack: () => setShowList(false) })}
        />
      )}
      {showList ? (
        <>
          <View style={{ marginHorizontal: -20 }}>
            <FlatList
              data={drinks}
              keyExtractor={(item, index) => item?.id}
              renderItem={renderItem}
              horizontal
              contentContainerStyle={styles.drinkContainer}
              showsHorizontalScrollIndicator={false}
            />

            <View
              style={{
                borderBottomWidth: 4,
                borderColor: colors.gray5,
                top: -28,
                zIndex: -100,
              }}
            />
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <ProductListing
              data={selectedDrink?.items}
              isGifterPage={isGifterPage}
            />
          </View>
        </>
      ) : (
        <View>
          <View style={{ marginTop: 8, marginBottom: 15 }}>
            <Image
              source={require('../assets/shop.png')}
              style={{ width: '100%', height: 200 }}
            />
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              top: -40,
              backgroundColor: colors.white,
              borderRadius: 15,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                height: 4,
                width: 80,
                backgroundColor: colors.gray5,
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />
            <CustomText style={{ fontSize: 18, marginBottom: 20 }}>
              Cofeea Avenue
            </CustomText>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => setShowList(true)}
              disabled={hideArrow}
            >
              <View>
                <CustomText style={{ color: colors.black }}>
                  <AntDesign name={'star'} size={12} color={colors.black} /> 4.7
                  (1666 ratings)
                </CustomText>
                <Subtitle style={{ marginBottom: 5 }}>
                  Open Until 03:00 Am
                </Subtitle>
                <Subtitle>Preparation time 15 mins</Subtitle>
              </View>

              <Ionicons
                name={
                  I18nManager.isRTL
                    ? 'chevron-back-outline'
                    : 'chevron-forward-outline'
                }
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>
            <CustomText
              style={{ fontSize: 18, marginBottom: 15, marginTop: 30 }}
            >
              {/* Most Popular */}
              {
                selectedDrink?.name
              }
            </CustomText>
            <ProductListing isGifterPage={isGifterPage} />
          </View>
        </View>
      )}
    </ScreenView>
  );
};

export default ShopDetail;

const styles = StyleSheet.create({
  drinkContainer: {
    gap: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  innerDrinkBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: colors.gray,
  },
});
