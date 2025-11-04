import axios from "axios";
import { baseUrl } from "../constants/data";


export const loginPhoneNo = async (phoneNo) => {
    const data = JSON.stringify({ phone_number: phoneNo })
    try {
        const response = await axios.post(
            `${baseUrl}customer/generate-otp`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};

export const verifyOtp = async (phoneNo, otp) => {
    const data = JSON.stringify({
        "phone_number": phoneNo,
        "otp": otp
    })
    try {
        const response = await axios.post(
            `${baseUrl}customer/verify-otp`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};

// export const bannerData = async () => {
//     try {
//         const response = await axios.get(
//             `${baseUrl}customer/verify-otp`,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Accept: 'application/json',
//                 },
//             }
//         );
//         return response.data;
//     } catch (e) {
//         console.log(e?.response?.data || e.message);
//     }
// };

export const fetchCategories = async () => {
    try {
        const response = await axios.get(
            `${baseUrl}categories?is_active=true`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};


export const fetchBanners = async () => {
    try {
        const response = await axios.get(
            `${baseUrl}banners`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};



export const fetchResaurentsByCategory = async (id) => {
    try {
        const response = await axios.get(
            `${baseUrl}categories/${id}/items`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};

export const fetchResaurentsItems = async (id) => {
    console.log('sasdasdasd', `${baseUrl}restaurants/${id}/items`)
    try {
        const response = await axios.get(
            `${baseUrl}restaurants/${id}/items`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};


export const fetchProductDetails = async (id) => {
    try {
        const response = await axios.get(
            `${baseUrl}items/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};


export const fetchSuggestedMsgs = async (id) => {
    try {
        const response = await axios.get(
            `${baseUrl}restaurants/${id}/suggested-messages`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};


export const fetchRestaurentList = async (id) => {
    try {
        const response = await axios.get(
            `${baseUrl}items`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};



// export const makeOrder = async (data, token) => {
//     console.log('datadata',data)
//     const postData = JSON.stringify({
//         "restaurant_id": 3,
//         "vehicle_id": 5,
//         "order_type": "standard",
//         "items": data,
//         "payment_type": "card",
//         "subtotal": 25.98,
//         "delivery_fee": 0,
//         "service_fee": 2,
//         "total": 27.98,
//         "customer_phone": "+1234567890",
//         "special_instructions": "consequatur",
//         "gift_from": "consequatur",
//         "gift_message": "consequatur",
//         "gift_theme": "consequatur"
//     })
//     try {
//         const response = await axios.post(
//             `${baseUrl}orders`,
//             postData,
//             {
//                 headers: {
//                     Accept: 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (e) {
//         console.log(e?.response?.data || e.message);
//     }
// };

// ***************** ORDER APIS

export const makeOrder = async (data, resID, token, driverNote, selectedCarId, subTotal) => {
    console.log('datadata', driverNote);

    const array = data?.map((item, index) => ({
        ...item,
        item_id: item?.id,
        name: item?.title,
        quantity: item?.counter,
    }))

    const postData = {
        restaurant_id: resID,
        vehicle_id: selectedCarId,
        order_type: "standard",
        items: array,
        payment_type: "card",
        subtotal: subTotal || 0,
        delivery_fee: 0,
        service_fee: 2,
        total: subTotal || 0,
        special_instructions: driverNote,
        customer_phone: "+1234567890",
        special_instructions: "consequatur",
        gift_from: "consequatur",
        gift_message: "consequatur",
        gift_theme: "consequatur"
    };
    try {
        const response = await axios.post(
            `${baseUrl}orders`,
            postData,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json', // ✅ important
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};

export const fetchOrder = async (token) => {
    try {
        const response = await axios.get(
            `${baseUrl}orders`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
}


export const getPaymentIntentApi = async (amount) => {
    const data = JSON.stringify({ amount: amount })
    try {
        const response = await axios.post(`${baseUrl}payment/create-intent`,
            data,
            {
                headers: {
                    'Content-Type': "application/json",
                    Accept: 'application/json'
                },
            }
        )
        return response.data?.data?.client_secret
    } catch (error) {
        console.log('error', error)
    }
}





// ***************** GIFT APIS
export const fetchSentGifts = async (token) => {
    try {
        const response = await axios.get(
            `${baseUrl}gifts/sent`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};

export const fetchReceivedGifts = async (token) => {
    try {
        const response = await axios.get(
            `${baseUrl}gifts/sent`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};







// ***************** VEHICLE APIS
export const addVehicle = async (data, token) => {
    const { carCategory, carName, plateNo } = data
    const formData = new FormData()
    formData.append("brand", carName)
    formData.append("model", carCategory)
    formData.append("plate_number", plateNo)
    formData.append("category", carCategory)

    try {
        const response = await axios.post(
            `${baseUrl}vehicles`,
            formData,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};


export const fetchVehicles = async (token) => {
    try {
        const response = await axios.get(
            `${baseUrl}vehicles`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};


export const deleteVehicles = async (id, token) => {
    try {
        const response = await axios.delete(
            `${baseUrl}vehicles/${id}`,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (e) {
        console.log(e?.response?.data || e.message);
    }
};