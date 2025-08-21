import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
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
import CustomInput from '../components/CustomInput';
import CountriesModal from '../components/CountriesModal';
import { Countries } from '../constants/data';
import ScreenView from '../components/ScreenView';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
const { height } = Dimensions.get('screen');

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation()

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(Countries[0]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenView scrollable={true} mh={true}>
        <Image
          source={require('../assets/loginScreen.png')}
          style={{ width: '100%', height: height / 2 }}
        />

        <View style={{ paddingHorizontal: 20 }}>
          <CustomText
            style={{
              fontSize: 18,
              marginVertical: 30,
              fontFamily: fonts.semiBold,
            }}
          >
            {t('usePhoneNumber')}
          </CustomText>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 8,
              gap: 10,
              marginBottom: 30,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              onPress={() => setModalVisible(true)}
            >
              <Image
                source={{ uri: selectedCountry?.flag }}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
              <CustomText>{selectedCountry?.countryCode}</CustomText>
              <Entypo
                name={'chevron-small-down'}
                size={20}
                color={colors.black}
              />
            </TouchableOpacity>
            <TextInput placeholder={t('phoneNumber')} style={{ width: '67%',color:colors.black,fontFamily:fonts.regular }} placeholderTextColor={colors.gray}/>
          </View>

          <CustomButton title={t('continue')} onPress={()=>navigation.navigate('VerificationScreen')} />
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

const styles = StyleSheet.create({});
