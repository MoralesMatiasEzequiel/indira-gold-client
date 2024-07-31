import style from './DetailProduct.module.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../../../../redux/productActions.js';


const DetailProduct = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const productDetail = useSelector(state => state.products.productDetail);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);
    
    return(
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>Detalle del producto</h2>
                    <div className="titleButtons">
                        <button>Editar</button>
                        <button className="delete" onClick={toggleShowDeleteModal}>Eliminar</button>
                        <button><Link to={`/main_window/products/management`}>Atrás</Link></button>
                    </div>
                </div>
                    <div className="container">
                        {productDetail.name && <div className={style.nameProduct}><span>{productDetail.name}</span></div>}
                        <div className={style.column}>
                            {productDetail.imageGlobal && <img src={productDetail.imageGlobal} alt="Product Image"/>}
                            <p>Precio: ${productDetail.price}</p>
                            <p>Categoría: {productDetail.category[0].name ? productDetail.category[0].name : 'No tiene categoría'}</p>
                            <p>Código QR: </p>
                            {productDetail.supplier 
                            ? <div>
                                <p>Proveedor</p>
                                <p>Nombre: {productDetail.supplier.name}</p>
                                <p>Teléfono: {productDetail.supplier.phone}</p>
                              </div> 
                            : ''}
                            <p>Proveedor</p>
                            {productDetail.color.map(color => (
                                <div>
                                    <img src={color.image} alt="Product Image"/>
                                    <p>Color: {color.colorName}</p>
                                    {color.size.map(size => (
                                        <div>
                                            <p>Talle: {size.sizeName}</p>   
                                            <p>Stock: {size.stock}</p>                                           
                                            <p>Medidas:</p>
                                            <li>Ancho: {size.measurements[0].width ? size.measurements[0].width : 'No hay ancho establecido.'}</li>
                                            <li>Largo: {size.measurements[0].long ? size.measurements[0].long : 'No hay largo establecido.'}</li>
                                            <li>Tiro: {size.measurements[0].rise ? size.measurements[0].rise : 'No hay tiro establecido.'}</li>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {productDetail.description ? <p>Descripción: {productDetail.description}</p> : ''}
                        </div>
                    </div>
            </div>
        </div>

    );
};

export default DetailProduct;