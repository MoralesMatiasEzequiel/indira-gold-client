import { configureStore } from "@reduxjs/toolkit";
import Products from "./productSlice.js";
import Clients from "./clientSlice.js";


export default configureStore({
    reducer:{
        products: Products,
        clients: Clients
    }
});