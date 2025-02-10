import axios from "axios";
import { getDebtsReducer } from "./debtSlice.js";

export const getDebts = () => {
    return async (dispatch) => {
        try {
            const { data } = await axios.get("/debt");
            console.log(data);
            
            dispatch(getDebtsReducer(data));

        } catch (error) {
            console.error("Error retrieving debt from server: ", error.message);
            return null;
        }
    };
};

export const postDebt = (debtData) => {
    return async (dispatch) => { 
        try {
            const response = await axios.post('/debt', debtData);
            return response;
        } catch (error) {
            console.error("Error creating debt: " + error.message);         
            return null;
        }    
    };
};

// export const deleteCategoryById = (categoryId) => {
//     return async (dispatch) =>{
//         const { data } = await axios.put(`/category/deactive/${categoryId}`);
//     };
// };