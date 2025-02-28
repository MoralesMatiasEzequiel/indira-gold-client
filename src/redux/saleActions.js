import axios from '../services/axios.js';
import { getSalesReducer, getSaleByIdReducer, clearSaleDetailReducer, getSalesOnlineReducer, getSalesOnlineLocalReducer, getSalesLocalReducer, getSalesByClientReducer, getSalesByOrderNumberReducer, getSalesBalanceReducer, getCalculateSalesAnnualBalanceReducer, fetchSalesYearsReducer, deleteSaleReducer, filterSalesReducer, getSalesByMonthAndYearReducer, getSalesBalanceMonthYearReducer, calculateSalesBalanceReducer, calculateSalesAnnualBalanceReducer } from "./saleSlice.js";

export const getSales = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/sale/active");
            
            dispatch(getSalesReducer(data));

        } catch (error) {
            console.error("Error retrieving sales from server: " + error.message);         
            return null;
        }
    };
};

export const getSaleById = (saleId) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/sale/${saleId}`);

            dispatch(getSaleByIdReducer(data));

        } catch (error) {
            console.error("Error retrieving sales by server id:", error.message);
            return null;
        }
    };
};

export const getSaleByIdLocal = (saleId) => {
    return async (dispatch) => {
        dispatch(getSaleByIdReducer(saleId));
    }
};

export const clearSaleDetail = () => {
    return async (dispatch) => {
        dispatch(clearSaleDetailReducer());
    }
};

export const getSalesOnline = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/sale/online");

            dispatch(getSalesOnlineReducer(data));

        } catch (error) {
            console.error("Error retrieving online sales from the server:", error.message);
            return null;
        }
    };
};

export const getSalesLocal = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/sale/local");

            dispatch(getSalesLocalReducer(data));

        } catch (error) {
            console.error("Error retrieving local sales from the server:", error.message);
            return null;
        }
    };
};

export const getSalesBalance = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/sale/balance");

            dispatch(getSalesBalanceReducer(data));

        } catch (error) {
            console.error("Error retrieving sales balances from the server:", error.message);
            return null;
        }
    };
};

export const fetchSalesYears  = () => {
    return async (dispatch) => {
        dispatch(fetchSalesYearsReducer());
    }
};

export const calculateSalesBalance = () => {
    return async (dispatch) => {
        dispatch(calculateSalesBalanceReducer());
    }
};

export const calculateSalesAnnualBalance = (year) => {
    return async (dispatch) => {
        dispatch(calculateSalesAnnualBalanceReducer(year));
    }
};

export const getCalculateSalesAnnualBalance = (year) => {
    return async (dispatch) => {
        try {            
            const { data } = await axios.get(`/sale?year=${year}&`);

            dispatch(getCalculateSalesAnnualBalanceReducer(data));

        } catch (error) {
            console.error("Sales search error:", error.message);
            return null;
        }
    };
};

export const getMonthlySalesByClient = (id) => {
    return async () => {
        try {
            const { data } = await axios.get(`/sale/monthlyByClient/${id}`);

            return data;

        } catch (error) {
            console.error("Error retrieving monthly sales from the server:", error.message);
            return null;
        }
    }
};

export const searchSales = (orderNumber, client) => {
    return async (dispatch) => {
        try {
            let query = '/sale?';
            if (orderNumber) {
                query += `orderNumber=${orderNumber}&`;
            }
            if (client) {
                query += `clientName=${client}&`;
            }
            
            const { data } = await axios.get(query);

            dispatch(getSalesReducer(data));

        } catch (error) {
            console.error("Sales search error:", error.message);
            return null;
        }
    };
};

export const getSalesByOrderNumber = (orderNumber) => {
    return async (dispatch) => {
        dispatch(getSalesByOrderNumberReducer(orderNumber));
    }
};

export const getSalesByClient = (client) => {
    return async (dispatch) => {
        dispatch(getSalesByClientReducer(client));
    }
};

export const postSale = (saleData) => {
    return async () => {
        try {
            const response = await axios.post('/sale', saleData);

            return response;
            
        } catch (error) {
            console.error('Error creating a sale:', error.message);
            return null;
        }
    };
};

export const putSale = (saleData) => {
    return async () => {
        try {
            const response = await axios.put('/sale', saleData);

            return response;       

        } catch (error) {
            console.error('Error when editing a sale:', error);
            return null;
        }
    }
};

export const deleteSale = (saleId) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.put(`/sale/deactive/${saleId}`);

            dispatch(deleteSaleReducer(saleId));

        } catch (error) {
            console.error('Error deleting a sale:', error);
            return null;
        };
    };
};

export const filterSales = (month, year) => {
    return async (dispatch) => {

        const date = {
            month: month,
            year: year
        }

        dispatch(filterSalesReducer(date));
    }
};

export const getSalesByMonthAndYear = (month, year) => {
    return async (dispatch) => {
        try {            
            const { data } = await axios.get(`/sale/filtered?month=${month}&year=${year}`);

            dispatch(getSalesByMonthAndYearReducer(data));

        } catch (error) {
            console.error("Sales were not found. Error:", error.message);
            return null;
        }
    };
};

export const getSalesBalanceByMonthAndYear = (month, year) => {
    return async (dispatch) => {
        try {            
            const { data } = await axios.get(`/sale/balanceTotals?month=${month}&year=${year}`);

            dispatch(getSalesBalanceMonthYearReducer(data));

        } catch (error) {
            console.error("Sales balance month and year were not found. Error:", error.message);
            return null;
        }
    };
};

