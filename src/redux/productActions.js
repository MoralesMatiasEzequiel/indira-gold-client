import axios from "axios";
import { getProductsReducer, getProductByIdReducer } from "./productSlice.js";

export const getProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products");
        dispatch(getProductsReducer(data));
    };
};

export const getProductById = (productId) => {
    return async (dispatch) =>{
            dispatch(getProductByIdReducer(productId));
    };
};