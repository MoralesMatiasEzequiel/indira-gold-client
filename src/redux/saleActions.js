import axios from "axios";
import { getSalesReducer, getSaleByIdReducer, getSalesOnlineReducer, getSalesLocalReducer, getSalesBalanceReducer } from "./saleSlice.js";


export const getSales = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/sale");
        dispatch(getSalesReducer(data));
    };
};

export const getSaleById = (saleId) => {
    return async (dispatch) =>{
        const { data } = await axios.get(`/sale/${saleId}`);
        dispatch(getSaleByIdReducer(data));
    };
};

export const getSalesOnline = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/sale/online");
        dispatch(getSalesOnlineReducer(data));
    };
};

export const getSalesLocal = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/sale/local");
        dispatch(getSalesLocalReducer(data));
    };
};

export const getSalesBalance = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/sale/balance");
        dispatch(getSalesBalanceReducer(data));
    };
};

export const searchSales = (orderNumber, client) => {
    return async (dispatch) => {
        let query = '/sale?';
        if (orderNumber) {
            query += `orderNumber=${orderNumber}&`;
        }
        if (client) {
            query += `clientName=${client}&`;
        }
        const { data } = await axios.get(query);
        dispatch(getSalesReducer(data));
    };
};

export const postSale = (saleData) => {
    return async (dispatch) => {
       
        const response = await axios.post('/sale', saleData);
        return response;
    };
};