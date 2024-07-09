import axios from "axios";
import { getCategoriesReducer } from "./categorySlice";


export const getCategories = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/category");
        dispatch(getCategoriesReducer(data));
    };
};