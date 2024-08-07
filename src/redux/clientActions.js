import axios from "axios";
import { getClientsReducer, getClientByIdReducer } from "./clientSlice.js";

export const getClients = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/clients");
        dispatch(getClientsReducer(data));
    };
};

export const getClientById = (clientId) => {
    return async (dispatch) =>{
        const { data } = await axios.get(`/clients/${clientId}`);
        dispatch(getClientByIdReducer(data));
    };
};

export const getClientByDni = (dni) => {
    return async (dispatch) => {
        const { data } = await axios.get(`/clients?dni=${dni}&`);
        dispatch(getClientsReducer(data));
    };
};

export const getClientByName = (name) => {
    return async (dispatch) => {
        const { data } = await axios.get(`/clients?name=${name}&`);
        dispatch(getClientsReducer(data));
    };
};

export const getClientByLastname = (lastname) => {
    return async (dispatch) => {
        const { data } = await axios.get(`/clients?lastname=${lastname}&`);
        dispatch(getClientsReducer(data));
    };
};

export const postClient = (clientData) => {
    return async (dispatch) => {
        const response = await axios.post('/clients', clientData);
        return response.data;
    };
};

export const putAddProducts = (clientData) => {
    return async () => {
        const response = await axios.put('/clients', clientData);
        return response.data;
    }
}

export const deleteClient = (clientId) => {
    return async (dispatch) => {
        const { data } = await axios.put(`/clients/${clientId}`);
    }
}