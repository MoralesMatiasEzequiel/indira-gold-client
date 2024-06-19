import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        productsCopy: [],
        selectedProduct: null
    },
    reducers: {
        getProductsReducer: (state, action) => {
            state.products = action.payload;
            state.productsCopy = action.payload;
        },
        getProductByIdReducer: (state, action) => {
            const productId = action.payload;
            state.selectedProduct = state.products.find(product => product._id === productId);
        },
    }
});

export const { getProductsReducer, getProductByIdReducer } = productSlice.actions;

export default productSlice.reducer;