import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getSales } from '../../../redux/saleActions.js';
import FormSales from './FormSales/FormSales.jsx';


const Sales = () => {

    const sales = useSelector(state => state.sales.sales);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getSales());
    }, [dispatch]);

    return(
        <div>
            <div>
                <FormSales />
            </div>
            <div>
                <div>
                    <h1>HISTORIAL DE VENTAS</h1>
                    <button>Cambio</button>
                    <button>x</button>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha y hora</th>
                                <th>Orden</th>
                                <th>Cliente</th>
                                <th>Productos</th>
                                <th>Medio de pago</th>
                                <th>Descuento</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                    <tr key={sale._id}>
                                        <td>{sale.date}</td>
                                        <td>{sale.orderNumber}</td>
                                        <td>{sale.product}</td>
                                        {/* <td>{sale.sale}</td> */}
                                        <td>Desc. %</td>
                                        <td>{sale.totalAmount}</td>
                                        {/* <td>
                                            <Link to={`/main_window/detail/${sale._id}`}>
                                                <button>Detalle</button>
                                            </Link>
                                        </td> */}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Sales;