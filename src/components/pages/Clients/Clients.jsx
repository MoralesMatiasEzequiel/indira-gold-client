import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getClients } from '../../../redux/clientActions.js';

const Clients = () => {

    const clients = useSelector(state => state.clients);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getClients());
    }, [dispatch]);
    
    console.log(clients);

    return(
        <div>
            <h1>Listado de clientes</h1>
        </div>
    );
};

export default Clients;