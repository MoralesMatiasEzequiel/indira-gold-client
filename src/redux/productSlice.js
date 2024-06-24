import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        productsCopy: [],
        allProducts: [],
        productDetail: {},
        selectedProduct: []
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
            const productId = action.payload;
            state.productDetail = state.products.find(product => product._id === productId);
            // console.log(state.products);
        },
        // getProductByIdReducer: (state, action) => {
        //     const productId = action.payload;
        //     state.selectedProduct = state.products.find(product => product._id === productId);
        // },
    }
});

export const { getProductsReducer, getAllProductsReducer, getProductByIdReducer } = productSlice.actions;

export default productSlice.reducer;