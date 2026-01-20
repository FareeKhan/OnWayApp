import {
  Alert,
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ScreenView from '../components/ScreenView';
import HeaderBox from '../components/HeaderBox';
import { useTranslation } from 'react-i18next';
import CustomCarousel from '../components/CustomCarousel';
import ShopsDataCard from '../components/ShopsDataCard';
import CustomButton from '../components/CustomButton';
import MapView, { Marker } from 'react-native-maps';
import { imageUrl, mainUrl, } from '../constants/data';
import CustomText from '../components/CustomText';
import Subtitle from '../components/Subtitle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import { fetchCategories, fetchResaurentsByCategory, NearByRest } from '../userServices/UserService';
import FastImage from 'react-native-fast-image';
import ScreenLoader from '../components/ScreenLoader';
import { getAddressFromCoordinates, locationPermission } from '../constants/helper';
import Geolocation from '@react-native-community/geolocation';
import EmptyData from '../components/EmptyData';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, addressData, removeAddress } from '../redux/addressData';
import MapViewComp from '../components/MapViewComp';

const { width, height } = Dimensions.get('screen');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const address = useSelector((item) => item?.addressData?.address)
  const userId = useSelector((state) => state?.auth?.loginData?.id)

  const mapRef = useRef(null);
  const [selectedView, setSelectedView] = useState('Home');
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [restaurantsByCategory, setRestaurantsByCategory] = useState([])
  const [restaurentLoader, setRestaurentLoader] = useState(false)
  // const [address, setAddress] = useState(false)
  const [isLoader, setIsLoader] = useState(false)
  const [search, setSearch] = useState('')
  const [nearByRestaurent, setNearByRestaurent] = useState([])
  const filterSearchCategories = search ? categoriesArray?.filter((item) => item?.name?.toLowerCase()?.includes(search?.toLowerCase())) : categoriesArray
  const cloneAddress = address?.find((item) => item?.userId == userId)

  const latitute = address[0]?.latitude || cloneAddress?.latitude
  const longitude = address[0]?.longitude || cloneAddress?.longitude
  const listViewData = nearByRestaurent?.length > 0 ? nearByRestaurent : restaurantsByCategory?.restaurants
  useEffect(() => {
    categoriesData()
    fetchUserCurrentLocation()
  }, [])

  const currentAddress = {
    latitude: longitude,
    longitude: longitude
  }

  // useEffect(() => {
  //   if (selectedView == 'MapView') {
  //     if (mapRef.current && nearByRestaurent?.length > 0 || restaurantsByCategory?.restaurants?.length > 0) {

  //       const selectArray = nearByRestaurent?.length > 0 ? nearByRestaurent : restaurantsByCategory?.restaurants



  //       const coordinates = selectArray.map(item => ({
  //         latitude: Number(item?.latitude),
  //         longitude: Number(item?.longitude),
  //       }));
  //       console.log('coordinatescoordinates',coordinates)


  //       mapRef.current.fitToCoordinates(coordinates, {
  //         edgePadding: {
  //           top: 80,
  //           right: 80,
  //           bottom: 300, // for bottom list overlay
  //           left: 80,
  //         },
  //         animated: true,
  //       });
  //     }
  //   }
  // }, [selectedView]);


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

  const fetchNearRestautents = async () => {
    if (!latitute || !longitude) {
      showMessage({
        type: 'danger',
        message: t('FirstAllow')
      })
      return
    }

    try {
      // const data = {
      //   lat: 25.18408708860248,
      //   lng: 55.26428819573816,
      // }

      const data = {
        lat: latitute,
        lng: longitude,
      }
      const result = await NearByRest(data);
      if (result?.success && result?.data?.data?.length != 0) {
        setNearByRestaurent(result?.data?.data)
        setSelectedView('ListView')

      } else {
        setNearByRestaurent([])
        showMessage({
          type: 'danger',
          message: t('noRestaurentsNearBy')
        })
      }
    } catch (e) {
      console.log(e);
    } finally {
      // setRestaurentLoader(false)
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
          ListEmptyComponent={<EmptyData style={{ height: 100 }} />}
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
            onPress={() => fetchNearRestautents()}
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
        {
          listViewData?.length == 0 ?
            <EmptyData />
            :
            <ShopsDataCard data={nearByRestaurent?.length > 0 ? nearByRestaurent : restaurantsByCategory?.restaurants} />
        }
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
            textTransform: "capitalize"

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

  // const MapViewComp = () => {
  //   return (
  //     <View style={styles.mapViewContainer}>
  //       <View style={styles.mapWrapper}>
  //         {/* <MapView
  //           initialRegion={{
  //             latitude: latitute || 25.2048,
  //             longitude: longitude || 55.2708,
  //             latitudeDelta: 0.0922,
  //             longitudeDelta: 0.0421,
  //           }}
  //           style={styles.map}
  //         /> */}
  //         <MapView
  //           ref={mapRef}
  //           style={styles.map}
  //           initialRegion={{
  //             latitude: Number(address?.latitude) || 25.2048,
  //             longitude: Number(address?.longitude) || 55.2708,
  //           }}
  //         >
  //           {restaurantsByCategory?.restaurants?.map((item, index) => (
  //             <Marker
  //               key={item.id || index}
  //               coordinate={{
  //                 latitude: item.latitude,
  //                 longitude: item.longitude,
  //               }}
  //               title={item.name}
  //               description={item.location}
  //             />
  //           ))}
  //         </MapView>
  //       </View>

  //       <View style={styles.mapListOverlay}>
  //         <FlatList
  //           data={nearByRestaurent?.length > 0 ? nearByRestaurent : restaurantsByCategory?.restaurants}
  //           keyExtractor={(_, index) => index?.toString()}
  //           renderItem={renderItem}
  //           contentContainerStyle={styles.horizontalList}
  //           horizontal
  //           showsHorizontalScrollIndicator={false}
  //         />
  //       </View>
  //     </View>
  //   );
  // };

  const fetchUserCurrentLocation = async () => {
    try {
      const result = await locationPermission()
      if (result == 'granted') {
        Geolocation.getCurrentPosition(async (position) => {
          const { longitude, latitude } = position.coords
          const addressData = await getAddressFromCoordinates(longitude, latitude)
          if (address?.length == 0) {
            dispatch(addAddress(addressData))
          }
        })
      }
      console.log('resualtae', result)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleEditAddress = () => {
    if (userId) {
      navigation.navigate('AddressScreen')

    } else {
      showMessage({
        type: "danger",
        message: t('PleaseLoginToEdit')
      })
    }
  }

  const handleMapListButton = (value) => {
    // setSelectedView(selectedView == 'ListView' ? 'MapView' : "ListView")
    // if (selectedView == 'MapView') {
    //   navigation.getParent()?.setOptions({
    //     tabBarStyle: 'none',
    //   });
    // }
    // navigation.getParent()?.setOptions({
    //   tabBarStyle: { display: 'flex' },
    // });
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    setSelectedView('MapView')

  }

  // if (isLoader) {
  //   return (
  //     <ScreenLoader />
  //   )
  // }


  return (
    <View style={[{ flex: 1 }, selectedView == "MapView" && { marginTop: -70 }]}>
      <ScreenView scrollable={true} mh={selectedView == 'MapView'}>
        <HeaderBox style={selectedView == 'MapView' && { paddingHorizontal: 20 }} onlyLogo={selectedView == 'Home'} onPressBack={() => { setNearByRestaurent([]), setSelectedView('Home') }} />

        <View style={[{ marginTop: 15 }, selectedView == 'MapView' && { marginHorizontal: 20 }]}>
          <CustomInput
            icon={true}
            placeholder={t('search')}
            value={search}
            onChangeText={setSearch}
            filter={true}

          />
        </View>

        {selectedView == 'Home' && (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 10, }}>
              <CustomText style={{ width: "90%" }}>
                {t('yourLocation')}: {address[0]?.formattedAddress || cloneAddress?.formattedAddress}
              </CustomText>


              {/* <TouchableOpacity onPress={() => navigation.navigate('AddressScreen')}> */}
              <TouchableOpacity onPress={() => handleEditAddress()}>



                <CustomText style={{ color: "green" }}>{t('edit')}</CustomText>
              </TouchableOpacity>
            </View>
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

      {selectedView == 'MapView' &&
        <MapViewComp
          data={nearByRestaurent?.length > 0 ? nearByRestaurent : restaurantsByCategory?.restaurants}
          setIsListingView={setSelectedView}
          currentAddress={currentAddress}
        />}
      <>
        {selectedView !== 'Home' && listViewData?.length > 0 && (
          <CustomButton
            // onPress={() => setSelectedView(selectedView == 'ListView' ? 'MapView' : "ListView")}
            onPress={handleMapListButton}
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
    textTransform: "capitalize"
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
