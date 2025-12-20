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

// export const getAddressFromCoordinates = async (longitude, latitude) => {
//     try {
//         const apiKey = GOOGLE_API
//         const response = await fetch(
//             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
//         );
//         const data = await response.json();
//         const address = data.results[0]?.formatted_address;
//         console.log('sss0',data)
//         return address

//     } catch (error) {
//         console.log('error', error)
//     }
// }




export const getAddressFromCoordinates = async (longitude, latitude) => {
  try {
    const apiKey = GOOGLE_API;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    const data = await response.json();
    const result = data.results?.[0];

    if (!result) return null;

    const components = result.address_components;

    const get = (type) =>
      components.find(c => c.types.includes(type))?.long_name || '';

    return {
      formattedAddress: result.formatted_address,

      emirate: get('administrative_area_level_1'),
      city: get('locality'),
      area: get('sublocality') || get('neighborhood'),
      street: get('route'),
      buildingNumber: get('street_number'),
      country: get('country'),
      postalCode: get('postal_code'),

      latitude,
      longitude,
    };

  } catch (error) {
    console.log('error', error);
    return null;
  }
};


export const getCoordinatesFromAddress = async (address) => {
  const apiKey = GOOGLE_API; // your Google API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results?.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      return null; // address not found
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}


export const initializePaymentSheet = async (price, setLoading) => {
  const paymentIntent = await getPaymentIntentApi(price);
  console.log('showmeIntializeBalance', paymentIntent)

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


export const openPaymentSheet = async (loading, processOrder) => {
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