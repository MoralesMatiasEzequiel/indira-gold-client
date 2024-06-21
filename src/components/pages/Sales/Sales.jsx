import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";


const Sales = () => {

    return(
        <div>
            <div>
                <h1>Ventas</h1>
            </div>
            <div>
                <h2>Nueva venta</h2>
            </div>
            <div>
                <span>Productos</span>
            </div>
            <div>
                <div>
                    <span>N° de orden</span>
                    <span>Total</span>
                </div>
                <label htmlFor="client">Cliente: </label>
                <input name="client" type="client" />
            </div>
        </div>
    );
};

export default Sales;