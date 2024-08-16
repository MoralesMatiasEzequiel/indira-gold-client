import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSaleById, clearSaleDetail, putSale } from '../../../../redux/saleActions.js';
import { getProducts, getProductById } from '../../../../redux/productActions.js';
import AsyncSelect from 'react-select/async';
import style from "./PutSale.module.css";
import detail from "../../../../assets/img/detail.png";
import x from "./img/x.png";

const DetailSale = () => {
    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const saleDetail = useSelector(state => state.sales.saleDetail);
    const products = useSelector(state => state.products.products);
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([{ productId: null, colorId: null, sizeId: null }]);
    const [selectedProductQuantities, setSelectedProductQuantities] = useState({});
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentFee, setPaymentFee] = useState(0);
    const [retention, setRetention] = useState(0);
    const [totalWithRetention, setTotalWithRetention] = useState(0);
    const productRefs = useRef([]);

    const transformProductOptions = (products) => {
        let productOptions = [];
        products.forEach(product => {
            product.color.forEach(color => {
                color.size.forEach(size => {
                    if (size.stock > 0) {
                        productOptions.push({
                            productId: product._id,
                            colorId: color._id,
                            sizeId: size._id,
                            label: `${product.name} - ${color.colorName} - Talle ${size.sizeName}`,
                            price: product.price,
                            stock: size.stock,
                        });
                    }
                });
            });
        });
        return productOptions;
    };

    const loadProductOptions = (inputValue, callback) => {
        const productOptions = transformProductOptions(products);
        const filteredOptions = productOptions.filter(product => {
            const key = `${product.productId}_${product.colorId}_${product.sizeId}`;
            const selectedQuantity = selectedProductQuantities[key] || 0;
            const availableStock = product.stock - selectedQuantity;

            return availableStock > 0 && product.label.toLowerCase().includes(inputValue.toLowerCase());
        });
        callback(filteredOptions);
    };

    const calculateSubtotal = (selectedProducts) => {
        let subtotal = 0;
        selectedProducts.forEach(product => {
            if (product.productId) {
                const productDetail = products.find(p => p._id === product.productId);
                if (productDetail) {
                    subtotal += productDetail.price;
                }
            }
        });
        return subtotal;
    };

    const formatNumber = (number) => {
        return number.toLocaleString('es-ES');
    };

    const handleProductChange = (selectedOption, index) => {
        setSelectedProducts((prevSelectedProducts) => {
            const newSelectedProducts = [...prevSelectedProducts];
            newSelectedProducts[index] = selectedOption ? { ...selectedOption } : { productId: null, colorId: null, sizeId: null };

            if (index === newSelectedProducts.length - 1 && selectedOption) {
                newSelectedProducts.push({ productId: null, colorId: null, sizeId: null });
                setTimeout(() => {
                    productRefs.current[index + 1].focus();
                }, 0);
            }

            // Update selectedProductQuantities
            setSelectedProductQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities };
                const key = `${selectedOption.productId}_${selectedOption.colorId}_${selectedOption.sizeId}`;
                
                if (selectedOption) {
                    if (newQuantities[key]) {
                        newQuantities[key]++;
                    } else {
                        newQuantities[key] = 1;
                    }
                } else {
                    // Si se eliminó un producto, restar la cantidad seleccionada
                    if (newQuantities[key]) {
                        newQuantities[key]--;
                        if (newQuantities[key] <= 0) delete newQuantities[key];
                    }
                }
                return newQuantities;
            });

            setSubtotal(calculateSubtotal(newSelectedProducts));
            return newSelectedProducts;
        });
    };

    const handleRemoveProduct = (index, fromPurchased) => {
        if (fromPurchased) {
            setPurchasedProducts((prevPurchasedProducts) => {
                const newPurchasedProducts = [...prevPurchasedProducts];
                newPurchasedProducts.splice(index, 1);
                setSubtotal(calculateSubtotal([...newPurchasedProducts, ...selectedProducts]));
                return newPurchasedProducts;
            });
        } else {
            setSelectedProducts((prevSelectedProducts) => {
                const newSelectedProducts = [...prevSelectedProducts];
                newSelectedProducts.splice(index, 1);
                setSubtotal(calculateSubtotal([...purchasedProducts, ...newSelectedProducts]));
                return newSelectedProducts;
            });
        }
    };

    const DropdownIndicator = (props) => {
        return null;
    };

    const customNoOptionsMessage = () => "Nombre del producto buscado";

    useEffect(() => {
        dispatch(clearSaleDetail());
        setPurchasedProducts([]);
        setLoading(true);
        dispatch(getSaleById(id)).then(() => {
            setLoading(false); // Desactiva la bandera de carga cuando los datos estén listos
            dispatch(getProducts());
            setDiscount(saleDetail.discount || 0);
            setPaymentFee(saleDetail.paymentFee || 0);
        });
    }, [dispatch, id]);

    useEffect(() => {
        if (!loading && saleDetail && saleDetail.products) {
            const updatedProducts = [];
            saleDetail.products.forEach((product) => {
                dispatch(getProductById(product.productId)).then((response) => {
                    if (response.error && response.error.status === 404) {
                        // Producto no encontrado, agregar producto como no disponible
                        updatedProducts.push({
                            name: 'Producto no disponible',
                            selectedColor: null,
                            selectedSize: null,
                            price: null,
                        });
                    } else {
                        const productInfo = response;
                        const selectedColor = getColorById(productInfo, product.colorId);
                        const selectedSize = getSizeById(productInfo, product.colorId, product.sizeId);

                        updatedProducts.push({ ...productInfo, selectedColor, selectedSize });
                    
                    }
                    // Solo actualiza purchasedProducts después de que todos los productos hayan sido cargados
                    if (updatedProducts.length === saleDetail.products.length) {
                        setPurchasedProducts(updatedProducts);
                    }
                });
            });
        } else {
            setPurchasedProducts([]);
        }
    }, [saleDetail, dispatch, loading]);

    const getColorById = (product, colorId) => {
        return product?.color?.find(c => c._id === colorId);
    };

    const getSizeById = (product, colorId, sizeId) => {
        const color = getColorById(product, colorId);
        return color?.size?.find(s => s._id === sizeId);
    };

    const handleDiscountChange = (e) => {
        const newDiscount = parseFloat(e.target.value) || 0;
        setDiscount(newDiscount);
        updateTotals(subtotal, newDiscount, paymentFee);
    };

    const handlePaymentFeeChange = (e) => {
        const newPaymentFee = parseFloat(e.target.value) || 0;
        setPaymentFee(newPaymentFee);
        updateTotals(subtotal, discount, newPaymentFee);
    };

    const updateTotals = (subtotal, discount, paymentFee) => {
        const newRetention = subtotal * (paymentFee / 100);
        const newTotalWithRetention = subtotal - discount - newRetention;
        setRetention(newRetention);
        setTotalWithRetention(newTotalWithRetention);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productsData = [
            ...purchasedProducts.map(product => ({
                productId: product._id,
                colorId: product.selectedColor._id,
                sizeId: product.selectedSize._id,
            })),
            ...selectedProducts
                .filter(product => product.productId)
                .map(product => ({
                    productId: product.productId,
                    colorId: product.colorId,
                    sizeId: product.sizeId
                }))
        ];

        const saleData = {
            _id: id,
            products: productsData,
            discount,
            paymentFee,
        };

        dispatch(putSale(saleData)).then(() => {
            navigate(`/main_window/sales/${id}`);
        });
        
    };

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>Editar venta</h2>
                    <div className="titleButtons">
                        <button><Link to={`/main_window/sales/${id}`}>Atrás</Link></button>
                    </div>
                </div>
                <div className={`container ${style.content}`}>
                    {saleDetail.orderNumber && <div className={style.orderNumber}><span>N° de orden:</span> {saleDetail.orderNumber}</div>}
                    <div className={style.row}>
                        {saleDetail.client
                            ?  <p>
                                    <span>Cliente:&nbsp;</span>{saleDetail.client.dni} - {saleDetail.client.name} {saleDetail.client.lastname}
                                    <Link to={`/main_window/clients/${saleDetail.client._id}`}>
                                        <img src={detail} alt=""/>
                                    </Link>
                                </p>
                            : <p><span>Cliente:&nbsp;</span> Anónimo</p>}
                        {saleDetail.paymentMethod && <p><span>Modo de pago:&nbsp;</span> {saleDetail.paymentMethod}</p>}
                        {saleDetail.soldAt && <p><span>Tipo de venta:&nbsp;</span> {saleDetail.soldAt}</p>}
                    </div>
                    <div className={style.row}>
                        <form onSubmit={handleSubmit}>
                            <div className={style.column}>
                                <div className={style.section}>
                                    <label>Productos Comprados:</label>
                                    <ul>
                                        {purchasedProducts.map((product, index) => (
                                            <li key={index}>
                                                <span>{product.name}</span>
                                                <button type="button" onClick={() => handleRemoveProduct(index, true)}>
                                                    <img src={x} alt="Eliminar" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={style.section}>
                                    <label>Seleccionar Productos:</label>
                                    {selectedProducts.map((product, index) => (
                                        <div key={index} className={style.productSelector}>
                                            <AsyncSelect
                                                ref={(el) => (productRefs.current[index] = el)}
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={loadProductOptions}
                                                onChange={(option) => handleProductChange(option, index)}
                                                value={product.productId ? {
                                                    label: `${product.productId} - ${product.colorId} - ${product.sizeId}`,
                                                    value: product.productId
                                                } : null}
                                                components={{ DropdownIndicator }}
                                                noOptionsMessage={customNoOptionsMessage}
                                            />
                                            {selectedProducts.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveProduct(index, false)}>
                                                    <img src={x} alt="Eliminar" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={style.column}>
                                <div className={style.section}>
                                    <label>Descuento:</label>
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={handleDiscountChange}
                                    />
                                </div>
                                <div className={style.section}>
                                    <label>Costo de Pago:</label>
                                    <input
                                        type="number"
                                        value={paymentFee}
                                        onChange={handlePaymentFeeChange}
                                    />
                                </div>
                                <div className={style.section}>
                                    <label>Retención:</label>
                                    <input type="text" value={formatNumber(retention)} disabled />
                                </div>
                                <div className={style.section}>
                                    <label>Total con Retención:</label>
                                    <input type="text" value={formatNumber(totalWithRetention)} disabled />
                                </div>
                                <div className={style.section}>
                                    <button type="submit">Guardar Cambios</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default DetailSale;
