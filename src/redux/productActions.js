import axios from "axios";
import { getProductsReducer, getProductByIdReducer, filterByRoomsReducer, filterByTypeReducer, orderByPriceReducer, orderBySizeReducer } from "./productSlice";

export const getProducts = () => {
    return async (dispatch) => {
        const { data } = await axios.get("/house");
        dispatch(getProductsReducer(data));
    };
};

export const getProductById = (productId) => {
    return async (dispatch) =>{
            dispatch(getProductByIdReducer(productId));
    };
};

export const filterByRooms = (rooms) => {
    return async (dispatch) => {
        dispatch(filterByRoomsReducer(rooms));
    }
}

export const filterByType = (type) => {
    return async (dispatch) => {
        dispatch(filterByTypeReducer(type));
    }
}

export const orderByPrice = (order) => {
    return async (dispatch) => {
        dispatch(orderByPriceReducer(order));
    }
}

export const orderBySize = (order) => {
    return async (dispatch) => {
        dispatch(orderBySizeReducer(order));
    }
}