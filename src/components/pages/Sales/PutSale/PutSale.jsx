import React, { useState, useEffect, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { getSaleById, clearSaleDetail, putSale } from '../../../../redux/saleActions.js';
import { getProducts, getProductById, reduceStock, increaseStock } from '../../../../redux/productActions.js';
import { putRemovePurchases, putAddProducts } from '../../../../redux/clientActions.js';
import style from "./PutSale.module.css";
import detail from "../../../../assets/img/detail.png";
import x from "./img/x.png";

const PutSale = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const saleDetail = useSelector(state => state.sales.saleDetail);
    const products = useSelector(state => state.products.products);

    const [withShipping, setWithShipping] = useState(false);
    const [shipment, setShipment] = useState({ address: '', amount: '' });
    const [selectedAddressOption, setSelectedAddressOption] = useState(null);
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [deletedPurchasedProducts, setDeletedPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([{ productId: null, colorId: null, sizeId: null, price: null }]);
    const [selectedProductQuantities, setSelectedProductQuantities] = useState({});
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentFee, setPaymentFee] = useState(0);
    const [total, setTotal] = useState(0);
    const [previousTotal, setPreviousTotal] = useState(0);
    const productRefs = useRef([]);
    const [editableSubtotal, setEditableSubtotal] = useState(0); 
    const [isEditingSubtotal, setIsEditingSubtotal] = useState(false);

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;

        if (name === "withShipping") {
            setWithShipping(checked);
            if (!checked) {
                setSelectedAddressOption(null);
                setShipment({ address: "", amount: '' });
            }
        }
    };

    const getClientAddressOptions = () => {
        if (!saleDetail.client?.addresses?.length) return [];

        return saleDetail.client?.addresses?.map(address => ({
            value: address._id,
            label: `${address.name} - ${address.street} N° ${address.number}, ${address.city}`,
            fullAddress: address
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'shippingCost') {
            const numericValue = value === '' ? 0 : Number(value);
            setShipment(prev => ({
                ...prev,
                amount: numericValue
            }));
        }
    };

    const clientInputStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '20px',
            fontSize: '0.75rem',
            borderColor: state.isFocused ? '#e4b61a' : provided.borderColor,
            boxShadow: state.isFocused ? '0 0 0 1px #e4b61a' : provided.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? '#e4b61a' : provided.borderColor,
            }
        }),
        input: (provided) => ({
            ...provided,
            color: '#3c3c3b',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#797979',
            fontStyle: 'italic'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#3c3c3b',
            padding: 0
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#000' : '#555',
            padding: '10px',
            fontSize: '0.75rem'
        }),
    };

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
                            label: `${product.name} - ${color.colorName} - Talle ${size.sizeName} - $${formatNumber(product.price)}`,
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
            const key = `${product.productId}_${product.colorId}_${product.sizeId}_${product.price}`;
            const selectedQuantity = selectedProductQuantities[key] || 0;
            const availableStock = product.stock - selectedQuantity;

            return availableStock > 0 && product.label.toLowerCase().includes(inputValue.toLowerCase());
        });
        callback(filteredOptions);
    };

    const calculateSubtotal = (products) => {
        return products.reduce((subtotal, product) => {
            return subtotal + (product.price || 0);
        }, 0);
    };

    const formatNumber = (number) => {
        if (number !== null && number !== undefined) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return '0';
    };

    const handleProductChange = (selectedOption, index) => {
        setSelectedProducts((prevSelectedProducts) => {
            const newSelectedProducts = [...prevSelectedProducts];
            newSelectedProducts[index] = selectedOption ? { ...selectedOption } : { productId: null, colorId: null, sizeId: null, price: null };
    
            if (index === newSelectedProducts.length - 1 && selectedOption) {
                newSelectedProducts.push({ productId: null, colorId: null, sizeId: null, price: null });
                setTimeout(() => {
                    productRefs.current[index + 1].focus();
                }, 0);
            }
    
            setSelectedProductQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities };
                const key = selectedOption ? `${selectedOption.productId}_${selectedOption.colorId}_${selectedOption.sizeId}_${selectedOption.price}` : null;
                
                if (selectedOption) {
                    newQuantities[key] = (newQuantities[key] || 0) + 1;
                } else {
                    if (newQuantities[key]) {
                        newQuantities[key]--;
                        if (newQuantities[key] <= 0) delete newQuantities[key];
                    }
                }
                return newQuantities;
            });
    
            const updatedSubtotal = calculateSubtotal([...newSelectedProducts, ...purchasedProducts]);
            setSubtotal(updatedSubtotal);
            setTotal(updatedSubtotal - ((updatedSubtotal * discount) / 100));  // Update total without retention
    
            return newSelectedProducts;
        });
    };

    const handleRemoveProduct = (index, fromPurchased) => {
        if (fromPurchased) {
            setPurchasedProducts((prevPurchasedProducts) => {
                const newPurchasedProducts = [...prevPurchasedProducts];
                const removedProduct = newPurchasedProducts.splice(index, 1)[0];
    
                // Agregar el producto eliminado al estado deletedPurchasedProducts
                setDeletedPurchasedProducts((prevDeleted) => [...prevDeleted, removedProduct]);
    
                const newSubtotal = calculateSubtotal([...newPurchasedProducts, ...selectedProducts]);
                setSubtotal(newSubtotal);
                setTotal(newSubtotal - ((newSubtotal * discount) / 100));  // Update total without retention
                return newPurchasedProducts;
            });
        } else {
            setSelectedProducts((prevSelectedProducts) => {
                const newSelectedProducts = [...prevSelectedProducts];
                newSelectedProducts.splice(index, 1);
                const newSubtotal = calculateSubtotal([...purchasedProducts, ...newSelectedProducts]);
                setSubtotal(newSubtotal);
                setTotal(newSubtotal - ((newSubtotal * discount) / 100));  // Update total without retention
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
        if (!saleDetail) return;

        if (!loading && saleDetail && saleDetail.products) {
            const updatedProducts = [];
            saleDetail.products.forEach((product) => {
                dispatch(getProductById(product.productId)).then((response) => {
                    if (response && response.error && response.error.status === 404) {
                        updatedProducts.push({
                            name: 'Producto no disponible',
                            selectedColor: null,
                            selectedSize: null,
                            price: product.price,
                        });
                    } else {
                        const productInfo = response;
                        const selectedColor = getColorById(productInfo, product.colorId);
                        const selectedSize = getSizeById(productInfo, product.colorId, product.sizeId);
        
                        updatedProducts.push({ 
                            ...productInfo, 
                            selectedColor, 
                            selectedSize,
                            price: product.price // Precio almacenado en la venta
                        });
                    }
        
                    if (updatedProducts.length === saleDetail.products.length) {
                        setPurchasedProducts(updatedProducts);
                        const initialSubtotal = calculateSubtotal(updatedProducts);
                        setSubtotal(initialSubtotal);
                        setPreviousTotal(initialSubtotal - ((initialSubtotal * saleDetail.discount) / 100)); // Almacenar el total previo
                        setTotal(initialSubtotal - ((initialSubtotal * discount) / 100));  // Initialize total without retention
                    }
                });
            });
        } else {
            setPurchasedProducts([]);
        }

        const hasAddress = saleDetail.shipment !== null;
        const hasClient = saleDetail.client !== null;

        setWithShipping(hasClient && hasAddress);

        setShipment({
            address: saleDetail.shipment?.address || '',
            amount: saleDetail.shipment?.amount || ''
        });

        if (hasAddress && saleDetail.shipment?.address) {
            const addressList = getClientAddressOptions() || [];
            const matched = addressList.find(opt => opt.label === saleDetail?.shipment?.address);
            if (matched) {
                setSelectedAddressOption(matched);
            }
        }
        
    }, [saleDetail, dispatch, loading, discount]);

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
        setTotal(subtotal - ((subtotal * newDiscount) / 100));  // Update total without retention
    };

    const handlePaymentFeeChange = (e) => {
        const newPaymentFee = parseFloat(e.target.value) || 0;
        setPaymentFee(newPaymentFee);
    };

    const handleEditSubtotalToggle = () => {
        setIsEditingSubtotal(!isEditingSubtotal);
        if (!isEditingSubtotal) {
            setEditableSubtotal(subtotal); // Establecer el subtotal actual al iniciar la edición
        }
    };

    const handleEditableSubtotalChange = (e) => {
        const newSubtotal = parseFloat(e.target.value) || 0;
        setEditableSubtotal(newSubtotal);
    };

    const saveNewSubTotal = () => {
        setSubtotal(editableSubtotal);
        setTotal(editableSubtotal - ((editableSubtotal * discount) / 100));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Calcular los productos a enviar con la información necesaria
        const productsData = [
            ...purchasedProducts?.map(product => ({
                productId: product._id,
                colorId: product.selectedColor._id,
                sizeId: product.selectedSize._id,
                price: product.price
            })),
            ...selectedProducts
                .filter(product => product.productId)
                .map(product => ({
                    productId: product.productId,
                    colorId: product.colorId,
                    sizeId: product.sizeId,
                    price: product.price
                }))
        ];

        const shipmentData = withShipping && shipment.address !== ''
        ? {
            address: shipment.address,
            amount: shipment.amount || 0
        }
        : null;
    
        // Construir objeto de venta
        const saleData = {
            _id: id,
            shipment: shipmentData,
            products: productsData,
            discount,
            paymentFee,
            subtotal: isEditingSubtotal ? editableSubtotal : null // Incluir el subtotal editable si está en modo edición
        };   
        
        deletedPurchasedProducts.forEach(product => {
            const key = `${product._id}_${product.selectedColor._id}_${product.selectedSize._id}`;

            dispatch(increaseStock({
                _id: product._id,
                idColor: product.selectedColor._id,
                idSize: product.selectedSize._id,
                stockToIncrease: 1
            }))
            .catch(error => {
                console.error("Error incrementando el stock:", error);
            });

            if(saleDetail.client){

                let clientData = {
                    _id: saleDetail.client._id,
                    purchasesToRemove: [
                        {
                            productId: product._id,
                            colorId: product.selectedColor._id,
                            sizeId: product.selectedSize._id,
                            price: product.price
                        }
                    ]
                }
                dispatch(putRemovePurchases(clientData));
            };
            
        });

        selectedProducts.forEach(product => {
            if (product.productId) {
                const key = `${product.productId}_${product.colorId}_${product.sizeId}`;
                const prevProduct = purchasedProducts.find(p => p._id === product.productId && p.selectedColor._id === product.colorId && p.selectedSize._id === product.sizeId);

                if (!prevProduct) {
                    // El producto es nuevo, así que debe reducirse el stock
                    dispatch(reduceStock({
                        _id: product.productId,
                        idColor: product.colorId,
                        idSize: product.sizeId,
                        stockToReduce: 1
                    }))
                    .catch(error => {
                        console.error("Error reduciendo el stock:", error);
                    });

                    if(saleDetail.client){

                        let clientData = {
                            _id: saleDetail.client._id,
                            purchases: [
                                {
                                    productId: product.productId,
                                    colorId: product.colorId,
                                    sizeId: product.sizeId,
                                    price: product.price
                                }
                            ]
                        }
                        dispatch(putAddProducts(clientData));
                    };
                }
            }
        });
    
        // Realizar la actualización de la venta
        dispatch(putSale(saleData)).then(() => {
            // Navegar después de guardar
            navigate(`/main_window/sales/${id}`);
        }).catch(error => {
            console.error("Error actualizando la venta:", error);
        });
    };
    
    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>Editar venta</h2>
                    <div className="titleButtons">
                        <button onClick={() => navigate(`/main_window/sales/${id}`)}>Atrás</button>
                    </div>
                </div>
                <div className={`container ${style.content}`}>
                    {saleDetail.orderNumber && <div className={style.orderNumber}><span>N° de orden:</span> {saleDetail.orderNumber}</div>}
                    <div className={style.row}>
                        {saleDetail.client
                            ?  <p>
                                    <span>Cliente:&nbsp;</span>{saleDetail.client.dni} - {saleDetail.client.name} {saleDetail.client.lastname}
                                    <a onClick={() => navigate(`/main_window/clients/${saleDetail.client._id}`)}>
                                        <img src={detail} alt=""/>
                                    </a>
                                </p>
                            : <p><span>Cliente:&nbsp;</span> Anónimo</p>}
                        {saleDetail.paymentMethod && <p><span>Modo de pago:&nbsp;</span> {saleDetail.paymentMethod}</p>}
                        {saleDetail.soldAt && <p><span>Tipo de venta:&nbsp;</span> {saleDetail.soldAt}</p>}
                    </div>
                    <div className={style.row}>
                        <form onSubmit={handleSubmit}>
                            <div className={style.column}>
                                <div className={style.containerInputCheckbox}>
                                    <input 
                                        className={style.inputCheckbox} 
                                        type="checkbox" 
                                        name="withShipping"
                                        checked={withShipping}
                                        onChange={handleCheckbox}
                                        disabled={saleDetail?.client === null}
                                    />
                                    <span>Con envío</span>
                                </div>
                                <div className={style.labelInput}>
                                    <div className={style.left}>
                                        <label htmlFor="shipment">Dirección de envío</label>
                                    </div>
                                    <div className={style.right}>
                                        <Select
                                            name="shipment"
                                            value={selectedAddressOption}
                                            onChange={(selectedOption) => {
                                                if (!selectedOption) return;

                                                const selected = selectedOption.fullAddress;

                                                setSelectedAddressOption(selectedOption);
                                                setShipment(prev => ({
                                                    ...prev,
                                                    address: `${selected.name} - ${selected.street} N° ${selected.number}, ${selected.city}`
                                                }));
                                            }}
                                            options={getClientAddressOptions()}
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                ...clientInputStyles
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            noOptionsMessage={() => "No hay direcciones registradas"}
                                            placeholder="Seleccionar"
                                            isDisabled={!withShipping}
                                        />
                                    </div>
                                </div>
                                <div className={style.labelInput}>
                                    <div className={style.left}>
                                        <label htmlFor="shippingCost">Costo de envío $</label>
                                    </div>
                                    <div className={style.right}>
                                        <input 
                                            className={style.discount}
                                            type='number'
                                            name="shippingCost"
                                            placeholder='0'
                                            min='0'
                                            value={shipment.amount}
                                            onChange={handleInputChange}
                                            onWheel={(e) => e.target.blur()}
                                            disabled={!withShipping || selectedAddressOption === null}
                                        />
                                    </div>
                                </div>
                                <div className={style.section}>
                                    <p className={style.products}><span>Productos Comprados:</span></p>
                                    <ul>
                                        {purchasedProducts?.map((product, index) => (
                                            <li key={index}>
                                                {`${product.name} - ${product.selectedColor?.colorName} - Talle ${product.selectedSize?.sizeName} - Precio $${formatNumber(product.price)}`}
                                                <button type="button" onClick={() => handleRemoveProduct(index, true)}>
                                                    <img src={x} alt="Eliminar" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={style.section}>
                                    <p className={style.products}><span>Seleccionar Productos:</span></p>
                                    {selectedProducts.map((product, index) => (
                                        <div key={index} className={style.productSelectorDiv}>
                                            <div className={style.productSelector}>
                                                <AsyncSelect
                                                    ref={(el) => (productRefs.current[index] = el)}
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadProductOptions}
                                                    onChange={(option) => handleProductChange(option, index)}
                                                    value={product.productId ? product : null}
                                                    components={{ DropdownIndicator }}
                                                    noOptionsMessage={customNoOptionsMessage}
                                                    
                                                />
                                            </div>
                                            
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
                                    <p><span>Subtotal: </span>
                                        {isEditingSubtotal ? (
                                            <div>
                                                <input
                                                    type="number"
                                                    value={editableSubtotal}
                                                    onChange={handleEditableSubtotalChange}
                                                    onWheel={(e) => e.target.blur()}
                                                />
                                                <button type="button" onClick={saveNewSubTotal}>Actualizar</button>
                                            </div>
                                        ) : (
                                            <div>
                                                ${formatNumber(subtotal)}
                                                <button type="button" onClick={handleEditSubtotalToggle}>Editar subtotal</button>
                                            </div>
                                        )}
                                    </p>
                                </div>
                                <div className={style.section}>
                                    <p>
                                        <label>Descuento (porcentaje):&nbsp;</label>
                                        <input
                                            type="number"
                                            value={discount}
                                            onChange={handleDiscountChange}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </p>
                                </div>
                                <div className={style.section}>
                                    <p><span>Descuento (en pesos): </span>- ${formatNumber((subtotal * discount) / 100)}</p>
                                </div>
                                <div className={style.section}>
                                    <p>
                                        <label>Retención (porcentaje):&nbsp;</label>
                                        <input
                                            type="number"
                                            value={paymentFee}
                                            onChange={handlePaymentFeeChange}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </p>
                                </div>
                                <div className={style.section}>
                                    <p><span>Retención (en pesos): </span>- ${formatNumber((total * paymentFee) / 100)}</p>
                                </div>
                                <div className={style.section}>
                                    <p><span>Total con Retención: </span>{formatNumber(total - ((total * paymentFee) / 100))}</p>
                                </div>
                                <div className={style.section}>
                                    <p><span>Total: </span>{formatNumber(total)}</p>
                                </div>
                                <div className={style.section}>
                                    <p>{previousTotal > total ?
                                    `Saldo a favor del cliente $${formatNumber(previousTotal - total)}` :
                                    `El cliente debe abonar una diferencia de $${formatNumber(total - previousTotal)}`}</p>
                                </div>
                                <div className={style.section}>
                                    <button className={style.buttonSubmit} type="submit">Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default PutSale;