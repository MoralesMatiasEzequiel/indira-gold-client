import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { getClientById } from '../../../../redux/clientActions.js';


const DetailClient = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const clientDetail = useSelector(state => state.clients.clientDetail);

    useEffect(() => {
        dispatch(getClientById(id));
    }, [dispatch, id]);
    
    return(
        <div>
            <div>
                <h1>Detalle del Cliente</h1>
            </div>
            <div>
                <p>Cliente ID: {id}</p>
                {clientDetail.name && <p>Nombre: {clientDetail.name}</p>}
                {clientDetail.lastname && <p>Apellido: {clientDetail.lastname}</p>}
                {clientDetail.email && <p>Correo electrónico: {clientDetail.email}</p>}
                {clientDetail.phone && <p>Teléfono: {clientDetail.phone}</p>}
                {clientDetail.date && <p>Fecha de suscripción: {clientDetail.date}</p>}
                {clientDetail.active && <p>Estado: {clientDetail.active ? 'Activo' : 'Inactivo'}</p>}
            </div>
            <div>
                <p>Historial de compras</p>
                {clientDetail.sale && <p>{clientDetail.sale}</p>}
            </div>
            
            

        </div>
    );
};

export default DetailClient;

//Si 'clientDetail.color[0].image' tira error porque todavia no se carga el clientDetail en el estado global, probr con este código:
// {clientDetail.color && clientDetail.color.length > 0 && (
//     <img src={clientDetail.color[0].image} alt="Product Image" />
// )}