import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        categoriesCopy: [],
    },
    reducers: {
        getCategoriesReducer: (state, action) => {
            state.categories = action.payload;
            state.categoriesCopy = action.payload;
        }
    }
});

export const { getCategoriesReducer } = categorySlice.actions;

export default categorySlice.reducer;