import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { getMonthlySalesByClient } from '../../../../redux/saleActions.js';
import { getClientByFullName, getClientByDni, getClients } from "../../../../redux/clientActions.js";
import detail from '../../../../assets/img/detail.png';
import visible from "../../../../assets/img/visible.png";
import style from "./ClientRegistration.module.css";

const ClientRegistration = () => {

    const clients = useSelector(state => state.clients.clients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [dni, setDni] = useState('');
    const [fullName, setFullName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [monthlySales, setMonthlySales] = useState({});
    const [loadedClientIds, setLoadedClientIds] = useState(new Set()); // Estado para rastrear IDs ya cargados
    const [sortByProducts, setSortByProducts] = useState('asc');
    const [isHovered, setIsHovered] = useState(null);


    const itemsPerPage = 20;

    const sortedClients = [...clients].reverse().sort((a, b) => {
        const salesA = monthlySales[a._id] || 0;
        const salesB = monthlySales[b._id] || 0;
        return sortByProducts === 'asc' ? salesA - salesB : salesB - salesA;
    });

    const paginatedClients = sortedClients.slice().reverse().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedClients.length / itemsPerPage);


    useEffect(() => {
        dispatch(getClients());
    }, [dispatch])

    useEffect(() => {
        paginatedClients.forEach(client => {
            if (!loadedClientIds.has(client._id)) { // Verifica si el ID ya fue cargado
                dispatch(getMonthlySalesByClient(client._id))
                    .then(response => {
                        // Asegúrate de que response sea válido y tenga la propiedad totalProducts
                        const totalProducts = response?.totalProducts || 0; // Si no existe, asigna 0
                        setMonthlySales(prevState => ({
                            ...prevState,
                            [client._id]: totalProducts
                        }));
                        setLoadedClientIds(prevIds => new Set(prevIds).add(client._id)); // Agrega el ID al conjunto de IDs cargados
                    })
                    .catch(() => {
                        setMonthlySales(prevState => ({
                            ...prevState,
                            [client._id]: "Datos no disponibles offline"
                        }));
                        setLoadedClientIds(prevIds => new Set(prevIds).add(client._id)); // Agrega el ID al conjunto de IDs cargados
                    });;
            }
        });
    }, [dispatch, paginatedClients, loadedClientIds]);

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

    const handleChangeFullName = (event) => {
        setFullName(event.target.value);
    };

    useEffect(() => {
        if (dni) {
            dispatch(getClientByDni(dni));
        } else {
            dispatch(getClientByDni('')); 
        }
    }, [dni, dispatch]);

    useEffect(() => {
        if (fullName) {
            dispatch(getClientByFullName(fullName));
        } else {
            dispatch(getClientByFullName('')); 
        }
    }, [fullName, dispatch]);

    const toggleSortOrder = () => {
        setSortByProducts(sortByProducts === 'asc' ? 'desc' : 'asc');
    };

    const handleMouseEnter = (clientId) => {
        setIsHovered(clientId); 
    };

    const handleMouseLeave = () => {
        setIsHovered(null);
    };

    return(
        <div className="page">
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
                                            <span>Nombre(s) y Apellido</span>
                                            <input type="search" name="searchName" onChange={handleChangeFullName} value={fullName} placeholder="Buscar" autoComplete="off" className="filterSearch"  
                                            />
                                        </div>
                                    </th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>
                                        <div className="withFilter">
                                            <span>Productos</span>
                                            <button className="sort" onClick={toggleSortOrder}>{sortByProducts === 'asc' ? '▴' : '▾'}</button>
                                        </div>
                                    </th>
                                    <th>Estado</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedClients?.map(client => (
                                        <tr key={client._id} className={!client.active ? style.inactive : ''}>
                                            <td className="center">{client.dni && client.dni}</td>
                                            <td>{client.name} {client.lastname}</td>
                                            <td className="center">{client.email}</td>
                                            <td className="center">{client.phone}</td>
                                            <td className="center">{monthlySales[client._id] !== undefined ? monthlySales[client._id] : 'Información no disponible offline'}</td>    
                                            <td>{client.active ? "Activo" : "Inactivo"}</td>
                                            <td>
                                                <div onClick={() => navigate(`/main_window/clients/${client._id}`)}>
                                                    <img src={isHovered === client._id ? visible : detail} alt="detail" className="detailImg" onMouseEnter={() => handleMouseEnter(client._id)} onMouseLeave={handleMouseLeave}/>
                                                </div>
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

export default ClientRegistration;