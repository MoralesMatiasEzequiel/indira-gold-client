import style from "./SalesHistory.module.css";
import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getSales } from '../../../../redux/saleActions.js';


const SalesHistory = () => {
    
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
            <div className={style.containerTitle}>
                <h2 className={style.title}>HISTORIAL DE VENTAS</h2>
            </div>
            <div className={style.containerTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha y hora</th>
                            <th>Orden <input type="number" name="orden" id="" placeholder="Buscar"/></th>
                            <th>Cliente <input type="text" name="client" id="" placeholder="Buscar"/></th>
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
    );
};

export default SalesHistory;