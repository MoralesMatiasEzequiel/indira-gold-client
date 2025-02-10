import { createSlice } from "@reduxjs/toolkit";

export const debtSlice = createSlice({
    name: "debt",
    initialState: {
        debts: [],
        debtsCopy: [],
        debtDetail: {},
    },
    reducers: {
        getDebtsReducer: (state, action) => {
            state.debts = action.payload;
            state.debtsCopy = action.payload;
        },
    }
});

export const { getDebtsReducer } = debtSlice.actions;

export default debtSlice.reducer;