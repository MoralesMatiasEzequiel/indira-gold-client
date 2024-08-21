import axios from "axios";
import { getProductsReducer, getAllProductsReducer, getProductByIdReducer, getSoldProductsReducer, getTopFiveProductsReducer } from "./productSlice.js";

export const getProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products");
        dispatch(getProductsReducer(data));
    };
};

export const getAllProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products/all");        
        dispatch(getAllProductsReducer(data));
    };
};

export const getProductById = (productId) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/products/${productId}`);
            dispatch(getProductByIdReducer(data));
            return data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { error: { status: 404, message: 'Producto no encontrado' } };
            }
            throw error; // Si es otro tipo de error, lo lanza de nuevo
        }
    };
};

export const getProductByName = (productName) => {
    return async (dispatch) => {
        const { data } = await axios.get(`/products/all?name=${productName}&`);
        dispatch(getAllProductsReducer(data));
        // dispatch(getProductsReducer(data));
    };
};

export const getSoldProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products/sold");
        dispatch(getSoldProductsReducer(data));
    };
};

export const getTopFiveProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/products/rating");
        dispatch(getTopFiveProductsReducer(data));
    };
};

export const postProduct = (productData) => {
    return async (dispatch) => {     
        const response = await axios.post('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    };
};

export const putProduct = (productData) => {    
    return async (dispatch) => {     
        const response = await axios.put('/products', productData);
        return response;
    };
};

export const putProductStatus = (productId) => {    
    return async (dispatch) => {     
        const response = await axios.put(`/products/${productId}`);
        return response;
    };
};

export const reduceStock = (productData) => {
    return async () => {
        try {
            const { data } = await axios.put('/products/reduce', productData);
            return data;
        } catch (error) {
            return error.message;
        }
        
    };
};

export const increaseStock = (productData) => {
    return async () => {
        try {
            const { data } = await axios.put('/products/increase', productData);
            return data;
        } catch (error) {
            return error.message;
        }
        
    };
};

export const deleteProductById = (productId) => {
    return async (dispatch) =>{
        const { data } = await axios.delete(`/products/${productId}`);
    };
};