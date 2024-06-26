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