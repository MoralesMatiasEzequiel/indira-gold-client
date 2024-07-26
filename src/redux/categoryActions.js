import axios from "axios";
import { getCategoriesReducer, postCategoryReducer } from "./categorySlice";


export const getCategories = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/category");
        dispatch(getCategoriesReducer(data));
    };
};

export const postCategory = (categoryData) => {
    return async (dispatch) => {
        const { data } = await axios.post('/category', categoryData);
        dispatch(postCategoryReducer(data));
        return data;
    };
};