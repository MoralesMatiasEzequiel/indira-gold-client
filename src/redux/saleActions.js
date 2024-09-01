import axios from "axios";
import { toast } from 'react-toastify';
import { saveToIndexedDB, saveSalesToIndexedDB, getFromIndexedDB, getSalesFromIndexedDB, getFromIndexedDBById, savePendingRequest, saveSaleByIdToIndexedDB, getSaleByIdFromIndexedDB, processPendingRequests } from '../services/indexedDB.js';
import { getSalesReducer, getSaleByIdReducer, clearSaleDetailReducer, getSalesOnlineReducer, getSalesLocalReducer, getSalesBalanceReducer, getSalesByClientReducer, getSalesByOrderNumberReducer } from "./saleSlice.js";

// const executeRequest = async (method, url, data = {}, headers = {}) => {
//     if (navigator.onLine) {
//         // Procesar solicitudes pendientes antes de realizar una nueva solicitud
//         await processPendingRequests();
//         // Ejecutar la solicitud actual
//         return await axios({ method, url, data, headers });
//     } else {
//         // Guardar la solicitud pendiente en IndexedDB
//         await savePendingRequest({ method, url, data, headers });
//         toast.warn('No hay conexión. La solicitud se procesará cuando la conexión esté disponible.');
//         return null;  // Retornar null o manejar según tus necesidades
//     }
// };


export const getSales = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/sale/active", { timeout: 3000 });
            
            if (data) {
                console.log("Llegó data de GetSales");
                dispatch(getSalesReducer(data));
                const key = 0;
                await saveSalesToIndexedDB('sales', data, key);
            } else {
                console.log("No llegó data de GetSales");
            }
        } catch (error) {
            console.error("Error retrieving sales from server:", error.message);

            // Intentar obtener los datos locales de IndexedDB como un respaldo
            const { success, data: sales } = await getSalesFromIndexedDB('sales');
            if (success && Array.isArray(sales) && sales.length > 0) {
                // Obtener la última posición del array
                const lastSale = sales[sales.length - 1];
                dispatch(getSalesReducer(lastSale)); // Despachar solo el último elemento
            } else {
                console.error("Error retrieving sales from IndexedDB.");
            }
        }
    };
};

export const getSaleById = (saleId) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/sale/${saleId}`, { timeout: 3000 });
            if (data) {
                console.log("hay data");
                dispatch(getSaleByIdReducer(data));
                return Promise.resolve(); // Promesa resuelta si se obtiene la data
            } else {
                console.log("no hay");
                return Promise.reject("No data received"); // Promesa rechazada si no hay datos
            }
        } catch (error) {
            console.log(error.message);
            return Promise.reject(error); // Promesa rechazada si hay un error
        }
    };
};

export const getSaleByIdLocal = (saleId) => {
    return async (dispatch) => {
        dispatch(getSaleByIdReducer(saleId));
    }
}

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
        try {
            let query = '/sale?';
            if (orderNumber) {
                query += `orderNumber=${orderNumber}&`;
            }
            if (client) {
                query += `clientName=${client}&`;
            }
            const { data } = await axios.get(query, { timeout: 1000 });

            if (data) {
                console.log("hay data");
                dispatch(getSalesReducer(data));
                return Promise.resolve();;
            } else {
                console.log("no hay");
                return Promise.reject("No data received");
            }
            
        } catch (error) {
            console.log(error.message);
            return Promise.reject(error);
        }
    };
};

export const getSalesByOrderNumber = (orderNumber) => {
    return async (dispatch) => {
        console.log(orderNumber);
        dispatch(getSalesByOrderNumberReducer(orderNumber));
    }
}

export const getSalesByClient = (client) => {
    return async (dispatch) => {
        dispatch(getSalesByClientReducer(client));
    }
}

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