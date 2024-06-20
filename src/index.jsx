import * as React from 'react';
import ReactDOM from 'react-dom/client';
import axios from "axios";
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';


axios.defaults.baseURL = "http://localhost:3001/";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <BrowserRouter>
            <App/>
        </BrowserRouter>
);