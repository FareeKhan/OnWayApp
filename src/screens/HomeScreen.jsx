import {
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenView from '../components/ScreenView';
import HeaderBox from '../components/HeaderBox';
import { useTranslation } from 'react-i18next';
import CustomCarousel from '../components/CustomCarousel';
import ShopsDataCard from '../components/ShopsDataCard';
import CustomButton from '../components/CustomButton';
import MapView from 'react-native-maps';
import { catData, imageUrl, mainUrl, shopsData } from '../constants/data';
import CustomText from '../components/CustomText';
import Subtitle from '../components/Subtitle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import { fetchCategories, fetchResaurentsByCategory } from '../userServices/UserService';
import FastImage from 'react-native-fast-image';
import ScreenLoader from '../components/ScreenLoader';
import { getAddressFromCoordinates, locationPermission } from '../constants/helper';
import Geolocation from '@react-native-community/geolocation';
import EmptyData from '../components/EmptyData';

const { width, height } = Dimensions.get('screen');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState('Home');
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [restaurantsByCategory, setRestaurantsByCategory] = useState([])
  const [restaurentLoader, setRestaurentLoader] = useState(false)
  const [address, setAddress] = useState(false)
  const [isLoader, setIsLoader] = useState(false)
  const [search, setSearch] = useState('')
  const filterSearchCategories = search ? categoriesArray?.filter((item) => item?.name?.toLowerCase()?.includes(search?.toLowerCase())) : categoriesArray


  useEffect(() => {
    categoriesData()
    fetchUserCurrentLocation()
  }, [])

  // useEffect(() => {
  //   categoriesData()
  // }, [selectedView])

  const categoriesData = async () => {
    setIsLoader(true)
    try {
      const result = await fetchCategories();
      if (result?.success) {
        setCategoriesArray(result?.data)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoader(false)
    }
  };

  const resaurentsByCategory = async (id) => {
    try {
      setRestaurentLoader(true)
      const result = await fetchResaurentsByCategory(id);
      if (result?.success) {
        setRestaurantsByCategory(result?.data)
      }
    } catch (e) {
      console.log(e);
    } finally {
      setRestaurentLoader(false)
    }
  };

  const handleCategory = (id) => {
    setSelectedView('ListView')
    resaurentsByCategory(id)
  }
  const HomeView = () => {
    return (
      <View style={{ top: -20 }}>
        {
          search == '' &&
          <CustomCarousel />
        }
        <FlatList
          data={filterSearchCategories}
          keyExtractor={(item, index) => index?.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", }}
          contentContainerStyle={{ gap: 20, marginVertical: 20 }}
          ListEmptyComponent={<EmptyData />}
          renderItem={({ item, index }) => {
            const remotePath = `${imageUrl}${item?.image}`
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  onPress={() => handleCategory(item?.id)}
                  style={{
                    backgroundColor: colors.gray5,
                    height: 170,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    width: width / 2.3
                  }}
                >
                  <FastImage
                    source={{ uri: remotePath }}
                    style={{ width: 110, height: 90 }}
                    resizeMode='cover'
                  />
                  <CustomText>{item?.name}</CustomText>
                </TouchableOpacity>
              </View>
            )
          }}


        />

        {
          search == '' &&
          <TouchableOpacity
            onPress={() => setSelectedView('ListView')}
            style={{
              gap: 8,
              backgroundColor: colors.gray5,
              height: 170,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}
          >
            <Image
              source={require('../assets/google.png')}
              style={{ width: 110, height: 90 }}
            />
            <CustomText>Coffee Shops Near to you</CustomText>
          </TouchableOpacity>
        }



      </View>
    );
  };

  const ListView = () => {
    return (
      <View>
        <Subtitle style={{ fontSize: 13, marginTop: 25, marginBottom: 10 }}>
          {restaurantsByCategory?.category?.name}
        </Subtitle>
        <ShopsDataCard data={restaurantsByCategory?.restaurants} />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ShopDetail', {
          id: item?.restaurant_id ? item?.restaurant_id : item?.id,
        })}
        style={styles.shopCardWrapper}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: `${mainUrl}${item?.cover_image}` }}
          style={styles.shopImage}
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
        />

        <View style={styles.shopInfoContainer}>
          <View style={styles.shopLogoWrapper}>
            <Image
              source={{ uri: `${mainUrl}${item?.logo}` }}
              style={styles.shopLogo}
              borderRadius={50}
            />
          </View>

          <CustomText style={styles.shopName}>{item?.name}</CustomText>
          <Subtitle style={{
    textTransform:"capitalize"

          }}>{[...new Set(item?.location?.split(/\r?\n/).map(s => s.trim()))].join(", ")}</Subtitle>

          <View style={styles.servicesRow}>
            <View style={styles.serviceItem}>
              <MaterialIcons
                name={'wheelchair-pickup'}
                size={16}
                color={colors.gray}
              />
              <Subtitle>Pick up</Subtitle>
            </View>
            <View style={styles.serviceItem}>
              <MaterialIcons name={'handyman'} size={16} color={colors.gray} />
              <Subtitle>In Store</Subtitle>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const MapViewComp = () => {
    return (
      <View style={styles.mapViewContainer}>
        {/* <View style={styles.mapHeader}>
          <HeaderWithAll title={t('shopsNear')} style={{ marginTop: 30 }} />
        </View> */}

        <View style={styles.mapWrapper}>
          <MapView
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.map}
          />
        </View>

        <View style={styles.mapListOverlay}>
          <FlatList
            // data={shopsData}

            data={restaurantsByCategory?.restaurants}
            keyExtractor={(_, index) => index?.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.horizontalList}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  };


  const fetchUserCurrentLocation = async () => {
    try {
      const result = await locationPermission()
      if (result == 'granted') {
        Geolocation.getCurrentPosition((position) => {
          console.log('casduasd', position)
          const { longitude, latitude } = position.coords
          console.log('longitude, latitude ', longitude, latitude)
          const address = getAddressFromCoordinates(longitude, latitude)
          if (address) {
            setAddress(address)
          }
        })
      }
      console.log('resualtae', result)
    } catch (error) {
      console.log('error', error)
    }
  }



  if (isLoader) {
    return (
      <ScreenLoader />
    )
  }


  return (
    <View style={{ flex: 1 }}>
      <ScreenView scrollable={true} mh={selectedView == 'MapView'}>
        <HeaderBox style={selectedView == 'MapView' && { paddingHorizontal: 20 }} onlyLogo={selectedView == 'Home'} onPressBack={() => setSelectedView('Home')} />

        <View style={[{ marginTop: 15 }, selectedView == 'MapView' && { marginHorizontal: 20 }]}>
          <CustomInput
            icon={true}
            placeholder={t('search')}
            value={search}
            onChangeText={setSearch}

          />
        </View>

        {selectedView == 'Home' && (
          <>
            <CustomText style={{ marginTop: 20, marginBottom: 10 }}>
              {t('yourLocation')}: {address}
            </CustomText>

            <HomeView />

          </>
        )}

        {selectedView == 'ListView' &&
          <>
            {
              restaurentLoader ? <ScreenLoader /> : <ListView />
            }
          </>
        }
      </ScreenView>

      {selectedView == 'MapView' && <MapViewComp />}

      <>
        {selectedView !== 'Home' && (
          <CustomButton
            onPress={() => setSelectedView(selectedView == 'ListView' ? 'MapView' : "ListView")}
            title={selectedView == 'ListView' ? t('mapView') : t('listView')}
            style={[styles.bottomBtn, selectedView == 'MapView' && { width: "70%", height: 50 }]}
          />
        )}
      </>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchInput: { marginTop: 40, borderColor: colors.gray5 },

  shopCardWrapper: {},

  shopImage: { width: width / 2, height: 160 },

  shopInfoContainer: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.gray5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  shopLogoWrapper: {
    position: 'absolute',
    top: I18nManager.isRTL ? -20 : -25,
    left: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 50,
    zIndex: 100,
  },
  shopLogo: {
    width: 35,
    height: 35,
  },
  shopName: {
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform:"capitalize"
  },
  servicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mapViewContainer: {
  },
  mapHeader: {
    paddingHorizontal: 20,
  },
  mapWrapper: {
    marginHorizontal: -20,
    zIndex: -100,
  },
  map: {
    width: '100%',
    height: height / 1.5,
    zIndex: -100
  },
  mapListOverlay: {
    zIndex: 100,
    bottom: Platform.OS === 'ios' ? 100 : 100,
    position: 'absolute',
  },
  horizontalList: {
    gap: 15,
    paddingHorizontal: 20,
  },
  bottomBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    height: 35,
    width: '25%',
    borderRadius: 50,
  },

  broadBottomBtn: {
    position: 'absolute',
    alignSelf: 'center',
    width: '75%',
    borderRadius: 50,
    height: 50,
  },
});
