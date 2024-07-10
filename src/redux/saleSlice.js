import { createSlice } from "@reduxjs/toolkit";

export const saleSlice = createSlice({
    name: "sale",
    initialState: {
        sales: [],
        salesCopy: [],
        saleDetail: {},
        salesOnline: [],
        salesLocal: [],
        salesBalance: {}
    },
    reducers: {
        getSalesReducer: (state, action) => {
            state.sales = action.payload;
            state.salesCopy = action.payload;
        },
        getSaleByIdReducer: (state, action) => {
            state.saleDetail = action.payload;
        },
        getSalesOnlineReducer: (state, action) => {
            state.salesOnline = action.payload;
        },
        getSalesLocalReducer: (state, action) => {
            state.salesLocal = action.payload;
        },
        getSalesBalanceReducer: (state, action) => {
            state.salesBalance = action.payload;
        },
    }
});

export const { getSalesReducer, getSaleByIdReducer, getSalesOnlineReducer, getSalesLocalReducer, getSalesBalanceReducer } = saleSlice.actions;

export default saleSlice.reducer;