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

    const formatDate = (date) => { //Configuración de la fecha y hora. Para que se renderice: dd/mm/aaaa - hs:min
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
    };
    
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
                                        <td>{formatDate(sale.date)}</td>
                                        <td>{sale.orderNumber}</td>
                                        <td>{sale.client ? `${sale.client.name} ${sale.client.lastname}` : 'Anónimo'}</td>
                                        <td>{sale.products.length}</td>
                                        <td>{sale.paymentMethod}</td>
                                        {/* <td>{sale.paymentMethod.join(', ')}</td> */}
                                        <td>{sale.discount ? `${sale.discount}%` : '-'}</td>
                                        <td>$ {sale.totalPrice}</td>
                                        <td>
                                            <Link to={`/main_window/sales/${sale._id}`}>
                                                <button>Detalle</button>
                                            </Link>
                                        </td>
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

/* <td>{new Date(sale.date).toLocaleString()}</td> */


/* <td>
    {sale.products.map(product => (
        <div key={product._id}>
            {product.name}
        </div>
    ))}
</td> */