import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AccountStack, GiftStack, HomeStack, WalletStack } from './StackNavigation';
import LoginScreen from '../screens/LoginScreen';
import VerificationScreen from '../screens/VerificationScreen';
import { useTranslation } from 'react-i18next';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import SplashScreen from '../SplashScreen';
import FavoriteScreen from '../screens/FavoriteScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AppNavigation = () => {
        const isLanguage = useSelector((state) => state.auth.isLanguage)

     useEffect(() => {
        i18next.changeLanguage(isLanguage)
    }, [isLanguage]);



  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});


export const BottomNavigation = () => {
    const { t } = useTranslation()

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: colors.black,
            tabBarInactiveTintColor: colors.gray,
            tabBarShowLabel: true, 
        }}>
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    tabBarLabel: t('home'),
                    tabBarLabelStyle: {
                        fontFamily: fonts.semiBold,
                    },
                    tabBarIcon: ({ focused }) => {
                        return (
                            <MaterialIcons name={'home'} size={30} color={focused ? colors.primary : colors.gray}  />
                        )
                    }
                }}

            />
       
            <Tab.Screen
                name="giftStack"
                component={GiftStack}
                options={{
                    tabBarLabel: t('giftss'),
                    tabBarLabelStyle: {
                        fontFamily: fonts.semiBold,
                    },
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons name={'gift-outline'} size={30} color={focused ? colors.primary : colors.gray} />
                        )
                    }
                }}
            />
            <Tab.Screen
                name="WalletStack"
                component={WalletStack}

                options={{
                    tabBarLabel: t('rewards'),
                    tabBarLabelStyle: {
                        fontFamily: fonts.semiBold,
                    },
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons name={'ribbon-outline'} size={30} color={focused ? colors.primary : colors.gray} />
                        )
                    }
                }}
            />

                    <Tab.Screen
                name="FavoriteScreen"
                component={FavoriteScreen}

                options={{
                    tabBarLabel: t('favorite'),
                    tabBarLabelStyle: {
                        fontFamily: fonts.semiBold,
                    },
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons name={'heart-outline'} size={30} color={focused ? colors.primary : colors.gray} />
                        )
                    }
                }}
            />



                 <Tab.Screen
                name="AccountStack"
                component={AccountStack}
                options={{
                    tabBarLabel: t('account'),
                    tabBarLabelStyle: {
                        fontFamily: fonts.semiBold,
                    },
                    tabBarIcon: ({ focused }) => {
                        return (
                                                <FontAwesome6 name={'user-large'} size={30} color={focused ? colors.primary : colors.gray} />

                        )
                    }
                }}

            />
        </Tab.Navigator>
    )
}