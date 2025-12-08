import { Alert, Platform } from "react-native"
import { request, PERMISSIONS } from 'react-native-permissions';
import { GOOGLE_API } from "./data";
import { getPaymentIntentApi } from "../userServices/UserService";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
import { showMessage } from "react-native-flash-message";

export const locationPermission = async () => {
    try {
        if (Platform.OS == 'ios') {
            const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            return result
        } else {
            const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            return result
        }
    } catch (error) {
        console.log('locationError', error)
    }
}

export const getAddressFromCoordinates = async (longitude, latitude) => {
    try {
        const apiKey = GOOGLE_API
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const data = await response.json();
        const address = data.results[0]?.formatted_address;
        return address

    } catch (error) {
        console.log('error', error)
    }
}



export const initializePaymentSheet = async (price,setLoading) => {
    const paymentIntent = await getPaymentIntentApi(price);
    console.log('showmeIntializeBalance',paymentIntent)

    if (!paymentIntent) {
      console.error("Failed to get payment intent");
      Alert.alert("Error", "Unable to initialize payment.");
      return;
    }

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "OnWay"
    });

    if (!error) {
    //   setLoading(true);
    } else {
      console.error("PaymentSheet Initialization Error:", error);
      Alert.alert("Error", error.message);
    }
  };


  export const openPaymentSheet = async (loading,processOrder) => {
    //   if (!loading) {
    //     Alert.alert("Error", "Payment sheet not initialized.");
    //     return;
    //   }
  
      const { error } = await presentPaymentSheet();
  
      if (error) {
        showMessage({
          type: "danger",
          message: error.message
        })
      } else {
        // Alert.alert("Payment Success", "Your payment is confirmed!");
        // Call MakeOrder API to confirm order after successful payment
        // onPressCash();
        processOrder()
      }
    };