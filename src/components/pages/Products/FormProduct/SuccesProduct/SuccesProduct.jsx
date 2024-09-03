import style from './SuccesProduct.module.css';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProducts } from '../../../../../redux/productActions';

const SuccesProduct = () => {
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
    }, []);

    return (
        <div className="component">
            <div className="container">
                
            </div>
        </div>
    );
};

export default SuccesProduct;