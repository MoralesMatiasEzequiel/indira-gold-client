import axios from "axios";
import { saveToIndexedDB, saveClientsToIndexedDB, getFromIndexedDB, getClientsFromIndexedDB } from '../services/indexedDB.js';
import { getClientsReducer, getClientByIdReducer, clearClientDetailReducer, getClientsByDniReducer, getClientsByNameReducer, getClientsByLastnameReducer } from "./clientSlice.js";


export const getClients = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/clients");

            dispatch(getClientsReducer(data));

        } catch (error) {
            console.error("Error retrieving clients from server: ", error.message);
            return null;
        }
    };
};

// export const getClients = () => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get("/clients");
            
//             if (data) {
//                 dispatch(getClientsReducer(data));
//                 const key = 0;
//                 await saveClientsToIndexedDB('clients', data, key);
//             } else {
//                 console.log("No llegó data de GetClients");
//             };

//         } catch (error) {
//             // Intentar obtener los datos locales de IndexedDB como un respaldo
//             const { success, data: clients } = await getClientsFromIndexedDB('clients');
//             if (success && Array.isArray(clients) && clients.length > 0) {
//                 // Obtener la última posición del array
//                 const lastClients = clients[clients.length - 1];
//                 dispatch(getClientsReducer(lastClients)); // Despachar solo el último elemento
//                 return true;
//             } else {
//                 console.error("Error retrieving clients from IndexedDB.");
//             };

//             console.error("Error retrieving clients from server:", error.message);
//         }
//     };
// };

export const getClientById = (clientId) => {
    return async (dispatch) =>{
        try {
            const { data } = await axios.get(`/clients/${clientId}`);

            dispatch(getClientByIdReducer(data));
        
        } catch (error) {
            console.error("Error retrieving client by server id: ", error.message);
            return null;
        }
    };
};

// export const getClientById = (clientId) => {
//     return async (dispatch) =>{
//         try {
//             const { data } = await axios.get(`/clients/${clientId}`);
//             if (data) {
//                 console.log("hay data");
//                 dispatch(getClientByIdReducer(data));
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

export const getClientByIdLocal = (saleId) => {
    return async (dispatch) => {
        dispatch(getClientByIdReducer(saleId));
    }
};

export const clearClientDetail = () => {
    return async (dispatch) => {
        dispatch(clearClientDetailReducer());
    }
};

export const getClientByDni = (dni) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/clients?dni=${dni}&`);

            dispatch(getClientsReducer(data));

        } catch (error) {
            console.error("Error retrieving client by server dni: ", error.message);
            return null;
        }
        
    };
};

// export const getClientByDni = (dni) => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get(`/clients?dni=${dni}&`);
//             dispatch(getClientsReducer(data));
//         } catch (error) {
//             dispatch(getClientsByDniReducer(dni));
//         }
        
//     };
// };

export const getClientByName = (name) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/clients?name=${name}&`);

            dispatch(getClientsReducer(data));

        } catch (error) {
            console.error("Error retrieving client by server name: ", error.message);
            return null;
        }
        
    };
};

// export const getClientByName = (name) => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get(`/clients?name=${name}&`);
//             dispatch(getClientsReducer(data));
//         } catch (error) {
//             dispatch(getClientsByNameReducer(name));
//         }
        
//     };
// };

export const getClientByLastname = (lastname) => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get(`/clients?lastname=${lastname}&`);

            dispatch(getClientsReducer(data));

        } catch (error) {
            console.error("Error retrieving client by server lastname: ", error.message);
            return null;
        }
    };
};

// export const getClientByLastname = (lastname) => {
//     return async (dispatch) => {
//         try {
//             const { data } = await axios.get(`/clients?lastname=${lastname}&`);
//             dispatch(getClientsReducer(data));
//         } catch (error) {
//             dispatch(getClientsByLastnameReducer(lastname));
//         }
//     };
// };

export const postClient = (clientData) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/clients', clientData);

            return response.data;

        } catch (error) {
            console.error("Error creating a client: ", error.message);
            return null;
        }
    };
};

// export const postClient = (clientData) => {
//     return async (dispatch) => {
//         try {
//             const response = await axios.post('/clients', clientData);
//             return response.data;
//         } catch (error) {
//             if (error.response && error.response.status === 409) {
//                 return error.response.data.error;
//             } else {
//                 console.log('Otro error:', error.message);
//             }
//         }
//     };
// };

export const putClient = (clientData) => {    
    return async (dispatch) => {   
        try {
            const response = await axios.put('/clients', clientData);
            
            return response;

        } catch (error) {
            console.error("Error editing a client: ", error.message);
            return null;
        }  
    };
};

export const putAddProducts = (clientData) => {
    return async () => {
        try {
            const response = await axios.put('/clients', clientData);

            return response.data;

        } catch (error) {
            console.error("Error editing customer products: ", error.message);
            return null;
        }
    }
};

export const putRemovePurchases = (clientData) => {
    return async () => {
        try {
            const response = await axios.put('/clients/removePurchases', clientData);

            return response.data;

        } catch (error) {
            console.error("Error deleting sales from customer: ", error.message);
            return null;
        }
    }
};

export const deleteClient = (clientId) => {
    return async (dispatch) => {
        const { data } = await axios.put(`/clients/${clientId}`);
    }
};