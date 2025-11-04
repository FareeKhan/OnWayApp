import {
  ActivityIndicator,
  I18nManager,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../constants/colors';
import CustomText from './CustomText';
import { fonts } from '../constants/fonts';
import Octicons from 'react-native-vector-icons/Octicons';
import Filter from '../assets/svg/Adjust.svg'

const CustomInput = ({
  label,
  placeholder,

  icon,
  isApply,
  promoLoader,
  discountAmount,
  onPressApply,
  countryCode,
  shadow,
  filter = true,
  inputExtraStyle,
  style,
  value,
  onChangeText,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <View style={{}}>
      {label && <CustomText style={styles.label}>{t(label)}</CustomText>}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 17 }}>
        <View
          style={[
            styles.container,
            true && {
              marginBottom: 0,
              width: "90%",
              backgroundColor: colors.gray5
            },
            style,
          ]}
        >
          {icon && (
            <AntDesign name={'search1'} color={colors.gray3} size={20} />
          )}
          <TextInput
            placeholder={t(placeholder)}
            placeholderTextColor={colors.gray1}
            value={value}
            onChangeText={onChangeText}
            style={[
              styles.inputStyle,
              icon && { width: '90%' },
              inputExtraStyle,
            ]}
            {...props}
          />
        </View>
        {filter && <TouchableOpacity>
          <Filter />
        </TouchableOpacity>}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderColor: colors.gray5,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    backgroundColor: colors.white,
    elevation: 6,
    shadowRadius: 4.65,
  },
  inputStyle: {
    color: colors.black,
    width: '90%',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: fonts.regular,
    height: 45,
  },
  label: {
    color: colors.black,
    fontFamily: fonts.medium,
    marginBottom: 8,
    textAlign: 'left',
  },
  roundStyle: {
    borderWidth: 1.5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
