import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { getProductById } from '../../../../redux/productActions.js';


const DetailProduct = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const productDetail = useSelector(state => state.products.productDetail);

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);
    
    return(
        <div>
            <h1>Detalle del Producto</h1>
            {productDetail.color && <img src={productDetail.color[0].image} alt="Product Image"/>}
            {productDetail.name && <p>Nombre: {productDetail.name}</p>}
            {productDetail.color?.length && <p>Color: {productDetail.color[0].colorName}</p>}
            {productDetail.color?.length && <p>Talle: {productDetail.color[0].size[0].sizeName}</p>}
            {productDetail.color?.length && <p>Medidas:</p>}
            {productDetail.color?.length && <li>Ancho: {productDetail.color[0].size[0].measurements[0].width}</li>}
            {productDetail.color?.length && <li>Largo: {productDetail.color[0].size[0].measurements[0].long}</li>}
            {productDetail.color?.length && <li>Tiro: {productDetail.color[0].size[0].measurements[0].rise}</li>}
            {productDetail.category?.length > 0 
            ? <p>Categoría: {productDetail.category[0].name}</p>
            : <p>Categoría: No tiene categoría</p>}
            {productDetail.color?.length && <p>Código: {productDetail.color[0].size[0].code}</p>}
            {productDetail.color?.length && <p>Stock: {productDetail.color[0].size[0].stock}</p>}
            {productDetail.price && <p>Precio: $ {productDetail.price}.-</p>}
        </div>
    );
};

export default DetailProduct;