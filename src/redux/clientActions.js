import axios from "axios";
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