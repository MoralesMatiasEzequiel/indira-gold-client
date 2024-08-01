import style from "./ProductManagement.module.css";
import detail from '../../../../assets/img/detail.png';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { getProductByName } from "../../../../redux/productActions.js";


const ProductManagement = () => {
    
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);

    const [name, setName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 20;

    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    const getPageButtons = () => {
        const buttons = [];
        let startPage, endPage;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pageButton ${currentPage === i ? 'currentPage' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };
    
    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    useEffect(() => {
        if (name) {
            dispatch(getProductByName(name));
        } else {
            dispatch(getProductByName('')); 
        }
    }, [name, dispatch]);
    
    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>GESTIÓN DE PRODUCTOS</h2>
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            ◂
                        </button>
                        {getPageButtons()}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            ▸
                        </button>
                    </div>
                </div>
                <div className="container">
                    <div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <div className="withFilter">
                                            <span>Nombre</span>
                                            <input type="search" name="searchProduct" onChange={handleChangeName} value={name} placeholder="Buscar" autoComplete="off" className="filterSearch" 
                                            />
                                        </div>
                                    </th>
                                    <th>Color</th>
                                    <th>Imagen</th>
                                    <th>Talle</th>
                                    <th>Stock</th>
                                    <th>Precio</th>
                                    <th>Categoría</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts?.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td className={style.tdInside}>{product.color?.map((color, colorIndex) => (
                                            <div key={colorIndex}>
                                                <td className={colorIndex > 0 ? style.tdMax : style.tdMin}>{color.colorName}</td>
                                            </div>))}
                                        </td>
                                        <td className={style.tdImageContainer}>{product.imageGlobal 
                                            ? <img className={style.imageProduct} src={product.imageGlobal} alt="Product Image"/> 
                                            : <div>{product.color.map((color, colorImageIndex) => (
                                                <div key={colorImageIndex}>
                                                    <img src={color.image} alt="Product Image" className={style.imageProduct}/>
                                                </div>))}
                                              </div>}    
                                        </td>
                                        <td className={style.tdInside}>{product.color.map((color, colorSizeIndex) => (
                                            <div key={colorSizeIndex} className={colorSizeIndex > 0 ? style.sizeContainer : ''}>{color.size.map((size, sizeIndex) => (
                                                <td key={sizeIndex} className={sizeIndex > 0 ? style.tdSizeMax : style.tdSizeMin}>{size.sizeName}</td>))}
                                            </div>))}
                                        </td>
                                        <td className={style.tdInside}>{product.color.map((color, colorStockIndex) => (
                                            <div key={colorStockIndex} className={colorStockIndex > 0 ? style.sizeContainer : ''}>{color.size.map((size, sizeStockIndex) => (
                                                <td key={sizeStockIndex} className={sizeStockIndex > 0 ? style.tdSizeMax : style.tdSizeMin}>{size.stock}</td>))}
                                            </div>))}
                                        </td>
                                        <td className={style.tdMin}>$ {product.price}</td>
                                        <td>{product.category.length > 0 ? product.category[0].name : 'Sin categoría'}</td>
                                        <td>
                                            <Link to={`/main_window/products/${product._id}`}>
                                                <img src={detail} alt="" className="detailImg" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;