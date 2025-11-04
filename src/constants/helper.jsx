import { Platform } from "react-native"
import { request, PERMISSIONS } from 'react-native-permissions';
import { GOOGLE_API } from "./data";

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