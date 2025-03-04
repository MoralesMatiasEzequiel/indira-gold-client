import axios from "axios";
import { getDebtsReducer, getAllDebtsReducer, getDebtByIdReducer, clearDebtDetailReducer, getDebtsBalanceReducer, createDebtSuccess } from "./debtSlice.js";

export const getDebts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/debt/all");
            
            dispatch(getAllDebtsReducer(data));

        } catch (error) {
            console.error("Error retrieving debt from server: ", error.message);
            return null;
        }
    };
};

export const getActiveDebts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/debt");
            
            dispatch(getDebtsReducer(data));

        } catch (error) {
            console.error("Error retrieving active debt from server: ", error.message);
            return null;
        }
    };
};

export const getDebtById = (debtId) => {
    return async (dispatch) =>{
        try {
            const { data } = await axios.get(`/debt/${debtId}`);

            dispatch(getDebtByIdReducer(data));
        
        } catch (error) {
            console.error("Error retrieving debt by server id: ", error.message);
            return null;
        }
    };
};

export const clearDebtDetail = () => {
    return async (dispatch) => {
        dispatch(clearDebtDetailReducer());
    }
};

export const searchDebts = (orderNumber, client) => {
    return async (dispatch) => {
        try {
            let query = '/debt?';
            if (orderNumber) {
                query += `orderNumber=${orderNumber}&`;
            }
            if (client) {
                query += `clientName=${client}&`;
            }
            
            const { data } = await axios.get(query);

            dispatch(getDebtsReducer(data));

        } catch (error) {
            console.error("Debts search error:", error.message);
            return null;
        }
    };
};

export const getDebtsBalance = (month, year) => {
    return async (dispatch) => {
        try {            
            const { data } = await axios.get(`/debt/filtered?month=${month}&year=${year}`);

            dispatch(getDebtsBalanceReducer(data));

        } catch (error) {
            console.error("Balance debts were not found. Error:", error.message);
            return null;
        }
    };
};

export const postDebt = (debtData) => {
    
    return async (dispatch) => { 
        try {
            const response = await axios.post('/debt', debtData);
            const debt = response.data; 
        
            dispatch(createDebtSuccess(debt)); 
            // return response;
        } catch (error) {
            console.error("Error creating debt: " + error.message);         
            return null;
        }    
    };
};

export const putDebt = (debtData) => {
    
    return async (dispatch) => { 
        try {
            const response = await axios.put('/debt', debtData);
            return response;
        } catch (error) {
            console.error("Error updated debt: " + error.message);         
            return null;
        }    
    };
};

export const putDebtAmount = (debtData) => {
    
    return async (dispatch) => { 
        try {
            const response = await axios.put('/debt/amount', debtData);
            return response;
        } catch (error) {
            console.error("Error updated amount debt: " + error.message);         
            return null;
        }    
    };
};

export const deleteDebt = (debtId) => {
    return async (dispatch) => {
        try {
        const { data } = await axios.put(`/debt/${debtId}`);
        return data;
    } catch (error) {
        console.error("Error updated status debt: " + error.message);         
        return null;
    }
    }
};