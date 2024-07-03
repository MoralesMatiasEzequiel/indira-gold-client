import React, { useEffect} from 'react';
import { useDispatch } from "react-redux";
import { getClients } from '../../../redux/clientActions.js';
import ClientRegistration from './ClientRegistration/ClientRegistration.jsx';


const Clients = () => {

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getClients());
    }, [dispatch]);

    return(
        <div>
            <ClientRegistration />
        </div>
    );
};

export default Clients;