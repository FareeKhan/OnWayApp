import { createSlice } from "@reduxjs/toolkit";

export const addressData = createSlice({
    name: "addressData",
    initialState: {
        address: []
    },
    reducers: {
        addAddress: (state, action) => {
            // state.address.push({
            //     id: Date.now(),
            //     ...action.payload
            // });



            const index = state.address.findIndex(item => item.id === action.payload.id);

            if (index !== -1) {
                // Update existing address
                state.address[index] = {
                    ...state.address[index],
                    ...action.payload
                };
            } else {
                // Add new address
                state.address.push({
                    id: action.payload.id || Date.now(),
                    ...action.payload
                });
            }
        },
        deleteAddress: (state, action) => {
            const { id } = action.payload;
            state.address = state?.address.filter(item => item?.id !== id);
        },
        removeAddress: (state, action) => {
            state.address = []
        },
    }
})


export const { addAddress, deleteAddress, removeAddress } = addressData.actions

export default addressData.reducer