import style from "./ProductManagement.module.css";
import detail from '../../../../assets/img/detail.png';
import imgProduct from '../../../../assets/img/imgProduct.jpeg';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllProducts, getProducts, getProductByName, getActiveProductsByName } from "../../../../redux/productActions.js";
import { getCategories } from "../../../../redux/categoryActions.js";


const ProductManagement = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productsActive = useSelector(state => state.products.products);
    const allProducts = useSelector(state => state.products.allProducts);
    const categories = useSelector(state => state.categories.categories);

    const [productFilter, setProductFilter] = useState('active');
    const [category, setCategory] = useState('allCategories');
    const [productId, setProductId] = useState('');
    const [name, setName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Indicador de carga
    const [errorShown, setErrorShown] = useState(false); 
// console.log(category);

    const itemsPerPage = 20;

    // Filtrar productos según el estado del filtro y la categoría seleccionada
    const filteredProducts = () => {
        let products = productFilter === 'active' ? productsActive : allProducts;

        if (category !== 'allCategories') {
            products = products.filter(product => product.category.some(cat => cat.name === category));
        };

        return products;
    };

    // Obtener productos filtrados
    const productsForPagination = filteredProducts();

    const paginatedProducts = Array.isArray(productsForPagination) ? productsForPagination.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];
    const totalPages = Math.ceil(productsForPagination.length / itemsPerPage);

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

    const handleCheckboxChange = (option) => {
        setProductFilter(option);
        setCurrentPage(1); // Resetear a la primera página al cambiar el filtro
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const id = productId; // Usa el estado actual del ID
            const productExists = allProducts.some(product => product._id === id);
    
            if (productExists) {
                navigate(`/main_window/products/${id}`);
            } else {
                if (id) {
                    toast.error('Este código no existe.'); // Muestra el mensaje de error
                }
            }
        }
    };
    
    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleInputChangeCategories = (event) => {
        setCategory(event.target.value);
        setCurrentPage(1); // Resetear a la primera página al cambiar la categoría
    };

    // const getImageUrl = (imagePath) => {
    //     if (!imagePath) return '';
        
    //     // Reemplazar barras invertidas por barras inclinadas
    //     const correctedPath = imagePath.replace(/\\/g, '/');
        
    //     // URL base para los archivos estáticos
    //     const baseUrl = 'http://localhost:3001/';
        
    //     return `${baseUrl}${correctedPath}`;
    // };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await dispatch(getProducts());
                await dispatch(getAllProducts());
                await dispatch(getCategories());
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [dispatch]);

    useEffect(() => {
        if (name) {
            dispatch(getProductByName(name));
            dispatch(getActiveProductsByName(name));
        } else {
            dispatch(getProductByName(''));
            dispatch(getActiveProductsByName(''))
        }
    }, [name, dispatch]);
    
    useEffect(() => {
        dispatch(getProducts());
        dispatch(getAllProducts());
        dispatch(getCategories());
    }, [dispatch]);
    

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
                    <div className={style.containerFilters}>
                        <div className={style.containerInputCheckbox}>
                            <input className={style.inputCheckbox} type="checkbox" name="active" id="active" checked={productFilter === 'active'} onChange={() => handleCheckboxChange('active')} />
                            <span className={style.spanCheckbox}>Productos activos</span>
                            <input className={style.inputCheckbox} type="checkbox" name="all" id="all" checked={productFilter === 'all'} onChange={() => handleCheckboxChange('all')} />
                            <span className={style.spanCheckbox}>Todos los productos</span>
                        </div>
                        <div className={style.containerSelected}>
                            <div>
                                <input className={style.searchCode} type="search" name="searchIDProduct" id="searchIDProduct" onChange={(e) => setProductId(e.target.value)} onKeyDown={handleKeyDown} placeholder="🔍︎ Buscar código" autoComplete="off" />
                            </div>  
                            <select name="category" value={category} onChange={handleInputChangeCategories}>
                                <option value="allCategories">Todas las categorías</option>
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category._id} value={category.name}>{category.name}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>No hay categorías disponibles</option>
                                )}
                            </select>
                        </div>
                    </div>              
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
                                    product.color.map((color, colorIndex) => (
                                        <React.Fragment key={`${product._id}-${colorIndex}`}>
                                            <tr className={!product.active ? style.inactive : ''}>
                                                {/* <td>{colorIndex === 0 ? product.name : ''}</td> */}
                                                <td className={style.tdInside}>
                                                    <div className={style.containerInfoGral}>
                                                        <span className={style.nameProduct}>{colorIndex === 0 ? product.name : ''}</span>
                                                    </div>
                                                </td>
                                                <td className={style.tdInside}>
                                                    <div className={style.containerColor}>
                                                        <span>{color.colorName}</span>
                                                    </div>
                                                </td>
                                                <td className={style.tdContainerImage}>
                                                    {product.imageGlobal ? (
                                                        <div>
                                                            <img className={style.imageProduct} src={product.imageGlobal} alt="Product Image" />
                                                        </div>
                                                    ) : (
                                                        <div className={style.containerSize}>
                                                            <img src={color.image || imgProduct} alt="Product Image" className={style.imageProduct} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className={style.tdInside}>
                                                    {color.size.map((size, sizeIndex) => (
                                                        <div key={sizeIndex} className={style.containerSizeName}>
                                                            <span>{size.sizeName}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className={style.tdInside}>
                                                    {color.size.map((size, sizeIndex) => (
                                                        <div key={sizeIndex} className={style.containerSizeName}>
                                                            <span>{size.stock}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className={style.tdInside}>
                                                    <div className={style.containerInfoGral}>
                                                        <span>{colorIndex === 0 ? `$ ${product.price}` : ''}</span>
                                                    </div>
                                                </td>
                                                <td className={style.tdInside}>
                                                    {product.category.length > 0 
                                                        ? <div className={style.containerInfoGral}><span>{colorIndex === 0 && product.category[0].name}</span></div>
                                                        : <div className={style.containerInfoGral}><span>Sin categoría</span></div>
                                                    }
                                                </td>
                                                <td className={style.tdInside}>
                                                    <a onClick={() => navigate(`/main_window/products/${product._id}`)}>
                                                        <img src={detail} alt="" className='detailImg' />
                                                    </a>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))
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