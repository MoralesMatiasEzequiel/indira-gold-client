import React, { useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../../redux/productActions.js';
import { getClients } from '../../../../redux/clientActions.js';
import { postSale } from '../../../../redux/saleActions.js';
import FormClient from '../../Clients/FormClient/FormClient.jsx';
import style from "./FormSales.module.css"

const FormSales = () => {
    const products = useSelector(state => state.products.products);
    const clients = useSelector(state => state.clients.clients);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getClients());
    }, [dispatch]);

    const [showClientForm, setShowClientForm] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const paymentMethods = ['Efectivo', 'Crédito', 'Débito', 'Transferencia'];
    const [selectedProducts, setSelectedProducts] = useState([null]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [clientOptions, setClientOptions] = useState([]);
    const [selectKey, setSelectKey] = useState(Date.now());

    const initialSaleState = {
        client: '',
        paymentMethod: '',
        soldAt: '',
        discount: 0,
        products: []
    };
    const [newSale, setNewSale] = useState(initialSaleState);

    const productRefs = useRef([]); // Referencias a los campos de productos

    const transformProductOptions = (products) => {
        let productOptions = [];
        products.forEach(product => {
            product.color.forEach(color => {
                color.size.forEach(size => {
                    if (size.stock > 0) {
                        productOptions.push({
                            value: product._id,
                            label: `${product.name} - ${color.colorName} - Talle ${size.sizeName}`,
                            price: product.price
                        });
                    }
                });
            });
        });
        return productOptions;
    };

    const transformClientOptions = (clients) => {
        const clientOptions = clients.map(client => ({
            value: client._id,
            label: `${client.name} ${client.lastname}`
        }));
        clientOptions.unshift({ value: '', label: 'Anónimo' }); // Opción para cliente anónimo
        return clientOptions;
    };

    const loadProductOptions = (inputValue, callback) => {
        const productOptions = transformProductOptions(products);
        const filteredOptions = productOptions.filter(product =>
            product.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
    };

    const loadClientOptions = (inputValue, callback) => {
        const filteredOptions = clientOptions.filter(client =>
            client.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
    };

    const calculateSubtotal = (selectedProducts) => {
        let subtotal = 0;
        selectedProducts.forEach(productId => {
            if (productId) {
                const product = products.find(p => p._id === productId);
                if (product) {
                    subtotal += product.price;
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
            newSelectedProducts[index] = selectedOption ? selectedOption.value : null; // Almacenar solo el _id
    
            if (index === newSelectedProducts.length - 1 && selectedOption) {
                newSelectedProducts.push(null);
                setTimeout(() => {
                    productRefs.current[index + 1].focus();
                }, 0);
            }
    
            setSubtotal(calculateSubtotal(newSelectedProducts));
            validateForm();
            return newSelectedProducts;
        });
    };

    const handleRemoveProduct = (index) => {
        setSelectedProducts((prevSelectedProducts) => {
            const newSelectedProducts = [...prevSelectedProducts];
            newSelectedProducts.splice(index, 1); // Eliminar el producto en el índice especificado
            setSubtotal(calculateSubtotal(newSelectedProducts));
            validateForm();
            return newSelectedProducts;
        });
    };

    const handleClientChange = (selectedOption) => {
        setSelectedClient(selectedOption);
        setNewSale((prevNewSale) => ({
            ...prevNewSale,
            client: selectedOption ? selectedOption.value : ''
        }));
        validateForm();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSale((prevNewSale) => ({
            ...prevNewSale,
            [name]: name === 'discount' ? Number(value) : value
        }));
        validateForm();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const productsToSend = selectedProducts.filter(product => product !== null);

        const saleData = {
            ...newSale,
            products: productsToSend
        };
        console.log(saleData);
        dispatch(postSale(saleData));

        // Resetear el formulario
        setNewSale(initialSaleState);
        setSelectedProducts([null]);
        setSubtotal(0);
        setSelectedClient(null);
        setIsSubmitDisabled(true); // Opcional si quieres deshabilitar el botón después de enviar
    };

    const validateForm = () => {
        const isClientSelected = selectedClient !== null; // Permitir "Anónimo" que tiene valor nulo
        const isPaymentMethodSelected = newSale.paymentMethod !== '';
        const isSoldAtSelected = newSale.soldAt !== '';
        const areProductsSelected = selectedProducts.some(product => product !== null);
        setIsSubmitDisabled(!(isClientSelected && isPaymentMethodSelected && isSoldAtSelected && areProductsSelected));
    };

    useEffect(() => {
        validateForm();
    }, [newSale, selectedProducts]);

    useEffect(() => {
        setClientOptions(transformClientOptions(clients));
        setSelectKey(Date.now());
    }, [clients]);

    const DropdownIndicator = (props) => {
        return null; // Eliminar la flecha del dropdown
    };

    const customNoOptionsMessage = () => "Nombre del producto buscado";

    const handleShowClientForm = () => {
        setShowClientForm(!showClientForm);
    };

    const handleClientAdded = () => {
        setShowClientForm(false);
        dispatch(getClients());
    };

    return (
        <div className="component">

            <div className="title">
                <h2>NUEVA VENTA</h2>
            </div>

            <div className="container">
                <form onSubmit={handleSubmit} className={style.salesForm}>
                    <div className={style.column1}>
                        <div className={style.left}>
                            <label htmlFor="client">Cliente</label>
                            <label htmlFor="paymentMethod">Medio de pago</label>
                            <label htmlFor="discount">Descuento</label>
                            <label htmlFor="soldAt">Tipo de venta</label>
                        </div>
                        <div className={style.right}>
                            <div className={style.clientInput}>
                                <AsyncSelect
                                    key={selectKey} // Forzar re-render cuando las opciones cambian
                                    name="client"
                                    value={selectedClient}
                                    loadOptions={loadClientOptions}
                                    onChange={handleClientChange}
                                    placeholder="Buscar Cliente"
                                    defaultOptions={clientOptions}
                                />
                                <button type="button" onClick={handleShowClientForm}>+</button>
                            </div>
                            <select
                                name="paymentMethod"
                                placeholder="Seleccionar"
                                value={newSale.paymentMethod}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccionar</option>
                                {paymentMethods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                            <input 
                                name="discount"
                                placeholder='%'
                                value={newSale.discount}
                                onChange={handleInputChange}
                            />
                            <div className={style.soldAt}>
                                <label htmlFor="Local">
                                    <input
                                        type="radio"
                                        name="soldAt"
                                        value="Local"
                                        checked={newSale.soldAt === 'Local'}
                                        onChange={handleInputChange}
                                    />
                                    Local
                                </label>
                                
                                <label htmlFor="Online">
                                    <input
                                        type="radio"
                                        name="soldAt"
                                        value="Online"
                                        checked={newSale.soldAt === 'Online'}
                                        onChange={handleInputChange}
                                    />
                                    Online
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className={style.column2}>
                        <label htmlFor="products">Productos</label>
                        {selectedProducts.map((product, index) => (
                            <div key={index}>
                                <AsyncSelect
                                    name="products"
                                    value={product ? { value: product, label: transformProductOptions(products).find(p => p.value === product)?.label } : null}
                                    loadOptions={loadProductOptions}
                                    onChange={(selectedOption) => handleProductChange(selectedOption, index)}
                                    placeholder="Buscar Producto"
                                    ref={(element) => productRefs.current[index] = element}
                                    components={{DropdownIndicator}}
                                    noOptionsMessage={customNoOptionsMessage}
                                />
                                <button type="button" onClick={() => handleRemoveProduct(index)}>X</button>
                            </div>
                        ))}
                    </div>
                    
                    <div className={style.column3}>
                        <div className={style.subtotal}>
                            <div className={style.left}>Subtotal</div>
                            <div className={style.right}>${formatNumber(subtotal)}</div>
                        </div>
                        <div className={style.discount}>
                            <div className={style.left}>Descuento</div>
                            <div className={style.right}>{newSale.discount}%</div>
                            
                        </div>
                        <div className={style.total}>
                            <div className={style.left}>Total</div>
                            <div className={style.right}>${formatNumber(subtotal * (1 - newSale.discount / 100))}</div>
                        </div>
                        
                        <button type="submit" disabled={isSubmitDisabled}>Aceptar</button>
                    </div> 
                </form>
                {showClientForm && <FormClient onClientAdded={handleClientAdded} />}
            </div>
        </div>
    );
};

export default FormSales;
