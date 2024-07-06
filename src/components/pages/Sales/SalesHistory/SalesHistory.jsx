import style from "./SalesHistory.module.css";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { searchSales } from '../../../../redux/saleActions.js';
import detail from './img/detail.png';


const SalesHistory = () => {
    
    const sales = useSelector(state => state.sales.sales);
    const dispatch = useDispatch();

    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('');
    const [sortByDate, setSortByDate] = useState('desc');
    

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

    const toggleSortOrder = () => {
        // Función para cambiar el orden de la fecha
        setSortByDate(sortByDate === 'asc' ? 'desc' : 'asc');
    };

    const sortedSales = [...sales].sort((a, b) => {
        // Función para ordenar las ventas por fecha
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return(
        <div className="component">
            <div className="title">
                <h2>HISTORIAL DE VENTAS</h2>
            </div>
            <div className="container">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha y hora <button className={style.buttonDate} onClick={toggleSortOrder}>{sortByDate === 'asc' ? '▴' : '▾'}</button></th>
                            <th>
                                <div className={style.thOrderClient}>
                                    <span className={style.spanOrderClient}>Orden</span>
                                    <input type="search"name="searchOrder" onChange={handleChangeOrderNumber} value={orderNumber} placeholder="Buscar" autoComplete="off" className={style.orderInput} 
                                    />
                                </div>
                            </th>
                            <th>
                                <div className={style.thOrderClient}>
                                    <span className={style.spanOrderClient}>Cliente</span>
                                    <input type="search"name="searchClient" onChange={handleChangeClient} value={client} placeholder="Buscar" autoComplete="off" className={style.orderInput} 
                                    />
                                </div>
                            </th>
                            <th>Productos</th>
                            <th>Medio de pago</th>
                            <th>Descuento</th>
                            <th>Total</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sortedSales.map(sale => (
                            <tr key={sale._id}>
                                <td className={style.dataNumber}>{formatDate(sale.date)}</td>
                                <td className={style.dataNumber}>{sale.orderNumber}</td>
                                <td>{sale.client ? `${sale.client.name} ${sale.client.lastname}` : 'Anónimo'}</td>
                                <td className={style.dataNumber}>{sale.products.length}</td>
                                <td>{sale.paymentMethod}</td>
                                <td className={style.dataNumber}>{sale.discount ? `${sale.discount}%` : '-'}</td>
                                <td className={style.dataNumber}>$ {sale.totalPrice}</td>
                                <td>
                                    <Link to={`/main_window/sales/${sale._id}`}>
                                        <img src={detail} alt=""/>
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

// {sales.map(sale => (
//     <tr key={sale._id}>
//         <td className={style.dataNumber}>{formatDate(sale.date)}</td>
//         <td className={style.dataNumber}>{sale.orderNumber}</td>
//         <td>{sale.client ? `${sale.client.name} ${sale.client.lastname}` : 'Anónimo'}</td>
//         <td className={style.dataNumber}>{sale.products.length}</td>
//         <td>{sale.paymentMethod}</td>
//         {/* <td>{sale.paymentMethod.join(', ')}</td> */}
//         <td className={style.dataNumber}>{sale.discount ? `${sale.discount}%` : '-'}</td>
//         <td className={style.dataNumber}>$ {sale.totalPrice}</td>
//         <td>
//             <Link to={`/main_window/sales/${sale._id}`}>
//                 <button>Detalle</button>
//             </Link>
//         </td>
//     </tr>
// ))}