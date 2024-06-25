import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { getProductById } from '../../../../redux/productActions.js';


const Detail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const productDetail = useSelector(state => state.products.productDetail);

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);
    
    return(
        <div>
            <h1>Detalle del Producto</h1>
            <p>Producto ID: {id}</p>
            {productDetail.color && <img src={productDetail.color[0].image} alt="Product Image"/>}
            {productDetail.name && <p>Nombre: {productDetail.name}</p>}
            {productDetail.category && <p>Categoría: {productDetail.category}</p>}
            {productDetail.description && <p>Descripción: {productDetail.description}</p>}
        </div>
    );
};

export default Detail;

//Si 'productDetail.color[0].image' tira error porque todavia no se carga el productDetail en el estado global, probr con este código:
// {productDetail.color && productDetail.color.length > 0 && (
//     <img src={productDetail.color[0].image} alt="Product Image" />
// )}