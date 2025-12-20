import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenView from '../components/ScreenView'
import HeaderBox from '../components/HeaderBox'
import CustomInput from '../components/CustomInput'
import CustomDropDown from '../components/CustomDropDown'
import { UAE_EMIRATES } from '../constants/data'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '../components/CustomButton'
import { getCoordinatesFromAddress } from '../constants/helper'
import { addAddress } from '../redux/addressData'
import { useNavigation } from '@react-navigation/native'

const AddressScreen = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const userData = useSelector((state) => state?.auth?.loginData)
    const address = useSelector((item) => item?.addressData?.address)
    const cloneAddress = address[0]

    const [emirates, setEmirates] = useState('')
    const [flat, setFlat] = useState('')
    const [street, setStreet] = useState('')
    const [area, setArea] = useState('')

    useEffect(() => {
        setArea(cloneAddress?.area)
        setFlat(cloneAddress?.buildingNumber)
        setEmirates(cloneAddress?.emirate)
        setStreet(cloneAddress?.street)
    }, [address])

    const handleAddress = async () => {
        try {
            const formattedAddress = `${flat} ${street}, ${area}, ${emirates}, UAE`;
            const coords = await getCoordinatesFromAddress(formattedAddress);
            if (coords?.latitude) {
                const manualAddress = {
                    id: cloneAddress?.id,
                    formattedAddress: `${flat} ${street}, ${area}, ${emirates}, UAE`,
                    buildingNumber: flat,
                    street: street,
                    area: area,
                    city: emirates,
                    emirate: emirates,
                    country: 'UAE',
                    postalCode: "00000",
                    userId: userData?.id,
                    latitude: coords?.latitude,
                    longitude: coords?.longitude,
                }
                dispatch(addAddress(manualAddress))
                navigation.goBack()
            }

        } catch (error) {
            console.log('error', error)
        }

    }


    return (
        <ScreenView>
            <HeaderBox style={{ marginBottom: 40 }} />

            <CustomInput
                placeholder={'flat'}
                label={'flat'}
                value={flat}
                onChangeText={setFlat}
            />

            <CustomInput
                placeholder={'street'}
                label={'street'}
                value={street}
                onChangeText={setStreet}
            />
            <CustomInput
                placeholder={'area'}
                label={'area'}
                value={area}
                onChangeText={setArea}
                style={{ marginBottom: -15 }}
            />

            <CustomDropDown
                title={'emirates'}
                data={UAE_EMIRATES}
                setValue={setEmirates}
                value={emirates}
            />

            <CustomInput
                placeholder={'phoneNumber'}
                label={'phoneNumber'}
                value={userData?.phoneNo}
            />

            <CustomButton title={'save'} onPress={() => handleAddress()} />


        </ScreenView>
    )
}

export default AddressScreen

const styles = StyleSheet.create({})