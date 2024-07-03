import React, { useEffect} from 'react';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import ProductManagement from './ProductManagement/ProductManagement.jsx';
import { getProducts } from '../../../redux/productActions.js';


const Products = () => {
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);
    
    return (
        <div>
            <Link to={'/main_window/products/form'}>
                    <button>Nuevo producto</button>
                </Link>
            <ProductManagement />
        </div>
    );
};

export default Products;