import axios from "axios";
import { getSalesReducer, getSaleByIdReducer } from "./saleSlice.js";


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
    };
};