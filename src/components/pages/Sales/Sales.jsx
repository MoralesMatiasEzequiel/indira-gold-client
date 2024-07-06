import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import FormSales from './FormSales/FormSales.jsx';
import SalesHistory from './SalesHistory/SalesHistory.jsx';
import { getSales } from '../../../redux/saleActions.js';

const Sales = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSales());
    }, [dispatch]);
    
    return(
        <div className="page">
            <div>
                <FormSales />
            </div>
            <div>
                <SalesHistory />
            </div>      
        </div>
    );
};

export default Sales;