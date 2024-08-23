import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getClientById, deleteClient, clearClientDetail } from '../../../../redux/clientActions.js';
import { getProductById } from '../../../../redux/productActions.js';
import style from "./DetailClient.module.css";

const DetailClient = () => {
    let { id } = useParams();
    const dispatch = useDispatch();
    const clientDetail = useSelector(state => state.clients.clientDetail);    
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(clearClientDetail());
        setPurchasedProducts([]);
        setLoading(true); // Establece la bandera de carga a true antes de obtener los nuevos datos

        // Luego carga el nuevo cliente
        dispatch(getClientById(id)).then(() => {
            setLoading(false); // Desactiva la bandera de carga cuando los datos estén listos
        });
    }, [dispatch, id]);

    useEffect(() => {
        if (!loading && clientDetail && clientDetail.purchases) {
            const updatedProducts = [];
            console.log(clientDetail.purchases);
            clientDetail.purchases.forEach((purchase) => {
                dispatch(getProductById(purchase.productId)).then((response) => {
                    if (response.error && response.error.status === 404) {
                        // Producto no encontrado, agregar producto como no disponible
                        updatedProducts.push({
                            name: 'Producto no disponible',
                            selectedColor: null,
                            selectedSize: null,
                            price: null,
                        });
                    } else {
                        const product = response;
                        const selectedColor = getColorById(product, purchase.colorId);
                        const selectedSize = getSizeById(product, purchase.colorId, purchase.sizeId);
    
                        updatedProducts.push({ ...product, selectedColor, selectedSize });
                    }
    
                    // Actualiza purchasedProducts después de cargar todos los productos
                    if (updatedProducts.length === clientDetail.purchases.length) {
                        setPurchasedProducts(updatedProducts);
                    }
                });
            });
        } else {
            setPurchasedProducts([]);
        }
    }, [clientDetail, dispatch, loading]);

    const getColorById = (product, colorId) => {
        return product?.color?.find(c => c._id === colorId);
    };

    const getSizeById = (product, colorId, sizeId) => {
        const color = getColorById(product, colorId);
        return color?.size?.find(s => s._id === sizeId);
    };

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).replace(/\//g, '-');
    };

    const handleDelete = () => {
        dispatch(deleteClient(id));
        navigate('/main_window/clients');
    };

    if (loading) {
        return <div>Loading...</div>; // Puedes personalizar este mensaje o mostrar un spinner de carga
    }

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
                    <h2>Detalle del Cliente</h2>
                    <div className="titleButtons">
                        {clientDetail.active ? <button><Link to={`/main_window/clients/edit/${id}`}>Editar</Link></button> : ''}
                        {!clientDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
                        <button><Link to={`/main_window/clients`}>Atrás</Link></button>
                    </div>
                </div>
                <div className={`container ${style.content}`}>
                    <div className={style.column}>
                        {/* <p><span>ID de cliente:&nbsp;</span>{id}</p> */}
                        {clientDetail.name && <p><span>Nombre:&nbsp;</span>{clientDetail.name}</p>}
                        {clientDetail.lastname && <p><span>Apellido:&nbsp;</span>{clientDetail.lastname}</p>}
                        {clientDetail.email && <p><span>Correo electrónico:&nbsp;</span>{clientDetail.email}</p>}
                        {clientDetail.phone && <p><span>Teléfono:&nbsp;</span>{clientDetail.phone}</p>}
                        {clientDetail.date && <p><span>Fecha de suscripción:&nbsp;</span>{formatDate(clientDetail.date)}</p>}
                        <p><span>Estado:&nbsp;</span>{clientDetail.active ? 'Activo' : 'Inactivo'}</p>
                    </div>
                    <div className={style.column}>
                        <p><span>Historial de compras:&nbsp;</span></p>
                        <ul>
                            {purchasedProducts.length > 0 ? (
                                purchasedProducts.map((product, index) => (
                                    <li key={index}>
                                        <p><span>{product.name}</span></p>
                                        <ul className={style.productList}>
                                            {product.selectedColor && <li><span>Color:&nbsp;</span>{product.selectedColor?.colorName || 'Desconocido'}</li>}
                                            {product.selectedSize && <li><span>Talle:&nbsp;</span>{product.selectedSize?.sizeName || 'Desconocido'}</li>}
                                            {product.price &&<li><span>Precio:&nbsp;</span>${formatNumber(product.price)}</li>}
                                        </ul>
                                    </li>
                                ))
                            ) : (
                                <div>No hay compras registradas</div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea {clientDetail.active ? 'desactivar' : 'activar'} este cliente?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleDelete} className={clientDetail.active ? 'delete' : 'add'}>{clientDetail.active ? 'Desactivar' : 'Activar'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailClient;
