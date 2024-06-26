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