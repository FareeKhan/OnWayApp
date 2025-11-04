import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import CustomText from '../components/CustomText';
import { useTranslation } from 'react-i18next';
import Entypo from 'react-native-vector-icons/Entypo';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/colors';
import CountriesModal from '../components/CountriesModal';
import { Countries } from '../constants/data';
import ScreenView from '../components/ScreenView';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { loginPhoneNo } from '../userServices/UserService';
import { showMessage } from 'react-native-flash-message';
const { height } = Dimensions.get('screen');

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(Countries[0]);
  const [phoneNo, setPhoneNo] = useState('');
  const [isLoader, setIsLoader] = useState(false);

  const LoginPhone = async () => {
    if (phoneNo == '' || phoneNo?.length !== 9) {
      showMessage({
        message: (phoneNo?.length !== 9) ? t('noCorrect') : t('enterPhoneNo'),
        type: "danger",
      });
      return
    }
    const PhoneWithCountryCode = selectedCountry?.countryCode + phoneNo;
    try {
      setIsLoader(true)
      const result = await loginPhoneNo(PhoneWithCountryCode);
      if (result?.success) {

        showMessage({
          message: `Your OTP is ${result?.data?.otp}`,
          type: "success"
        })
        navigation.navigate('VerificationScreen', {
          phoneNo: PhoneWithCountryCode,
          otpCode: result?.data?.otp,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoader(false)
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenView scrollable={true} mh={true}>
        <Image
          source={require('../assets/loginScreen.png')}
          style={styles.loginImage}
        />

        <View style={styles.contentContainer}>
          <CustomText style={styles.titleText}>
            {t('usePhoneNumber')}
          </CustomText>

          <View style={styles.phoneInputContainer}>
            <TouchableOpacity
              style={styles.countrySelector}
              onPress={() => setModalVisible(true)}
            >
              <Image
                source={{ uri: selectedCountry?.flag }}
                style={styles.countryFlag}
                resizeMode="contain"
              />
              <CustomText>{selectedCountry?.countryCode}</CustomText>
              <Entypo
                name={'chevron-small-down'}
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>
            <TextInput
              placeholder={t('phoneNumber')}
              style={styles.phoneInput}
              placeholderTextColor={colors.gray}
              value={phoneNo}
              onChangeText={setPhoneNo}
              keyboardType='number-pad'
            />
          </View>

          <CustomButton
            title={t('continue')}
            onPress={LoginPhone}
            loader={isLoader}
          />
        </View>

        <CountriesModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setSelectedCountry={setSelectedCountry}
        />
      </ScreenView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loginImage: { width: '100%', height: height / 2 },
  contentContainer: { paddingHorizontal: 20 },
  titleText: {
    fontSize: 18,
    marginVertical: 30,
    fontFamily: fonts.semiBold,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 10,
    marginBottom: 30,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryFlag: { width: 30, height: 30 },
  phoneInput: {
    width: '67%',
    color: colors.black,
    fontFamily: fonts.regular,
  },
});
