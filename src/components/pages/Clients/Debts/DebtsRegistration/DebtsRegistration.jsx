import style from "./DebtsRegistration.module.css";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { getDebts, searchDebts } from "../../../../../redux/debtActions.js";
import detail from '../../../../../assets/img/detail.png';

const DebtRegistration = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        dispatch(getDebts());
    }, [dispatch]);

    const debts = useSelector(state => state.debts.debts);

    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('');
    const [loadedDebtIds, setLoadedDebtIds] = useState(new Set()); // Estado para rastrear IDs ya cargados
    const [currentPage, setCurrentPage] = useState(1);
    const [sortByDate, setSortByDate] = useState('asc');

    useEffect(() => {
        dispatch(searchDebts(orderNumber, client))
    }, [orderNumber, client, dispatch]);

    //--- FILTER DATE
    const toggleSortOrder = () => {
        setSortByDate(sortByDate === 'asc' ? 'desc' : 'asc');
    };

    const sortedDebts = [...debts].sort((a, b) => {
        const dateA = new Date(a.sale.date);
        const dateB = new Date(b.sale.date);
        return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const formatDate = (date) => {        
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            timeZone: 'UTC' 
        };

        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
    };

    //--- PAGINADO
    const itemsPerPage = 20;

    const paginatedDebts = sortedDebts.slice().reverse().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedDebts.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPageButtons = () => {
        const buttons = [];
        let startPage, endPage;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pageButton ${currentPage === i ? 'currentPage' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    //--- ORDER
    const handleChangeOrderNumber = (event) => {
        setOrderNumber(event.target.value);
        setCurrentPage(1);
    };

    //--- CLIENT
    const handleChangeClient = (event) => {
        setClient(event.target.value);
        setCurrentPage(1);
    };

    // useEffect(() => {
    //     paginatedDebts.forEach(debt => {
    //         if (!loadedDebtIds.has(debt._id)) { // Verifica si el ID ya fue cargado
    //             dispatch(getMonthlySalesByClient(debt._id))
    //                 .then(response => {
    //                     // Asegúrate de que response sea válido y tenga la propiedad totalProducts
    //                     const totalProducts = response?.totalProducts || 0; // Si no existe, asigna 0
    //                     setMonthlySales(prevState => ({
    //                         ...prevState,
    //                         [debt._id]: totalProducts
    //                     }));
    //                     setLoadedClientIds(prevIds => new Set(prevIds).add(debt._id)); // Agrega el ID al conjunto de IDs cargados
    //                 })
    //                 .catch(() => {
    //                     setMonthlySales(prevState => ({
    //                         ...prevState,
    //                         [debt._id]: "Datos no disponibles offline"
    //                     }));
    //                     setLoadedClientIds(prevIds => new Set(prevIds).add(debt._id)); // Agrega el ID al conjunto de IDs cargados
    //                 });;
    //         }
    //     });
    // }, [dispatch, paginatedClients, loadedDebtIds]);

    return(
        <div className="component">
            <div className="title">
                <h2>REGISTRO DE DEUDAS</h2>
                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        ◂
                    </button>
                    {getPageButtons()}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        ▸
                    </button>
                </div>
            </div>
            <div className="container">
                <div className="tableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <div className="withFilter">
                                        <span>Fecha y hora</span>
                                        <button className="sort" onClick={toggleSortOrder}>{sortByDate === 'asc' ? '▴' : '▾'}</button>
                                    </div>
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Orden</span>
                                        <input
                                            type="search"
                                            name="searchOrder"
                                            onChange={handleChangeOrderNumber}
                                            value={orderNumber}
                                            placeholder="Buscar"
                                            autoComplete="off"
                                            className="filterSearch"
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Cliente</span>
                                        <input
                                            type="search"
                                            name="searchClient"
                                            onChange={handleChangeClient}
                                            value={client}
                                            placeholder="Buscar"
                                            autoComplete="off"
                                            className="filterSearch"
                                        />
                                    </div>
                                </th>
                                <th>Pago</th>
                                <th>Saldo</th>
                                <th>Estado</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDebts?.map(debt => (
                                <tr key={debt._id} className={!debt.active ? style.inactive : ''}>
                                    <td>{formatDate(debt.sale.date)}</td>
                                    <td className="center">{debt.sale.orderNumber}</td>
                                    <td>{debt.sale.client ? `${debt.client.name} ${debt.client.lastname}` : 'Anónimo'}</td>
                                    <td>${debt.paymentMade}</td>
                                    <td>${debt.remainingBalance}</td>
                                    <td>{debt.active ? "En deuda" : "Saldado"}</td>
                                    <td>
                                        <div onClick={() => navigate(`/main_window/debts/${debt._id}`)}>
                                            <img src={detail} alt="" className="detailImg" />
                                        </div>
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

export default DebtRegistration;