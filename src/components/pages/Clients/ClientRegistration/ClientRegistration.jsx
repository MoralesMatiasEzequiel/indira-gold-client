import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getClientByName, getClientByLastname, getClientByDni, getClients } from "../../../../redux/clientActions.js";
import detail from '../../../../assets/img/detail.png';
import style from "./ClientRegistration.module.css";

const ClientRegistration = () => {

    const clients = useSelector(state => state.clients.clients);
    const dispatch = useDispatch();

    const [dni, setDni] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    const paginatedClients = clients.slice().reverse().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(clients.length / itemsPerPage);


    useEffect(() => {
        dispatch(getClients());
    }, [dispatch])

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

    const handleChangeDni = (event) => {
        setDni(event.target.value);
    };

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangeLastname = (event) => {
        setLastname(event.target.value);
    };

    useEffect(() => {
        if (dni) {
            dispatch(getClientByDni(dni));
        } else {
            dispatch(getClientByName('')); 
        }
    }, [dni, dispatch]);

    useEffect(() => {
        if (name) {
            dispatch(getClientByName(name));
        } else {
            dispatch(getClientByName('')); 
        }
    }, [name, dispatch]);

    useEffect(() => {
        if (lastname) {
            dispatch(getClientByLastname(lastname));
        } else {
            dispatch(getClientByLastname('')); 
        }
    }, [lastname, dispatch]);

    return(
        <div className="component">
            <div className="title">
                <h2>REGISTRO DE CLIENTES</h2>
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
                                        <span>DNI</span>
                                        <input type="search" name="searchDni" onChange={handleChangeDni} value={dni} placeholder="Buscar" autoComplete="off" className="filterSearch"  
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Nombre(s)</span>
                                        <input type="search" name="searchName" onChange={handleChangeName} value={name} placeholder="Buscar" autoComplete="off" className="filterSearch"  
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Apellido(s)</span>
                                        <input type="search"name="searchLastname" onChange={handleChangeLastname} value={lastname} placeholder="Buscar" autoComplete="off" className="filterSearch" 
                                        />
                                    </div>
                                </th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Productos</th>
                                <th>Estado</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClients.map(client => (
                                    <tr key={client._id} className={!client.active ? style.inactive : ''}>
                                        <td>{client.dni && client.dni}</td>
                                        <td>{client.name}</td>
                                        <td>{client.lastname}</td>
                                        <td>{client.email}</td>
                                        <td>{client.phone}</td>
                                        <td>{client.purchases ? client.purchases.length : '0'}</td>    
                                        <td>{client.active ? "Activo" : "Inactivo"}</td>
                                        <td>
                                            <Link to={`/main_window/clients/${client._id}`}>
                                                <img src={detail} alt="" className="detailImg" />
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

export default ClientRegistration;