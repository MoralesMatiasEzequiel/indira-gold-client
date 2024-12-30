import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { getSales, searchSales, getSalesByOrderNumber, getSalesByClient, filterSales } from '../../../../redux/saleActions.js';
import detail from '../../../../assets/img/detail.png';

const FilteredSales = () => {
    const sales = useSelector(state => state.sales.sales);
    const filteredSales = useSelector(state => state.sales.salesCopy);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [orderNumber, setOrderNumber] = useState('');
    const [client, setClient] = useState('');
    const [sortByDate, setSortByDate] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const years = Array.from(new Set(sales.map(sale => new Date(sale.date).getFullYear())))
        .sort((a, b) => b - a);
    const months = Array.from(new Set(sales.map(sale => monthNames[new Date(sale.date).getMonth()]))).reverse();

    const lastSaleDate = sales.length > 0 ? new Date(sales[0].date) : new Date();
    const [selectedMonth, setSelectedMonth] = useState(lastSaleDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(lastSaleDate.getFullYear());
    
    useEffect(() => {
        if (sales.length > 0) {
            const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)); // Orden descendente
            const lastSaleDate = new Date(sortedSales[0].date); // Última fecha disponible
    
            setSelectedMonth(lastSaleDate.getMonth());
            setSelectedYear(lastSaleDate.getFullYear());
    
            // Filtrar automáticamente por último mes y año
            dispatch(filterSales(lastSaleDate.getMonth(), lastSaleDate.getFullYear()));
        }
    }, [sales, dispatch]);

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
        dispatch(filterSales(value, selectedYear));
    };
    
    const handleYearChange = (value) => {
        setSelectedYear(value);
        dispatch(filterSales(selectedMonth, value));
    };

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
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
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

        console.log(selectedMonth, selectedYear);
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
        return number.toLocaleString('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    return (
        <div className="page">
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
                    <select onChange={(event) => handleMonthChange(event.target.value)}>
                        {months?.map((month, index) => (
                            <option key={index} value={monthNames.indexOf(month)}>
                                {month}
                            </option>
                        ))}
                    </select>
                        <select onChange={(event) => handleYearChange(event.target.value)}>
                            {years?.map((year, index) => (
                                <option key={index} value={year}>{year}</option>
                            ))}
                        </select>
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
                                {paginatedSales.map(sale => (
                                    <tr key={sale._id}>
                                        <td>{formatDate(sale.date)}</td>
                                        <td className="center">{sale.orderNumber}</td>
                                        <td>{sale.client ? `${sale.client.name} ${sale.client.lastname}` : 'Anónimo'}</td>
                                        <td className="center">{sale.products.length}</td>
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
                </div>
            </div>
        </div>

    );
};

export default FilteredSales;
