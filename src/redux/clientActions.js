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
    };
};