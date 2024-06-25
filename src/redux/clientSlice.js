import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
    name: "client",
    initialState: {
        clients: [],
        clientsCopy: [],
        clientDetail: {}
    },
    reducers: {

        getClientsReducer: (state, action) => {
            state.clients = action.payload;
            state.clientsCopy = action.payload;
        },

        getClientByIdReducer: (state, action) => {
            state.clientDetail = action.payload;
        },
    }
});

export const { getClientsReducer, getClientByIdReducer } = clientSlice.actions;

export default clientSlice.reducer;