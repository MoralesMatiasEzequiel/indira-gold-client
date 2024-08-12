import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
    name: "client",
    initialState: {
        clients: [],
        clientsCopy: [],
        clientDetail: {},
        clientsName: [],
        clientsLastname: [],
    },
    reducers: {

        getClientsReducer: (state, action) => {
            state.clients = action.payload;
            state.clientsCopy = action.payload;
        },

        getClientByIdReducer: (state, action) => {
            state.clientDetail = action.payload;
        },

        clearClientDetailReducer: (state, action) => {
            state.clientDetail = {};
        }

        // getClientByNameReducer: (state, action) => {
        //     state.clientsName = action.payload;
        // },

        // getClientByLastnameReducer: (state, action) => {
        //     state.clientsLastname = action.payload;
        // },
    }
});

export const { getClientsReducer, getClientByIdReducer, clearClientDetailReducer, getClientByNameReducer, getClientByLastnameReducer } = clientSlice.actions;

export default clientSlice.reducer;