import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomModal from './CustomModal';
import { Countries } from '../constants/data';
import CustomText from './CustomText';
import { useTranslation } from 'react-i18next';
import { colors } from '../constants/colors';

const CountriesModal = ({setModalVisible,modalVisible,setSelectedCountry}) => {
    const {t} = useTranslation()
  return (
    <View>
        <CustomModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        title={t('selectLanguage')}
      >
        <View style={{ paddingBottom: 70 }}>
      
          {Countries?.map((item, index) => {
            return (
              <View 
                key={index}
                style={{paddingBottom:10}}
              >
             <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap:10,
                  borderBottomWidth:1,
                  borderColor:colors.gray5,
                  paddingBottom:10
                }}
                onPress={() => {
                  setSelectedCountry(item),
                 setModalVisible(false);
                }}
              >
                  <Image
                  source={{ uri: item?.flag }}
                  style={{ width: 60, height: 30 }}
                />
                <CustomText>{item?.name}</CustomText>
              
              </TouchableOpacity>
            
              </View>
            );
          })}
        </View>
      </CustomModal>
    </View>
  )
}

export default CountriesModal

const styles = StyleSheet.create({})