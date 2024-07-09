import style from "./ProductManagement.module.css";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getProductByName } from "../../../../redux/productActions.js";


const ProductManagement = () => {
    
    const products = useSelector(state => state.products.products);
    const dispatch = useDispatch();
    const [productName, setProductName] = useState('');
    
    const handleChangeClient = (event) => {
        setProductName(event.target.value);
    };

    useEffect(() => {
        if (productName) {
            dispatch(getProductByName(productName));
        } else {
            dispatch(getProductByName('')); 
        }
    }, [productName, dispatch]);
    
    return (
        <div className={style.container}>
            <div className={style.containerTitle}>
                <h2 className={style.title}>GESTIÓN DE PRODUCTOS</h2>
                <button>Editar</button>
                <button>x</button>
            </div>
            <div className={style.containerTable}>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div className={style.thOrderClient}>
                                    <span className={style.spanOrderClient}>Nombre</span>
                                    <input type="search"name="searchProduct" onChange={handleChangeClient} value={productName} placeholder="Buscar" autoComplete="off" className="filterSearch" 
                                    />
                                </div>
                            </th>
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
                                    <td>{product.color[0]?.colorName}</td>
                                    <td><img src={product.color[0]?.image} alt="Product Image"/></td>
                                    <td>{product.color[0]?.size[0].sizeName}</td>
                                    <td className={style.dataNumber}>{product.color[0]?.size[0].stock}</td>
                                    <td className={style.dataNumber}>$ {product.price}</td>
                                    <td>{product.category.length > 0 ? product.category[0].name : 'No tiene categoría'}</td>
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

export default ProductManagement;