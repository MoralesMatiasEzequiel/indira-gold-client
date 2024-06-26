import { createSlice } from "@reduxjs/toolkit";

export const saleSlice = createSlice({
    name: "sale",
    initialState: {
        sales: [],
        salesCopy: [],
        saleDetail: {},
    },
    reducers: {
        getSalesReducer: (state, action) => {
            state.sales = action.payload;
            state.salesCopy = action.payload;
        },
        getSaleByIdReducer: (state, action) => {
            state.saleDetail = action.payload;
        },
    }
});

export const { getSalesReducer, getSaleByIdReducer } = saleSlice.actions;

export default saleSlice.reducer;