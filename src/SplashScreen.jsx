import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from './constants/colors'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const SplashScreen = () => {
  const navigation = useNavigation()

    useEffect(() => {
    const timer = setTimeout(() => {
         navigation.replace('BottomNavigation')
    }, 1500);
    

    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} />
      <Image source={require('./assets/logo.png')} />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white
  }
})