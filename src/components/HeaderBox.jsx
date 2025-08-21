import {
  I18nManager,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useState } from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import CustomText from './CustomText';
import { fonts } from '../constants/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../constants/colors';
import { Countries } from '../constants/data';
import CustomModal from './CustomModal';
import DividerLine from './DividerLine';
import RNRestart from 'react-native-restart';
import { language } from '../redux/Auth';

const HeaderBox = ({ style, onPressBack, onlyLogo, smallLogo = true,fullWidth,heart,title,innerStyle }) => {
  const { t } = useTranslation();
const [isHeart,setIsHeart] = useState(false)
  const navigation = useNavigation();

  return (
    <View style={style}>
      {onlyLogo ? (
        <View style={{ margin: 'auto' }}>
          <Image
            resizeMode="contain"
            source={require('../assets/logo.png')}
            style={[{ height: 40, width: 100 }]}
          />
        </View>
      ) : (
        <View style={[styles.container,fullWidth && {width:"100%"},innerStyle]}>
          <TouchableOpacity
            onPress={onPressBack ? onPressBack : () => navigation.goBack()}
          >
            <Ionicons
              name={
                I18nManager.isRTL ? 'arrow-forward-sharp' : 'arrow-back-sharp'
              }
              color={colors.black}
              size={22}
            />
          </TouchableOpacity>






          {smallLogo && (
            <View>
              <Image
                resizeMode="contain"
                source={require('../assets/logo.png')}
                style={[styles.imgStyle]}
              />
            </View>
          )}

             {title && (
            <View>
             <CustomText style={{fontFamily:fonts.semiBold,fontSize:15}}>{title}</CustomText>
            </View>
          )}

         {
          heart && 
           <TouchableOpacity activeOpacity={0.5} onPress={()=>setIsHeart(!isHeart)} style={{backgroundColor:"#fff",width:30,height:30,alignItems:"center",justifyContent:"center",borderRadius:50}}>
            <FontAwesome name={isHeart ? 'heart' :'heart-o' } size={18} color={isHeart ? colors.red:colors.black}/>
          </TouchableOpacity>
         }
        </View>
      )}
    </View>
  );
};

export default HeaderBox;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '65%',
  },
  imgStyle: {
    height: 40,
    width: 100,
  },
});
