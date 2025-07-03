import style from "./FilteredSales.module.css";
import detail from '../../../../assets/img/detail.png';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { getSales, searchSales, getSalesByOrderNumber, getSalesByClient, filterSales, getSalesByMonthAndYear, getSalesBalanceByMonthAndYear } from '../../../../redux/saleActions.js';
import { getDebtsBalance } from "../../../../redux/debtActions.js";

const FilteredSales = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const sales = useSelector(state => state.sales.sales);
    const filteredSales = useSelector(state => state.sales.salesCopy);

    //--- BALANCES
    const salesBalanceMonthYear = useSelector(state => state.sales.salesBalanceMonthYear);
    const debtsBalanceMonthYear = useSelector(state => state.debts.debtsBalance);
    // console.log(debtsBalanceMonthYear);
    

    const [loading, setLoading] = useState(true);
    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('');
    const [sortByDate, setSortByDate] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const years = Array.from(new Set(sales?.map(sale => new Date(sale.date).getFullYear())))
        .sort((a, b) => b - a);

    const lastSaleDate = sales?.length > 0 ? new Date(sales[0].date) : new Date();
    const [selectedMonth, setSelectedMonth] = useState(lastSaleDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(lastSaleDate.getFullYear());
    
    useEffect(() => {
        if (sales.length > 0) {
            setLoading(true);
            const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)); // Orden descendente
            const lastSaleDate = new Date(sortedSales[0].date); // Última fecha disponible
    
            setSelectedMonth(lastSaleDate.getMonth());
            setSelectedYear(lastSaleDate.getFullYear());
    
            dispatch(getSalesBalanceByMonthAndYear(lastSaleDate.getMonth(), lastSaleDate.getFullYear()));
            dispatch(getDebtsBalance(lastSaleDate.getMonth(), lastSaleDate.getFullYear()));

            // Filtrar automáticamente por último mes y año
            // dispatch(filterSales(lastSaleDate.getMonth(), lastSaleDate.getFullYear()));
            dispatch(getSalesByMonthAndYear(lastSaleDate.getMonth(), lastSaleDate.getFullYear()))
            .then(() => setLoading(false)); // Desactivar loading después de cargar los datos

        }
    }, [sales, dispatch]);

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
        // dispatch(filterSales(value, selectedYear));
        dispatch(getSalesByMonthAndYear(value, selectedYear));
        dispatch(getSalesBalanceByMonthAndYear(value, selectedYear));
        dispatch(getDebtsBalance(value, selectedYear));
    };
    
    const handleYearChange = (value) => {
        setSelectedYear(value);
        // dispatch(filterSales(selectedMonth, value));
        dispatch(getSalesByMonthAndYear(selectedMonth, value));
        dispatch(getSalesBalanceByMonthAndYear(selectedMonth, value));
        dispatch(getDebtsBalance(selectedMonth, value));
    };

    useEffect(() => {
        dispatch(getSalesBalanceByMonthAndYear(selectedMonth, selectedYear));
        dispatch(getDebtsBalance(selectedMonth, selectedYear));
    }, [selectedMonth, selectedYear, dispatch]);

    const itemsPerPage = 20;

    useEffect(() => {
        dispatch(searchSales(orderNumber, client))
        .catch(() => {
            if(orderNumber){
                dispatch(getSalesByOrderNumber(orderNumber));
            }
            else if(client){
                dispatch(getSalesByClient(client));
            }
            else { dispatch(getSales()); }
        });

    }, [orderNumber, client, dispatch]);

    const handleChangeOrderNumber = (event) => {
        setOrderNumber(event.target.value);
        setCurrentPage(1);
    };

    const handleChangeClient = (event) => {
        setClient(event.target.value);
        setCurrentPage(1);
    };

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

    const sortedSales = [...filteredSales].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const paginatedSales = sortedSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedSales.length / itemsPerPage);

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

    const formatNumber = (number) => {
        if (number !== null && number !== undefined) {
            const rounded = Math.round(number); // redondea al entero más cercano
            return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return '0';
    };

    return (
        <div className="page">
            {loading ? (
                <div>Cargando</div>
            ) : (
                <div className="component">
                    <div className="title">
                        <h2>HISTORIAL DE VENTAS</h2>
                        <div className="pagination">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                ◂
                            </button>
                            {getPageButtons()}
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                ▸
                            </button>
                        </div>
                        <div>
                            <div className="custom-select-wrapper">
                                <select onChange={(event) => handleMonthChange(event.target.value)} value={selectedMonth}>
                                    {months?.map((month, index) => (
                                        <option key={index} value={index}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="custom-select-wrapper">
                                <select onChange={(event) => handleYearChange(event.target.value)} value={selectedYear}> 
                                    {years?.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        {filteredSales?.length > 0 ? 
                            <>
                                <div className="tableContainer">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className="withFilter">
                                                        <span>Fecha y hora</span>
                                                        <button className="sort" onClick={() => setSortByDate(sortByDate === 'asc' ? 'desc' : 'asc')}>{sortByDate === 'asc' ? '▴' : '▾'}</button>
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
                                                <th>Productos</th>
                                                <th>Medio de pago</th>
                                                <th>Descuento</th>
                                                <th>Total</th>
                                                <th>Detalle</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedSales?.map(sale => (
                                                <tr key={sale._id}>
                                                    <td>{formatDate(sale.date)}</td>
                                                    <td className="center">{sale.orderNumber}</td>
                                                    <td>{sale.client ? `${sale.client.name} ${sale.client.lastname}` : 'Anónimo'}</td>
                                                    <td className="center">{sale.products?.length}</td>
                                                    <td>{sale.paymentMethod}</td>
                                                    <td className="center">{sale.discount ? `${sale.discount}%` : '-'}</td>
                                                    <td className="center">$ {formatNumber(sale.totalPrice)}</td>
                                                    <td>
                                                        <a onClick={() => navigate(`/main_window/sales/${sale._id}`)}>
                                                            <img src={detail} alt="" className="detailImg" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </> : 
                            <div className={style.noSales}>
                                <p>No hay ventas registradas en esta fecha.</p>
                            </div>
                        }
                        <div className={style.total}>
                            <div className={style.totalContent}>Total de las ventas: <span>${formatNumber(salesBalanceMonthYear.totalSales)}</span></div>
                            <div className={style.totalContent}>Retenciones: <span>-${formatNumber(salesBalanceMonthYear.totalPaymentFee)}</span></div>
                            <div className={style.totalContent}>Pago de deudas: <span>${formatNumber(debtsBalanceMonthYear.totalAmount)}</span></div>
                            <div className={style.totalContent}>Deudas: <span>-${formatNumber(debtsBalanceMonthYear.totalDebts)}</span></div>
                            <div className={style.totalContent}>Total ingreso bruto: <span>${formatNumber((salesBalanceMonthYear.totalSales + debtsBalanceMonthYear.totalAmount - salesBalanceMonthYear.totalPaymentFee - debtsBalanceMonthYear.totalDebts) || 0)}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default FilteredSales;
