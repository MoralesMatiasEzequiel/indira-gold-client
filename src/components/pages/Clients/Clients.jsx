import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getClients } from '../../../redux/clientActions.js';


const Clients = () => {

    const clients = useSelector(state => state.clients.clients);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getClients());
    }, [dispatch]);

    return(
        <div>
            <h1>Listado de clientes</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Correo electrónico</th>
                            <th>Teléfono</th>
                            <th>Productos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                                <tr key={client._id}>
                                    <td>{client.name}</td>
                                    <td>{client.lastname}</td>
                                    <td>{client.email}</td>
                                    <td>{client.phone}</td>
                                    <td>{client.sale[0] ? client.sale : '0'}</td>
                                    <td>
                                        <Link to={`/main_window/clients/${client._id}`}>
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

export default Clients;