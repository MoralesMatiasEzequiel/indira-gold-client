import React, { useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getProducts } from '../../../redux/productActions.js';
// import { getAllProducts } from '../../../redux/productActions.js';


const Products = () => {
    
    const products = useSelector(state => state.products.products);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);
    
    return (
        <div>
            <div>
                <h1>GESTIÓN DE PRODUCTOS</h1>
                <button>Cambio</button>
                <button>x</button>
                <Link to={'/main_window/products/form'}>
                    <button>Nuevo producto</button>
                </Link>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Color</th>
                            <th>Imagen</th>
                            <th>Talle</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.color[0].color_name}</td>
                                    <td><img src={product.color[0].image} alt="Product Image"/></td>
                                    <td>{product.color[0].size[0].size_name}</td>
                                    <td>{product.color[0].size[0].stock}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>Estado del stock?</td>
                                    <td>
                                        <Link to={`/main_window/detail/${product._id}`}>
                                            <button>Detalle</button>
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