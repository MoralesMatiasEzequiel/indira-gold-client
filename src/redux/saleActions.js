import axios from "axios";
import { getSalesReducer, getSaleByIdReducer, clearSaleDetailReducer, getSalesOnlineReducer, getSalesLocalReducer, getSalesBalanceReducer } from "./saleSlice.js";


export const getSales = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/sale/active");
        dispatch(getSalesReducer(data));
    };
};

export const getSaleById = (saleId) => {
    return async (dispatch) =>{
        const { data } = await axios.get(`/sale/${saleId}`);
        dispatch(getSaleByIdReducer(data));
    };
};

export const clearSaleDetail = () => {
    return async (dispatch) => {
        dispatch(clearSaleDetailReducer());
    }
}

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

export const getMonthlySalesByClient = (id) => {
    return async () => {
        try {
            const { data } = await axios.get(`/sale/monthlyByClient/${id}`);
            return data;
        } catch (error) {
            return error.message;
        }
    }
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
    return async () => {
       
        const response = await axios.post('/sale', saleData);
        return response;
    };
};

export const putSale = (saleData) => {
    return async () => {
        const response = await axios.put('/sale', saleData);
        return response;
    }
}

export const deleteSale = (saleId) => {
    return async (dispatch) => {
        const { data } = await axios.put(`/sale/deactive/${saleId}`);
    }
}