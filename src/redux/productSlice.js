import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        productsCopy: [],
        allProducts: [],
        productDetail: {},
        selectedProduct: [],
        soldProducts: [],
        topFiveProducts: [],
    },
    reducers: {
        getProductsReducer: (state, action) => {
            state.products = action.payload;
            state.productsCopy = action.payload;
        },
        getAllProductsReducer: (state, action) => {
            state.allProducts = action.payload;
            // state.productsCopy = action.payload; // esto va? cual es el criterio de cuando va y cuando no?
        },
        getProductByIdReducer: (state, action) => {
            state.productDetail = action.payload;            
        },
        getSoldProductsReducer: (state, action) => {
            state.soldProducts = action.payload;
        },
        getTopFiveProductsReducer: (state, action) => {
            state.topFiveProducts = action.payload;
        },
    }
});

export const { getProductsReducer, getAllProductsReducer, getProductByIdReducer, getSoldProductsReducer, getTopFiveProductsReducer } = productSlice.actions;

export default productSlice.reducer;