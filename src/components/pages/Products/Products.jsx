import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
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
            <span>Productos</span>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.products.map(product => (
                                <tr key={product._id}>
                                    <td><img src={product.color[0].image} alt="Product Image"/></td>
                                    <td>{product.name}</td>
                                    <td>$19.99</td>
                                    <td>{product.category}</td>
                                    <td>Available</td>
                                    <td>
                                        <Link to='/main_window/detail'>
                                            <button id={product._id}>Detalle</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;