// import axios from "axios";
import axios from '../services/axios.js';
import { getSalesReducer, getSaleByIdReducer, clearSaleDetailReducer, getSalesOnlineReducer, getSalesOnlineLocalReducer, getSalesLocalReducer, getSalesBalanceReducer, getSalesByClientReducer, getSalesByOrderNumberReducer, deleteSaleReducer } from "./saleSlice.js";
// import { saveToIndexedDB, saveSalesToIndexedDB, getFromIndexedDB, getSalesFromIndexedDB, getFromIndexedDBById, savePendingRequest, saveSaleByIdToIndexedDB, getSaleByIdFromIndexedDB, processPendingRequests } from '../services/indexedDB.js';


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
            const { data } = await axios.get("/sale/active");
            
            dispatch(getSalesReducer(data));

        } catch (error) {
            console.error("Error retrieving sales from server: " + error.message);         
            return null;
        }
    };
};

// export const getSales = () => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get("/sale/active");
            
//             if (data) {
//                 dispatch(getSalesReducer(data));
//                 const key = 0;
//                 await saveSalesToIndexedDB('sales', data, key);
//             } else {
//                 console.log("No llegó data de GetSales");
//             };

//         } catch (error) {
//             // Intentar obtener los datos locales de IndexedDB como un respaldo
//             const { success, data: sales } = await getSalesFromIndexedDB('sales');
//             if (success && Array.isArray(sales) && sales.length > 0) {
//                 // Obtener la última posición del array
//                 const lastSale = sales[sales.length - 1];
//                 dispatch(getSalesReducer(lastSale)); // Despachar solo el último elemento
//                 return true;
//             } else {
//                 console.error("Error retrieving sales from IndexedDB.");
//             };

//             console.error("Error retrieving sales from server:", error.message);
//         }
//     };
// };

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

// export const getSaleById = (saleId) => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get(`/sale/${saleId}`);
//             if (data) {
//                 console.log("hay data");
//                 dispatch(getSaleByIdReducer(data));
//                 return Promise.resolve(); // Promesa resuelta si se obtiene la data
//             } else {
//                 console.log("no hay");
//                 return Promise.reject("No data received"); // Promesa rechazada si no hay datos
//             }
//         } catch (error) {
//             console.log(error.message);
//             return Promise.reject(error); // Promesa rechazada si hay un error
//         }
//     };
// };

//QE ondaa:
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

// export const getSalesOnline = () => {
//     return async (dispatch) => {
//         const { data } = await axios.get("/sale/online");
//         dispatch(getSalesOnlineReducer(data));
//     };
// };

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

// export const getSalesOnlineLocal = () => {
//     return async (dispatch) => {
//         dispatch(getSalesOnlineLocalReducer());
//     };
// };

// export const getSalesLocalLocal = () => {
//     return async (dispatch) => {
//         dispatch(getSalesLocalLocalReducer());
//     };
// };

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

// export const getSalesBalanceLocal = () => {
//     return async (dispatch) => {
//         dispatch(getSalesBalanceLocalReducer());
//     };
// };

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

// export const searchSales = (orderNumber, client) => {
//     return async (dispatch) => {
//         try {
//             let query = '/sale?';
//             if (orderNumber) {
//                 query += `orderNumber=${orderNumber}&`;
//             }
//             if (client) {
//                 query += `clientName=${client}&`;
//             }
//             const { data } = await axios.get(query);

//             if (data) {
//                 console.log("hay data");
//                 dispatch(getSalesReducer(data));
//                 return Promise.resolve();;
//             } else {
//                 console.log("no hay");
//                 return Promise.reject("No data received");
//             }
            
//         } catch (error) {
//         console.log(error.message);
//             return Promise.reject(error);
//         }
//     };
// };

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

// export const postSale = (saleData) => {
//     return async () => {
//         try {
//             const response = await axios.post('/sale', saleData);
//             return response;
//         } catch (error) {
//             console.error('Error en la solicitud de venta:', error);

//             // Guarda la solicitud como pendiente en indexedDB
//             const pendingRequest = {
//                 method: 'POST',
//                 url: '/sale',
//                 data: saleData,
//                 headers: { 'Content-Type': 'application/json' }
//             };

//             try {
//                 const saved = await savePendingRequest(pendingRequest);
//                 if (saved) {
//                     console.log('Solicitud guardada como pendiente.');
//                 }
//             } catch (saveError) {
//                 console.error('Error guardando solicitud como pendiente:', saveError);
//             }
//         }
//     };
// };

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

// export const putSale = (saleData) => {
//     return async () => {
//         try {
//             const response = await axios.put('/sale', saleData);
//             return response;            
//         } catch (error) {
//             console.error('Error en la solicitud de venta:', error);

//             const pendingRequest = {
//                 method: 'PUT',
//                 url: '/sale',
//                 data: saleData,
//                 headers: { 'Content-Type': 'application/json' }
//             };

//             try {
//                 const saved = await savePendingRequest(pendingRequest);
//                 if (saved) {
//                     console.log('Solicitud guardada como pendiente.');
//                 }
//             } catch (error) {
//                 console.error('Error guardando solicitud como pendiente:', saveError);
//             }
//         }
//     }
// };

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

// export const deleteSale = (saleId) => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.put(`/sale/deactive/${saleId}`);
//             dispatch(deleteSaleReducer(saleId));
//         } catch (error) {
//             console.error('Error en la solicitud de venta:', error);

//             const pendingRequest = {
//                 method: 'PUT',
//                 url: `/sale/deactive/${saleId}`,
//                 data: {},
//                 headers: { 'Content-Type': 'application/json' }
//             };

//             try {
//                 const saved = await savePendingRequest(pendingRequest);
//                 if (saved) {
//                     console.log('Solicitud guardada como pendiente.');
//                 }
//             } catch (saveError) {
//                 console.error('Error guardando solicitud como pendiente:', saveError);
//             };

//             // Actualizar el estado local
//             dispatch(deleteSaleReducer(saleId));
//             return Promise.reject(error);
//         };
//     };
// };