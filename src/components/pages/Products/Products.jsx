import React, { useEffect} from 'react';
import { useDispatch } from "react-redux";
import FormProduct from './FormProduct/FormProduct.jsx';
import ProductManagement from './ProductManagement/ProductManagement.jsx';
import { getProducts } from '../../../redux/productActions.js';
import { getCategories } from '../../../redux/categoryActions.js';


const Products = () => {
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
    }, [dispatch]);
    
    return (
        <div className="page">
            <div>
                <FormProduct />
            </div>
            {/* <div>
                <ProductManagement />
            </div> */}
        </div>
    );
};

export default Products;