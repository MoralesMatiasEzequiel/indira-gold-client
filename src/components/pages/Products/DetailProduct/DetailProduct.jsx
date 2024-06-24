import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { getProductById } from '../../../../redux/productActions.js';


const Detail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const productDetail = useSelector(state => state.productDetail);

    useEffect(() => {
        dispatch(getProductById(id));
    }, []);
// console.log(productDetail);
    return(
        <div>
            <h1>Detalle del Producto</h1>
            <p>Producto ID: {id}</p>
            {/* {productDetail.name && <p>{productDetail.name}</p>} */}
            {/* {productDetail.image && <img src={productDetail.color[0].image} alt="Product Image"/>}
            {productDetail.description && <p>{productDetail.description}</p>} */}
        </div>
    );
};

export default Detail;