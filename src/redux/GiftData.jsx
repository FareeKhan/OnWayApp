

import { createSlice } from "@reduxjs/toolkit";

export const GiftData = createSlice({
    name: 'GiftData',
    initialState: {
        giftProduct: null,
        totalPrice: '',
        subTotalPrice: null,
        isPromo: false,
        restaurentID: null,
        vehicleID: null
    },
    reducers: {
        addGiftProductToCart: (state, action) => {
            // console.log('---><<<>>',action.payload)
            // state.giftProduct = action.payload
            state.giftProduct = {
                ...state.giftProduct,   // old values
                ...action.payload       // new values
            };

            // const existId = state.giftProduct?.find((item) => item?.id == action.payload?.id)
            // if (!existId) {
            //     state.giftProduct.push(action.payload)
            // } else {
            //     existId.counter = action.payload?.counter
            //     existId.image = action.payload?.image
            // }

            // // ResaturentID
            // state.restaurentID = action.payload?.restaurantId

            // const finalPrice = state.giftProduct?.reduce((sum, item) => sum + (item?.total || 0))
            // state.totalPrice = finalPrice

            // state.subTotalPrice = finalPrice
        },
        incrementCounter: (state, action) => {
            if (!state.giftProduct) return;
                state.giftProduct.counter += 1;
                state.totalPrice = (state.giftProduct.counter * parseFloat(state.giftProduct.price || 0)).toFixed(2);
        },

        decrementCounter: (state, action) => {
 

            if (!state.giftProduct) return;

            if (state.giftProduct.counter === 1) {
                state.giftProduct = null; // remove product
                state.totalPrice = '';
            } else {
                state.giftProduct.counter -= 1;
                state.totalPrice = (state.giftProduct.counter * parseFloat(state.giftProduct.price || 0)).toFixed(2);
            }
        },
        handleTotalPrice: (state, action) => {
            state.totalPrice = action.payload
            console.log('aminaaBegin', state.totalPrice)
        },
        clearCart: (state) => {
            state.giftProduct = null;
            state.totalPrice = '';
            state.isPromo = false
        }

    }
});

export const { addGiftProductToCart, incrementCounter, decrementCounter, deleteProduct, handleTotalPrice, clearCart, handlePromo } = GiftData.actions;

export default GiftData.reducer;
