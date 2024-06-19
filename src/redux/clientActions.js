import axios from "axios";
import { getClientsReducer, geClientByIdReducer } from "./clientSlice.js";

export const getClients = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/clients");
        dispatch(getClientsReducer(data));
    };
};

export const getProductById = (clientId) => {
    return async (dispatch) =>{
            dispatch(geClientByIdReducer(clientId));
    };
};