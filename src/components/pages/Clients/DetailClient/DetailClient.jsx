import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, getClientByIdLocal, deleteClient, clearClientDetail } from '../../../../redux/clientActions.js';
import { getProductById } from '../../../../redux/productActions.js';
import style from "./DetailClient.module.css";

const DetailClient = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clientDetail = useSelector(state => state.clients.clientDetail);        
    const products = useSelector(state => state.products.products);
    
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);    

    useEffect(() => {
        dispatch(clearClientDetail());
        setPurchasedProducts([]);
        setLoading(true); // Establece la bandera de carga a true antes de obtener los nuevos datos
        setProductsLoading(true);
        // Luego carga el nuevo cliente
        dispatch(getClientById(id))
        .then(() => {
            setLoading(false); // Desactiva la bandera de carga cuando los datos estén listos
        })
        .catch(() => {
            dispatch(getClientByIdLocal(id));
            setLoading(false);
        });
    }, [dispatch, id]);

    useEffect(() => {
        if (!loading && clientDetail && clientDetail.purchases) {
            const updatedProducts = [];
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
                        setProductsLoading(false);
                    }
                })
                .catch(() => {
                    const filteredProduct = products.find(p => p._id === purchase.productId);
                    if (filteredProduct) {
                        const selectedColor = getColorById(filteredProduct, purchase.colorId);
                        const selectedSize = getSizeById(filteredProduct, purchase.colorId, purchase.sizeId);

                        updatedProducts.push({ ...filteredProduct, selectedColor, selectedSize });
                    } 
                    if (updatedProducts.length === clientDetail.purchases.length) {
                        setPurchasedProducts(updatedProducts);
                        setProductsLoading(false);
                    }
                });
            });
        } else {
            setPurchasedProducts([]);
            setProductsLoading(false);
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
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            timeZone: 'UTC' 
        };

        const formattedDate = new Date(dateString).toLocaleDateString('es-ES', options).replace(/\//g, '-');
        
        return formattedDate;
    };

    const handleDelete = () => {
        dispatch(deleteClient(id)).then(() => {
            navigate('/main_window/clients');
            setTimeout(() => {
                navigate(`/main_window/clients/${id}`);
            }, 50);
            setShowDeleteModal(false);
        });
    };
    
    const formatNumber = (number) => {
        if (number !== null && number !== undefined) {
            const rounded = Math.round(number); // redondea al entero más cercano
            return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return '0';
    };

    return (
        <div className="page">
            {
                loading ? (
                    <div>Cargando</div>
                ) : (
                    <div className="component">
                        <div className="title">
                            <h2>Detalle del Cliente</h2>
                            <div className="titleButtons">
                                {clientDetail.active ? <button onClick={() => navigate(`/main_window/clients/edit/${id}`)}>Editar</button> : ''}
                                {!clientDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
                                <button onClick={() => navigate(`/main_window/clients`)}>Atrás</button>
                            </div>
                        </div>
                        <div className={!clientDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}>
                            <div className={style.column}>
                                {clientDetail.dni && <p><span>DNI:&nbsp;</span>{clientDetail.dni}</p>}
                                {clientDetail.name && <p><span>Nombre:&nbsp;</span>{clientDetail.name}</p>}
                                {clientDetail.lastname && <p><span>Apellido:&nbsp;</span>{clientDetail.lastname}</p>}
                                {clientDetail.email && <p><span>Correo electrónico:&nbsp;</span>{clientDetail.email}</p>}
                                {clientDetail.phone && <p><span>Teléfono:&nbsp;</span>{clientDetail.phone}</p>}
                                {clientDetail.date && <p><span>Fecha de suscripción:&nbsp;</span>{formatDate(clientDetail.date)}</p>}
                                <p><span>Estado:&nbsp;</span>{clientDetail.active ? 'Activo' : 'Inactivo'}</p>
                                {clientDetail.addresses && clientDetail.addresses.length > 0 && <>
                                    <p><span>Direcciones:</span></p>
                                    <ul>
                                        {clientDetail.addresses.map((address) => {
                                            return(
                                                <li className={style.address}>
                                                    {address.name && <p><span>Nombre:&nbsp;</span>{address.name}</p>}
                                                    <p><span>Dirección:&nbsp;</span>
                                                        {`
                                                            ${address.street && address.street}
                                                            ${address.number && `N°${address.number}`}
                                                            ${address.between && `E/ ${address.between}`}
                                                            ${address.floor && `Piso ${address.floor}`}
                                                            ${address.apartment && `Dpto. ${address.apartment}`}
                                                        `}
                                                    </p>
                                                    {address.city && <p><span>Ciudad:&nbsp;</span>{address.city}</p>}
                                                    {address.province && <p><span>Provincia:&nbsp;</span>{address.province}</p>}   
                                                    {address.postalCode && <p><span>Código postal:&nbsp;</span>{address.postalCode}</p>}    
                                                    {address.reference && <p><span>Referencia:&nbsp;</span>{address.reference}</p>}                                                    
                                                </li>
                                        )})}
                                    </ul>
                                </>}
                            </div>
                            <div className={style.column}>
                                <p><span>Historial de compras:&nbsp;</span></p>
                                {productsLoading ? (
                                    <div>Cargando productos...</div>
                                ) : purchasedProducts?.length ? (
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
                                ) : (
                                    <p>No hay productos vendidos disponibles.</p>
                                )}           
                            </div>
                        </div>
                    </div>

                )
            }
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
