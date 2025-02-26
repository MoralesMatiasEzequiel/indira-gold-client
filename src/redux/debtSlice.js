import { createSlice } from "@reduxjs/toolkit";

export const debtSlice = createSlice({
    name: "debt",
    initialState: {
        allDebts: [],
        debts: [],
        debtsCopy: [],
        debtDetail: {},
    },
    reducers: {
        getDebtsReducer: (state, action) => {
            state.debts = action.payload;
            state.debtsCopy = action.payload;
        },
        getAllDebtsReducer: (state, action) => {
            state.allDebts = action.payload;
        },
        getDebtByIdReducer: (state, action) => {
            if(typeof action.payload === "string" || typeof action.payload === "number"){
                const debtFound = state.debtsCopy.find((debt) => debt._id === action.payload);
                state.debtDetail = debtFound;
            }else{
                state.debtDetail = action.payload;
            }
        },
        clearDebtDetailReducer: (state, action) => {
            state.debtDetail = {};
        },
    }
});

export const { getDebtsReducer, getAllDebtsReducer, getDebtByIdReducer, clearDebtDetailReducer } = debtSlice.actions;

export default debtSlice.reducer;