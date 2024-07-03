import style from "./SalesHistory.module.css";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getSales, searchSales } from '../../../../redux/saleActions.js';


const SalesHistory = () => {
    
    const sales = useSelector(state => state.sales.sales);
    const dispatch = useDispatch();

    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('');
    
    useEffect(() => {
        dispatch(getSales());
    }, [dispatch]);

    useEffect(() => {
        dispatch(searchSales(orderNumber, client));
    }, [orderNumber, client, dispatch]);

    const handleChangeOrderNumber = (event) => {
        setOrderNumber(event.target.value);
    };

    const handleChangeClient = (event) => {
        setClient(event.target.value);
    };

    //Configuración de la fecha y hora. Para que se renderice: dd/mm/aaaa - hs:min
    const formatDate = (date) => { 
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
                            <th>Orden <input type="search" name="searchOrder" onChange={handleChangeOrderNumber} value={orderNumber} placeholder="Buscar" autoComplete="off"/></th>
                            <th>Cliente <input type="search" name="searchClient" onChange={handleChangeClient} value={client} placeholder="Buscar" autoComplete="off"/></th>
                            <th>Productos</th>
                            <th>Medio de pago</th>
                            <th>Descuento</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(sale => (
                            <tr key={sale._id}>
                                <td className={style.dataNumber}>{formatDate(sale.date)}</td>
                                <td className={style.dataNumber}>{sale.orderNumber}</td>
                                <td>{sale.client ? `${sale.client.name} ${sale.client.lastname}` : 'Anónimo'}</td>
                                <td className={style.dataNumber}>{sale.products.length}</td>
                                <td>{sale.paymentMethod}</td>
                                {/* <td>{sale.paymentMethod.join(', ')}</td> */}
                                <td className={style.dataNumber}>{sale.discount ? `${sale.discount}%` : '-'}</td>
                                <td className={style.dataNumber}>$ {sale.totalPrice}</td>
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