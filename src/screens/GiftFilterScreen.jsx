import {
  Button,
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenView from '../components/ScreenView';
import { giftFilters, ImageBaseUrl, mainUrl, namesData } from '../constants/data';
import HeaderBox from '../components/HeaderBox';
import { useTranslation } from 'react-i18next';
import CustomText from '../components/CustomText';
import Subtitle from '../components/Subtitle';
import { colors } from '../constants/colors';
import HeaderWithAll from '../components/HeaderWithAll';
import ShopsDataCard from '../components/ShopsDataCard';
import ShopDetail from './ShopDetail';
import { fonts } from '../constants/fonts';
const { width } = Dimensions.get('screen');
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import SuggestedMsgsModal from '../components/SuggestedMsgsModal';
import CheckoutScreen from './CheckoutScreen';
import CartProducts from '../components/CartProducts';
import User1 from '../assets/svg/user1.svg';
import User2 from '../assets/svg/user2.svg';
import Gift1 from '../assets/svg/gift1.svg';
import Gift2 from '../assets/svg/gift2.svg';

import Theme1 from '../assets/svg/theme1.svg';
import Theme2 from '../assets/svg/theme2.svg';

import Pay1 from '../assets/svg/pay1.svg';
import Pay2 from '../assets/svg/pay2.svg';
import ContactPickerModal from '../components/ContactPickerModal';
import { fetchRestaurentList, fetchSuggestedMsgs, fetchTheme } from '../userServices/UserService';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { addGiftProductToCart } from '../redux/GiftData';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import SelectedReceiver from '../components/SelectedReceiver';





const GiftFilterScreen = ({ route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const giftData = giftFilters(t);
  // const resID = useSelector((state) => state?.giftInfo?.giftProduct?.item?.restaurant_id)
    const resID = useSelector((state) => state?.giftInfo?.giftProduct?.item?.id)
  const giftCart = useSelector((state) => state?.giftInfo?.giftProduct)
  const giftDataCart = useSelector((state) => state?.giftInfo?.giftProduct)

  const { thirdStepContinue } = route?.params || '';

  const [selectedFilter, setSelectedFilter] = useState(
    thirdStepContinue ? thirdStepContinue : [1],
  );
  const [selectedTheme, setSelectedTheme] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isContactPickerModal, setIsContactPickerModal] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState('');
  const [isSelectedShop, setIsSelectedShop] = useState(false);
  const [selectThemeCard, setSelectThemeCard] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allThemes, setAllThemes] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [manualNumber, setManualNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [suggestedMessages, setSuggestedMessages] = useState([]);

  useEffect(() => {
    restaurentData()
        loadSuggestedMsgs()
  }, [])

  const restaurentData = async () => {
    try {
      const result = await fetchRestaurentList()
      if (result?.success) {
        const uniqueRestaurants = Array.from(
          new Set(result?.data?.data.map(p => JSON.stringify(p.restaurant)))
        ).map(str => JSON.parse(str));
        setAllRestaurants(uniqueRestaurants)
      }
    } catch (error) {
      console.log('error', error)
    }
  }


    const loadSuggestedMsgs = async () => {
    try {
      const result = await fetchSuggestedMsgs(resID)
      if (result?.success) {
        setSuggestedMessages(result?.data)
      }
    } catch (ee) {
      console.log('ee', ee)
    }
  }

  const themeArray = async (id) => {
    console.log('ssssfaree',id)
    try {
      const result = await fetchTheme(id)
      console.log('showMeAllThemesdssasdasd', result?.data)
      if (result?.success) {
        setAllThemes(result?.data?.themes)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleFilterBox = clickedId => {
    const selectedIds = giftData
      .filter(item => item.id <= clickedId)
      .map(item => item.id);
    setSelectedFilter(selectedIds);
  };
  const renderIcon = (index, isSelected) => {
    switch (index) {
      case 0:
        return isSelected ? <Gift1 /> : <Gift2 />;
      case 1:
        return isSelected ? <User1 /> : <User2 />;
      case 2:
        return isSelected ? (
          <Theme1 colors={isSelected ? 'green' : 'black'} />
        ) : (
          <Theme2 colors={isSelected ? 'green' : 'black'} />
        );
      case 3:
        return isSelected ? (
          <Pay1 fill={isSelected ? 'green' : 'black'} />
        ) : (
          <Pay2 fill={isSelected ? 'green' : 'black'} />
        );
      default:
        return null;
    }
  };
  // Content Data Here
  const HorizontalFilterBox = () => {
    return (
      <View style={styles.filterBoxContainer}>
        {giftData?.map((item, index) => {
          const isSelected = selectedFilter.includes(item?.id);
          return (
            <View key={index} style={styles.filterItemContainer}>
              <TouchableOpacity onPress={() => handleFilterBox(item?.id)}>
                <View
                  style={[
                    styles.filterBox,
                    // isSelected && styles.filterBoxSelected,
                  ]}
                >
                  {renderIcon(index, isSelected)}
                </View>
                <Subtitle style={styles.filterSubtitle}>{item?.title}</Subtitle>
              </TouchableOpacity>
              {giftData?.length - 1 !== index && (
                <View style={styles.filterSeparator} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const handleThemeContinueBtn = () => {
    setSelectThemeCard(true)
    dispatch(addGiftProductToCart({ selectedTheme }))
  }
  console.log('allThemesallThemesallThemesallThemes',allThemes)

  const SelectCard = () => {
    return (
      <View>
        <HeaderWithAll title={t('selectTheme')} style={{ marginTop: 30 }} />
        <FlatList
          data={allThemes}
          keyExtractor={(item, index) => index?.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        <View style={{ flex: 1, justifyContent: 'flex-end', bottom: 50 }}>
          <CustomButton
            title={t('continue')}
            onPress={() => handleThemeContinueBtn()}
          />
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    const cleanUrl = `${mainUrl.replace(/\/+$/, '')}/${item?.image.replace(/^\/+/, '')}`;
    return (
      <TouchableOpacity
        onPress={() => setSelectedTheme(item)}
        key={index}
        style={{
          backgroundColor: colors.white,
          width: '48%',
          borderRadius: 20,
          borderWidth: 2,
          height: 200,
          borderColor: colors.primary,
        }}
      >
        {/* <View
          style={{
            width: '100%',
            height: 155,
            backgroundColor: colors.primary2,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        /> */}
        <FastImage
          source={{ uri: cleanUrl }}
          style={{
            width: '100%',
            height: 155,
            // backgroundColor: colors.primary2,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
        <CustomText
          style={{
            textAlign: 'center',
            marginTop: 12,
            fontFamily: fonts.semiBold,
            fontSize: 15,
            color: colors.primary,
          }}
        >
          {item?.name}
        </CustomText>

        {selectedTheme?.id == item?.id && (
          <View style={{ position: 'absolute', right: 10, top: 10 }}>
            <MaterialIcons
              name={'check-box'}
              size={30}
              color={colors.primary}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleRestaurent = (item) => {
    setSelectedShop(item?.id), setIsSelectedShop(true)
    dispatch(addGiftProductToCart({ item }))
  }

  const lastStep =
    selectedFilter.length > 0
      ? selectedFilter[selectedFilter.length - 1]
      : null;

  return (
    <ScreenView scrollable={true} mh={isSelectedShop}>
      <View style={isSelectedShop && { paddingHorizontal: 20 }}>
        <HeaderBox
          logo={true}
          {...(isSelectedShop && { onPressBack: () => setIsSelectedShop(false) })}
          {...(selectThemeCard && {
            onPressBack: () => setSelectThemeCard(false),
          })}
        />

        <HorizontalFilterBox />
      </View>

      {/* ***** Shop Card Data ****** */}
      {lastStep == 1 && (
        <>
          {isSelectedShop ? (
            <View style={{ marginTop: 15 }}>
              <ShopDetail
                // title={t('The Coffee Merchant')}
                isHeader={false}
                isGifterPage={true}
                hideArrow={true}
                selectedShopId={selectedShop}
              />
            </View>
          ) : (
            <>
              <Subtitle style={{ marginVertical: 20, fontSize: 13 }}>
                {t('selectShop')}
              </Subtitle>
              <ShopsDataCard
                data={allRestaurants}
                onPress={(item) => handleRestaurent(item)}
              />
            </>
          )}
        </>
      )}

      {lastStep == 2 && (
        <>
          <HeaderWithAll
            title={t('selectedReceiver')}
            style={{ marginTop: 30 }}
          />

          <SelectedReceiver
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            manualNumber={manualNumber}
            setManualNumber={setManualNumber}
            t={t}
            setIsContactPickerModal={setIsContactPickerModal}
          />

          <View
            style={{ flexGrow: 1, justifyContent: 'flex-end', marginTop: 30 }}
          >
            <CustomButton
              title={t('continueTheme')}
              onPress={() => {
                if (selectedContacts?.length == 0) {
                  showMessage({
                    type: "danger",
                    message: t('PleaseAddContact')
                  })
                  return
                }
                dispatch(addGiftProductToCart({ selectedContacts }))
                themeArray(resID)
                setSelectedFilter([1, 2, 3])
              }}
            />
          </View>
        </>
      )}
      {console.log('sadasdasd23424hey', ImageBaseUrl + giftCart?.selectedTheme?.image)}

      {lastStep == 3 && (
        <>
          {selectThemeCard ? (
            // <View>
            //   <HeaderWithAll
            //     title={t('cardPreview')}
            //     style={{ marginTop: 30 }}
            //   />

            //   <View
            //     style={{
            //       backgroundColor: colors.secondary,
            //       height: 170,
            //       borderRadius: 10,
            //       borderBottomLeftRadius: 0,
            //       padding: 30,
            //     }}
            //   >
            //     <CustomText
            //       style={{ color: colors.primary, fontFamily: fonts.medium }}
            //     >
            //       {t('yourGift')}
            //     </CustomText>
            //     <View
            //       style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
            //     >
            //       <CustomText
            //         style={{
            //           color: colors.primary,
            //           fontFamily: fonts.bold,
            //           fontSize: 15,
            //         }}
            //       >
            //         1 item from
            //       </CustomText>
            //       <CustomText
            //         style={{ color: colors.primary, fontFamily: fonts.medium }}
            //       >
            //         The Coffee Merchant
            //       </CustomText>
            //     </View>
            //   </View>

            //   {/* <HeaderWithAll
            //     title={t('yourName')}
            //     style={{ marginTop: 30, marginBottom: 5 }}
            //   />
            //   <CustomText style={{ marginBottom: 10 }}>
            //     {t('shownCard')}
            //   </CustomText> */}

            //   <CustomInput
            //     placeholder={t('ReceiptName')}
            //     filter={false}
            //     style={{
            //       width: '100%',
            //       backgroundColor: '#fff',
            //       marginTop: 15,
            //       borderWidth: 1,
            //       borderColor: 'black',
            //     }}
            //     name={cardName}
            //     onChangeText={setCardName}
            //   />


            //   <CustomInput
            //     placeholder={'haveAGoodDay'}
            //     filter={false}
            //     multiline
            //     inputExtraStyle={{
            //       height: 140,
            //       verticalAlign: 'top',
            //       paddingTop: 15,
            //     }}
            //     value={selectedMsg}
            //     onChangeText={setSelectedMsg}
            //     style={{
            //       width: '100%',
            //       backgroundColor: '#fff',
            //       borderWidth: 1,
            //       borderColor: 'black',
            //     }}
            //   />

            //   {/* <CustomText style={{ fontFamily: fonts.semiBold }}>OR</CustomText>

            //   <TouchableOpacity
            //     onPress={() => setModalVisible(true)}
            //     style={{
            //       backgroundColor: colors.secondary,
            //       paddingVertical: 10,
            //       paddingHorizontal: 20,
            //       borderRadius: 10,
            //       marginTop: 15,
            //       marginBottom: 30,
            //     }}
            //   >
            //     <CustomText style={{ fontFamily: fonts.medium }}>
            //       {t('suggestedMessages')}
            //     </CustomText>
            //     <Subtitle style={{ fontSize: 14 }}>
            //       {t('selectAmessage')}
            //     </Subtitle>
            //   </TouchableOpacity> */}

            //   <CustomButton
            //     title={t('continuePayment')}
            //     onPress={() => {
            //       if (cardName == '') {
            //         showMessage({
            //           type: "warning",
            //           message: t('enterReceiptName')
            //         })
            //         return
            //       }
            //       dispatch(addGiftProductToCart({ cardName, selectedMsg }))
            //       setSelectedFilter([1, 2, 3, 4])
            //     }}
            //   />
            // </View>


             <View>
                  <HeaderWithAll title={t('cardPreview')} style={{ marginTop: 30 }} />

                  <ImageBackground
                    source={{ uri: `${ImageBaseUrl}${selectedTheme?.image}` }}
                    style={{
                      backgroundColor: colors.secondary,
                      height: 220,
                      width: Dimensions.get('screen').width - 40,
                      overflow: "hidden",
                      borderRadius: 10,
                      borderBottomLeftRadius: 0,
                      padding: 30,
                    }}
                  >
                    <CustomText
                      style={{ color: colors.primary, fontFamily: fonts.medium }}
                    >
                      {t('yourGift')}
                    </CustomText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <CustomText
                        style={{
                          color: colors.primary,
                          fontFamily: fonts.bold,
                          fontSize: 15,
                        }}
                      >
                        {giftDataCart?.counter} {giftDataCart?.counter > 1 ? 'items' : 'item'} from
                      </CustomText>
                      <CustomText
                        style={{ color: colors.primary, fontFamily: fonts.medium }}
                      >
                        {giftDataCart?.item?.name}
                      </CustomText>
                    </View>
                  </ImageBackground>

                  <HeaderWithAll
                    title={t('recptName')}
                    style={{ marginTop: 30, marginBottom: 5 }}
                  />
                  <CustomText style={{ marginBottom: 10 }}>{t('shownCard')}</CustomText>

                  <CustomInput
                    placeholder={t('recptName')}
                    rs={true}
                    style={{
                      backgroundColor: colors.secondary,
                    }}
                    name={cardName}
                    onChangeText={setCardName}
                  />
                  {/* <HeaderWithAll
                    title={t('recptAddress')}
                    style={{ marginBottom: 5 }}
                  />
                  <CustomInput
                    placeholder={t('recptAddress')}
                    rs={true}
                    style={{
                      backgroundColor: colors.secondary,
                    }}
                    name={address}
                    onChangeText={setAddress}
                  /> */}

                  <HeaderWithAll title={t('addAMessage')} style={{ marginBottom: 6 }} />
                  <CustomInput
                    placeholder={'haveAGoodDay'}
                    rs={true}
                    multiline
                    style={{
                      backgroundColor: colors.secondary,
                      borderWidth: 0,
                      borderBottomWidth: 0,
                    }}
                    inputExtraStyle={{ height: 140, verticalAlign: "top", paddingTop: 15 }}
                    value={selectedMsg}
                    onChangeText={setSelectedMsg}
                  />

                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                      backgroundColor: colors.secondary,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 10,
                      marginTop: 15,
                      marginBottom: 30,
                    }}
                  >
                    <CustomText style={{ fontFamily: fonts.medium }} >
                      {t('suggestedMessages')}
                    </CustomText>
                    <Subtitle style={{ fontSize: 14 }}>{t('selectAmessage')}</Subtitle>
                  </TouchableOpacity>

                  <CustomButton title={t('continuePayment')}
                    // onPress={() => setSelectedFilter([1, 2, 3, 4])}

                    onPress={() => {
                      if (cardName == '') {
                        showMessage({
                          type: "warning",
                          message: t('enterReceiptName')
                        })
                        return
                      }
                      dispatch(addGiftProductToCart({ cardName, selectedMsg }))
                      setSelectedFilter([1, 2, 3, 4])
                    }}

                  />

                </View>
          ) : (
            <SelectCard />
          )}
        </>
      )}
      {console.log('giftCart', giftCart)}
      {lastStep == 4 && (
        <View style={{ marginHorizontal: -20 }}>
          {/* <CartProducts data={[giftCart !==null && giftCart]} isGift={true} /> */}
          <CartProducts data={giftCart ? [giftCart] : []} isGift={true} />

          <Image
            // source={require('../assets/giftCard.png')}
            source={giftCart?.selectedTheme?.image ? { uri: `${ImageBaseUrl}${giftCart?.selectedTheme?.image}` } : require('../assets/giftCard.png')}
            style={{ width: "90%", marginTop: 20, alignSelf: 'center', height: 200 }}
            borderRadius={10}
          />
          <CheckoutScreen isHeader={false} />
        </View>
      )}

      <SuggestedMsgsModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        setSelectedMsg={setSelectedMsg}
        data={suggestedMessages?.messages}

      />


      <ContactPickerModal
        setContactModal={setIsContactPickerModal}
        contactModal={isContactPickerModal}
        setSelectedContacts={setSelectedContacts}
        selectedContacts={selectedContacts}

      />
    </ScreenView>
  );
};

export default GiftFilterScreen;

const styles = StyleSheet.create({
  filterBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  filterItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBox: {
    // width: 45,
    // height: 44,
    // backgroundColor: colors.primary2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBoxSelected: {
    backgroundColor: colors.primary,
  },
  filterSubtitle: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 11,
  },
  filterSeparator: {
    width: width / 8,
    height: 1,
    backgroundColor: colors.primary1,
    top: -10,
  },
  namesContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  nameItem: {
    alignItems: 'center',
  },
  outerCircle: {
    marginTop: -5,
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    borderWidth: 1,
    width: 42,
    height: 42,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    fontSize: 18,
    fontFamily: fonts.medium,
  },
  minusButton: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 15,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    top: -3,
    right: 0,
  },
  minusIcon: {
    top: -3,
  },
  nameText: {
    marginTop: 5,
    fontSize: 11,
  },
});
