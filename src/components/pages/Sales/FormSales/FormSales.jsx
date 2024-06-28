import React, { useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../../redux/productActions.js';
import { getClients } from '../../../../redux/clientActions.js';

const FormSales = () => {
    const products = useSelector(state => state.products.products);
    const clients = useSelector(state => state.clients.clients);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getClients());
    }, [dispatch]);

    const paymentMethods = ['Efectivo', 'Credito', 'Debito', 'Transferencia'];
    const [selectedProducts, setSelectedProducts] = useState([null]);

    const productRefs = useRef([]);

    const transformProductOptions = (products) => {
        let productOptions = [];
        products.forEach(product => {
            product.color.forEach(color => {
                color.size.forEach(size => {
                    if (size.stock > 0) {
                        productOptions.push({
                            value: `${product._id}-${color.colorName}-${size.sizeName}`,
                            label: `${product.name} - ${color.colorName} - Talle ${size.sizeName}`
                        });
                    }
                });
            });
        });
        return productOptions;
    };

    const loadProductOptions = (inputValue, callback) => {
        const productOptions = transformProductOptions(products);
        const filteredOptions = productOptions.filter(product =>
            product.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
    };

    const handleProductChange = (selectedOption, index) => {
        setSelectedProducts((prevSelectedProducts) => {
            const newSelectedProducts = [...prevSelectedProducts];
            newSelectedProducts[index] = selectedOption;

            // Agregar una nueva línea si la última línea tiene un producto seleccionado
            if (index === newSelectedProducts.length - 1 && selectedOption) {
                newSelectedProducts.push(null);
                setTimeout(() => {
                    productRefs.current[index + 1].focus();
                }, 0);
            }

            console.log(newSelectedProducts);
            return newSelectedProducts;
        });
    };

    return (
        <div>
            <form>
                <h2>NUEVA VENTA</h2>
                <div>Número de orden: <span>0000</span></div>
                <label htmlFor="client">Cliente</label>
                <select name="client">
                    {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name + ' ' + client.lastname}</option>
                    ))}
                </select>
                <label htmlFor="paymentMethod">Medio de pago</label>
                <select name="paymentMethod" placeholder="Seleccionar">
                    {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </select>
                <label htmlFor="discount">Descuento</label>
                <input 
                    name="discount" 
                    placeholder='%' 
                    value={0} 
                    onChange={(e) => (e.target.value)}
                />
                <label>Productos</label>
                {selectedProducts.map((product, index) => (
                    <AsyncSelect
                        key={index}
                        value={product}
                        loadOptions={loadProductOptions}
                        onChange={(selectedOption) => handleProductChange(selectedOption, index)}
                        placeholder="Buscar producto"
                        ref={(el) => productRefs.current[index] = el}
                    />
                ))}
            </form>
        </div>
    );
};

export default FormSales;
