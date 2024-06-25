import { configureStore } from "@reduxjs/toolkit";
import Products from "./productSlice.js";
import Clients from "./clientSlice.js";
import Sales from "./saleSlice.js";


export default configureStore({
    reducer:{
        products: Products,
        clients: Clients,
        sales: Sales
    }
});