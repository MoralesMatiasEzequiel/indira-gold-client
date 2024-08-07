import style from './DetailProduct.module.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, deleteProductById } from '../../../../redux/productActions.js';


const DetailProduct = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productDetail = useSelector(state => state.products.productDetail);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    const handleDelete = () => {
        dispatch(deleteProductById(id));
        navigate('/main_window/products/management');
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        // URL base para los archivos estáticos
        const baseUrl = 'http://localhost:3001/';
        return `${baseUrl}${imagePath}`;
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
                        {productDetail.color?.map(color => (
                            <div className={style.containerImgProduct}>
                                {color.image && <img className={style.imgProduct} src={getImageUrl(color.image)} alt="Product Image"/>}
                            </div>
                        ))}
                        {productDetail.imageGlobal && <img className={style.imgProduct} src={getImageUrl(productDetail.imageGlobal)} alt="Product Image"/>}
                        <p><span>Precio:&nbsp;</span>${productDetail.price}</p>
                        <p><span>Categoría:&nbsp;</span>{(productDetail.category && productDetail.category.length > 0) ? productDetail.category[0].name : 'No tiene categoría'}</p>
                        <p><span>Código QR:</span></p>
                        {productDetail.color?.map(color => (
                            <div className={style.containerColor}>                  
                                <p><span>Color:&nbsp;</span>{color.colorName}</p>
                                {color.size.map(size => (
                                    <div>
                                        <p><span>Talle:&nbsp;</span>{size.sizeName}</p>   
                                        <p><span>Stock:&nbsp;</span>{size.stock}</p>                                           
                                        <p><span>Medidas:</span></p>
                                        <li><span>Ancho:&nbsp;</span>{size.measurements[0].width ? size.measurements[0].width : 'No hay ancho establecido.'}</li>
                                        <li><span>Largo:&nbsp;</span>{size.measurements[0].long ? size.measurements[0].long : 'No hay largo establecido.'}</li>
                                        <li><span>Tiro:&nbsp;</span>{size.measurements[0].rise ? size.measurements[0].rise : 'No hay tiro establecido.'}</li>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {productDetail.description ? <p><span>Descripción:&nbsp;</span>{productDetail.description}</p> : ''}
                        {productDetail.supplier 
                        ? <div>
                            <p><span>Proveedor:</span></p>
                            <li><span>Nombre:&nbsp;</span>{productDetail.supplier.name}</li>
                            <li><span>Teléfono:&nbsp;</span>{productDetail.supplier.phone}</li>
                            </div> 
                        : ''}
                    </div>
                </div>
            </div>
            <div className={`${style.deleteModal} ${showDeleteModal ? style.deleteModalShow : ''}`}>
                <div className={style.deleteContent}>
                    <p>¿Está seguro que desea eliminar este producto?</p>
                    <div className={style.deleteButtons}>
                        <button onClick={toggleShowDeleteModal}>Cancelar</button>
                        <button onClick={handleDelete} className="delete">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default DetailProduct;