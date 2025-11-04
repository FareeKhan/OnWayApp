import { LogBox, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/Navigation/AppNavigation';
import { persistor, store } from './src/redux/store';
import { Provider } from 'react-redux';
import { fonts } from './src/constants/fonts';
import { colors } from './src/constants/colors';
import FlashMessage from 'react-native-flash-message';
import { PersistGate } from 'redux-persist/integration/react';
import CustomCarousel from './src/components/CustomCarousel';
import HomeScreen from './src/screens/HomeScreen';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_KEY } from './src/constants/data';


LogBox.ignoreAllLogs()
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <StripeProvider publishableKey={STRIPE_KEY}>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </StripeProvider>

      <FlashMessage position='top' floating={true}
        textProps={{
          style: {
            color: colors.white,
            fontFamily: fonts.black,
          },
        }}
      />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
