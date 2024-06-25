import axios from "axios";
import { getSalesReducer } from "./saleSlice.js";


export const getSales = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/sale");
        dispatch(getSalesReducer(data));
    };
};