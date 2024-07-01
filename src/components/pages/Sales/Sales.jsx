import React from 'react';
import FormSales from './FormSales/FormSales.jsx';
import SalesHistory from './SalesHistory/SalesHistory.jsx';


const Sales = () => {

    return(
        <div>
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