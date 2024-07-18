import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getClientByName, getClientByLastname } from "../../../../redux/clientActions.js";
import detail from '../../../../assets/img/detail.png';

const ClientRegistration = () => {

    const clients = useSelector(state => state.clients.clients);
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangeLastname = (event) => {
        setLastname(event.target.value);
    };

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
            </div>
            <div className="container">
                <div className="tableContainer">
                    <table>
                        <thead>
                            <tr>
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
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                    <tr key={client._id}>
                                        <td>{client.name}</td>
                                        <td>{client.lastname}</td>
                                        <td>{client.email}</td>
                                        <td>{client.phone}</td>
                                        <td>{client.shopping[0] ? client.shopping : '0'}</td>
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