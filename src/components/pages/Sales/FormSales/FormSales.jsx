import React, { useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../../redux/productActions.js';
import { getClients } from '../../../../redux/clientActions.js';
import { postSale } from '../../../../redux/saleActions.js';

const FormSales = () => {
    const products = useSelector(state => state.products.products);
    const clients = useSelector(state => state.clients.clients);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getClients());
    }, [dispatch]);

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const paymentMethods = ['Efectivo', 'Crédito', 'Débito', 'Transferencia'];
    const [selectedProducts, setSelectedProducts] = useState([null]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [newSale, setNewSale] = useState({
        client: '',
        paymentMethod: '',
        soldAt: '',
        discount: 0,
        products: []
    });

    const productRefs = useRef([]); // Referencias a los campos de productos

    // Transformar productos a opciones para el select
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

    // Transformar clientes a opciones para el select
    const transformClientOptions = (clients) => {
        const clientOptions = clients.map(client => ({
            value: client._id,
            label: `${client.name} ${client.lastname}`
        }));
        clientOptions.unshift({ value: '', label: 'Anónimo' }); // Opción para cliente anónimo
        return clientOptions;
    };

    // Cargar opciones de productos para el select
    const loadProductOptions = (inputValue, callback) => {
        const productOptions = transformProductOptions(products);
        const filteredOptions = productOptions.filter(product =>
            product.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
    };

    // Cargar opciones de clientes para el select
    const loadClientOptions = (inputValue, callback) => {
        const clientOptions = transformClientOptions(clients);
        const filteredOptions = clientOptions.filter(client =>
            client.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
    };

    // Calcular el subtotal de los productos seleccionados
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

    // Formatear números según el formato español
    const formatNumber = (number) => {
        return number.toLocaleString('es-ES');
    };

    // Manejar el cambio de productos seleccionados
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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>NUEVA VENTA</h2>
                <label htmlFor="client">Cliente</label>
                <AsyncSelect
                    name="client"
                    value={selectedClient}
                    loadOptions={loadClientOptions}
                    onChange={handleClientChange}
                    placeholder="Buscar Cliente"
                    defaultOptions={transformClientOptions(clients)}
                />
                <label htmlFor="paymentMethod">Medio de pago</label>
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
                <label htmlFor="discount">Descuento</label>
                <input 
                    name="discount"
                    placeholder='%'
                    value={newSale.discount}
                    onChange={handleInputChange}
                />

                <input
                    type="radio"
                    name="soldAt"
                    value="Local"
                    checked={newSale.soldAt === 'Local'}
                    onChange={handleInputChange}
                />
                <label htmlFor="Local">Local</label>
                <input
                    type="radio"
                    name="soldAt"
                    value="Online"
                    checked={newSale.soldAt === 'Online'}
                    onChange={handleInputChange}
                />
                <label htmlFor="Online">Online</label>

                <label htmlFor="products">Productos</label>
                {selectedProducts.map((product, index) => (
                    <AsyncSelect
                        name="products"
                        key={index}
                        value={product ? { value: product, label: transformProductOptions(products).find(p => p.value === product)?.label } : null}
                        loadOptions={loadProductOptions}
                        onChange={(selectedOption) => handleProductChange(selectedOption, index)}
                        placeholder="Buscar Producto"
                        ref={(element) => productRefs.current[index] = element}
                    />
                ))}
                <div>
                    <div>Subtotal</div>
                    <div>Descuento</div>
                    <div>Total</div>
                </div>
                <div>
                    <div>${formatNumber(subtotal)}</div>
                    <div>{newSale.discount}%</div>
                    <div>${formatNumber(subtotal * (1 - newSale.discount / 100))}</div>
                </div>
                <button type="submit" disabled={isSubmitDisabled}>Aceptar</button>
            </form>
        </div>
    );
};

export default FormSales;
