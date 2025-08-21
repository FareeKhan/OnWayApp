import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ScreenView from '../components/ScreenView';
import HeaderWithAll from '../components/HeaderWithAll';
import { fonts } from '../constants/fonts';
import HeaderBox from '../components/HeaderBox';
import IconLabel from '../components/IconLabel';
import { useTranslation } from 'react-i18next';
import { colors } from '../constants/colors';
import { currency, SendingBalance, topUpBalance } from '../constants/data';
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import PaymentOptions from '../components/PaymentOptions';

const SendBalanceScreen = () => {
  const { t } = useTranslation();
  const [selectedPayment, setSelectedPayment] = useState(3);
    const [selectedBalace, setSelectedBalance] = useState('');
  
  const isAppleSelected = selectedPayment == 1;

  return (
    <ScreenView scrollable={true}>
      <HeaderBox smallLogo={false} notification={false} search={false} />
      <IconLabel label={'sendBalance'}/>

      {SendingBalance?.map((item, index) => {
        return (
          <TouchableOpacity onPress={()=>setSelectedBalance(item?.id)} key={index} style={[styles.amountBox,selectedBalace == item?.id && {borderColor:colors.cream}]}>
            <CustomText style={styles.amountText}>
             {currency} {item?.price}
            </CustomText>
           <Image source={require('../assets/cash.png')}  style={{width:80,height:65,transform:[{rotate:"-90deg"}]}}/>
          </TouchableOpacity>
        );
      })}

      <HeaderWithAll
        title={t('orAmount')}
        titleStyle={styles.orAmountTitle}
      />

      <CustomInput
        placeholder={t('50 AED')}
        rs={true}
        style={styles.customInput}
        filter={false}
      />

      <HeaderWithAll title={t('payWith')} />
      <PaymentOptions
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
      />

      <CustomButton
        appleIcon={isAppleSelected}
        title={isAppleSelected ? t('Pay') : t('payment')}
        btnTxtStyle={[styles.buttonText, isAppleSelected && styles.appleButtonText]}
        style={isAppleSelected && styles.appleButton}
      />
    </ScreenView>
  );
};

export default SendBalanceScreen;

const styles = StyleSheet.create({
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: colors.black,
    backgroundColor:colors.secondary,
  },
  amountText: {
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  pointsText: {
    fontSize: 16,
    color: colors.primary,
  },
  orAmountTitle: {
    fontFamily: fonts.regular,
    color: colors.primary,
  },
  customInput: {
    marginTop: -10,
    width:"100%",
    backgroundColor:"#fff"
  },
  buttonText: {
    fontSize: 16,
  },
  appleButtonText: {
    marginLeft: 3,
  },
  appleButton: {
    backgroundColor: colors.black,
  },
});
