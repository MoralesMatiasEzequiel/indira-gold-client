import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from '../../../redux/productActions.js';
// import { getAllProducts } from '../../../redux/productActions.js';



const Products = () => {
    
    const products = useSelector(state => state.products);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);
    
    
    return (
        <div>
            <span>Listado de productos</span>
            <div>
                {/* {products.map(product => (
                    <div key={product._id}>
                        {product.name}
                    </div>
                ))} */}
            </div>
        </div>
    );
};

export default Products;