import {
  FlatList,
  I18nManager,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenView from '../components/ScreenView';
import HeaderBox from '../components/HeaderBox';
import CustomText from '../components/CustomText';
import { colors } from '../constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Subtitle from '../components/Subtitle';
import { drinks, mainUrl } from '../constants/data';
import ProductListing from '../components/ProductListing';
import { fetchResaurentsItems } from '../userServices/UserService';
import { useTranslation } from 'react-i18next';
import ScreenLoader from '../components/ScreenLoader';
import RemoteImage from '../components/RemoteImage';

const ShopDetail = ({ isHeader = true, isGifterPage, hideArrow, route, selectedShopId }) => {
  const { id } = route?.params || ''
  const { t } = useTranslation()
  const resId = id || selectedShopId


  const [selectedDrink, setSelectedDrink] = useState('');
  const [showList, setShowList] = useState(false);
  const [singleRestaurentData, setSingleRestaurentData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    getRestaurentItems()
  }, [])

  const getRestaurentItems = async () => {
    setIsLoader(true)
    try {
      const response = await fetchResaurentsItems(resId)
      if (response?.success) {
        setSingleRestaurentData(response?.data)
        if (response?.data?.sections?.length > 0) {
          setSelectedDrink(response.data.sections[0]);
          console.log('inSideFunction', response.data.sections[0])
        }
      }
    } catch (error) {
      console.log('shopDetail', error)
    } finally {
      setIsLoader(false)
    }
  }
  console.log('outSide', selectedDrink)

  const formate12Hours = (timeSlot) => {
    if (!timeSlot) return

    const [hour, minutes] = timeSlot?.split(':')
    const h = parseInt(hour)
    const m = minutes?.padStart(2, '0');
    const amPm = h >= 12 ? "PM" : "AM"
    const formatedHours = h % 12 || 12
    return `${formatedHours?.toString()?.padStart(2, '0')} : ${m} ${amPm}`
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedDrink(item)}
        style={[
          styles.innerDrinkBox,
          item?.product_section == selectedDrink?.product_section && styles.selectedDrinkBox,
        ]}
      >
        <CustomText
          style={[
            styles.drinkText,
            item?.product_section == selectedDrink?.product_section && styles.selectedDrinkText,
          ]}
        >
          {item?.product_section}
        </CustomText>
      </TouchableOpacity>
    );
  };


  return (
    <ScreenView
      scrollable={true}
      mh={true}
      style={!isHeader && styles.noHeaderPadding}
    >
      {isHeader && (
        <HeaderBox
          smallLogo={false}
          style={styles.headerBox}
          {...(showList && { onPressBack: () => setShowList(false) })}
        />
      )}
      {
        isLoader ?
          <ScreenLoader />
          :
          showList ? (
            <>
              <View style={styles.drinkListContainer}>
                <FlatList
                  data={singleRestaurentData?.sections}
                  keyExtractor={(item) => item?.id}
                  renderItem={renderItem}
                  horizontal
                  contentContainerStyle={styles.drinkContainer}
                  showsHorizontalScrollIndicator={false}
                />
                <View style={styles.drinkListDivider} />
              </View>
              <View style={styles.productListWrapper}>
                <ProductListing
                  data={selectedDrink?.product_section_items}
                  isGifterPage={isGifterPage}
                />
              </View>
            </>
          ) : (
            <View>
              <View style={styles.coverImageWrapper}>
                <RemoteImage
                  uri={`${mainUrl}${singleRestaurentData?.restaurant?.cover_image}`}
                  style={styles.coverImage}
                  isBorder={false}
                />
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.dragIndicator} />
                <CustomText style={styles.restaurantName}>
                  {singleRestaurentData?.restaurant?.name}
                </CustomText>
                <TouchableOpacity
                  style={styles.restaurantInfo}
                  onPress={() => setShowList(true)}
                  disabled={hideArrow}
                >
                  <View>
                    <CustomText style={styles.ratingText}>
                      <AntDesign name={'star'} size={12} color={colors.black} /> 4.7
                      (1666 ratings)
                    </CustomText>
                    <Subtitle style={styles.subtitle}>
                      Open Until {formate12Hours(singleRestaurentData?.restaurant?.closing_time)}
                    </Subtitle>
                    <Subtitle>Preparation time 15 mins</Subtitle>
                  </View>

                  <Ionicons
                    name={I18nManager.isRTL ? 'chevron-back-outline' : 'chevron-forward-outline'}
                    size={20}
                    color={colors.black}
                  />
                </TouchableOpacity>

                <CustomText style={styles.sectionTitle}>
                  {singleRestaurentData?.sections?.[0]?.product_section || t('unTitled')}
                </CustomText>
                <ProductListing
                  data={Array.isArray(singleRestaurentData?.sections) ? singleRestaurentData?.sections[0]?.product_section_items : []}
                  isGifterPage={isGifterPage}
                />
              </View>
            </View>
          )}
    </ScreenView>
  );
};

export default ShopDetail;

const styles = StyleSheet.create({
  noHeaderPadding: {
    paddingTop: 0,
  },
  headerBox: {
    paddingHorizontal: 20,
  },
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
  selectedDrinkBox: {
    borderColor: colors.primary,
    borderBottomWidth: 4,
  },
  drinkText: {
    fontSize: 14,
  },
  selectedDrinkText: {
    color: colors.black,
  },
  drinkListContainer: {
    marginHorizontal: -20,
  },
  drinkListDivider: {
    borderBottomWidth: 4,
    borderColor: colors.gray5,
    top: -28,
    zIndex: -100,
  },
  productListWrapper: {
    paddingHorizontal: 20,
  },
  coverImageWrapper: {
    marginTop: 8,
    marginBottom: 15,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    top: -40,
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingTop: 20,
  },
  dragIndicator: {
    height: 4,
    width: 80,
    backgroundColor: colors.gray5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 18,
    marginBottom: 20,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingText: {
    color: colors.black,
  },
  subtitle: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    marginTop: 30,
  },
});
