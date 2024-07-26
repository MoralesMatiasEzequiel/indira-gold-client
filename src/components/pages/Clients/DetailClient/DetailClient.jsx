import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getClientById, deleteClient, getClients } from '../../../../redux/clientActions.js';
import style from "./DetailClient.module.css";


const DetailClient = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const clientDetail = useSelector(state => state.clients.clientDetail);
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(getClientById(id));
    }, [dispatch, id]);

    
    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }
    
    const handleDelete = () => {
        dispatch(deleteClient(id));
        navigate('/main_window/clients');
    }
    
    return(
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>Detalle del Cliente</h2>
                    <div className="titleButtons">
                        <button>Editar</button>
                        <button className="delete" onClick={toggleShowDeleteModal}>{clientDetail.active ? 'Desactivar' : 'Activar'}</button>
                        <button><Link to={`/main_window/clients`}>Atrás</Link></button>
                    </div>
                </div>
                <div className={`container ${style.content}`}>
                    <div className={style.column}>
                        <p><span>ID de cliente:&nbsp;</span>{id}</p>
                        {clientDetail.name && <p><span>Nombre:&nbsp;</span>{clientDetail.name}</p>}
                        {clientDetail.lastname && <p><span>Apellido:&nbsp;</span>{clientDetail.lastname}</p>}
                        {clientDetail.email && <p><span>Correo electrónico:&nbsp;</span>{clientDetail.email}</p>}
                        {clientDetail.phone && <p><span>Teléfono:&nbsp;</span>{clientDetail.phone}</p>}
                        {clientDetail.date && <p><span>Fecha de suscripción:&nbsp;</span>{clientDetail.date}</p>}
                        <p><span>Estado:&nbsp;</span>{clientDetail.active ? 'Activo' : 'Inactivo'}</p>
                    </div>
                    <div className={style.column}>
                        <p><span>Historial de compras:&nbsp;</span></p>
                        {clientDetail.shopping && <p>{clientDetail.shopping}</p>}
                    </div>
                </div>
            </div>
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea {clientDetail.active ? 'desactivar' : 'activar'} este cliente?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleDelete} className="delete">{clientDetail.active ? 'Desactivar' : 'Activar'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailClient;

//Si 'clientDetail.color[0].image' tira error porque todavia no se carga el clientDetail en el estado global, probr con este código:
// {clientDetail.color && clientDetail.color.length > 0 && (
//     <img src={clientDetail.color[0].image} alt="Product Image" />
// )}