import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
    name: "client",
    initialState: {
        clients: [],
        clientsCopy: [],
    },
    reducers: {

        getClientsReducer: (state, action) => {
            state.clients = action.payload;
            state.clientsCopy = action.payload;
        },

        getClientByIdReducer: (state, action) => {
            const clientId = action.payload;
            state.selectedProduct = state.clients.find(client => client._id === clientId);
        }
    }
});

export const { getClientsReducer, geClientByIdReducer } = clientSlice.actions;

export default clientSlice.reducer;