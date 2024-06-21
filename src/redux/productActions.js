import axios from "axios";
import { getProductsReducer, getAllProductsReducer, getProductByIdReducer } from "./productSlice.js";

export const getProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products");
        dispatch(getProductsReducer(data));
    };
};

export const getAllProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products/all");
        console.log(data);
        dispatch(getAllProductsReducer(data));
    };
};

export const getProductById = (productId) => {
    return async (dispatch) =>{
            dispatch(getProductByIdReducer(productId));
    };
};