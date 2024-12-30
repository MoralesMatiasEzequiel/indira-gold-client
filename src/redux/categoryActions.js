import axios from "axios";
import { getCategoriesReducer, postCategoryReducer } from "./categorySlice";

export const getCategories = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/category");
            
            dispatch(getCategoriesReducer(data));

        } catch (error) {
            console.error("Error retrieving category from server: ", error.message);
            return null;
        }
    };
};

export const postCategory = (categoryData) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.post('/category', categoryData);

            dispatch(postCategoryReducer(data));

            return data;

        } catch (error) {
            console.error("Error creating category: ", error.message);
            return null;
        }
    };
};

export const deleteCategoryById = (categoryId) => {
    return async (dispatch) =>{
        const { data } = await axios.put(`/category/deactive/${categoryId}`);
    };
};