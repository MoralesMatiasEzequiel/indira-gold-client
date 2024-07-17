import React, { useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../../redux/productActions.js';
import { getClients } from '../../../../redux/clientActions.js';
import { getSales, postSale } from '../../../../redux/saleActions.js';
import FormClient from '../../Clients/FormClient/FormClient.jsx';
import NewSale from '../NewSale/NewSale.jsx';
import style from "./FormSales.module.css"
import add from "./img/add.png";
import x from "./img/x.png";

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
    const paymentMethods = [
        { value: 'Efectivo', label: 'Efectivo' },
        { value: 'Crédito', label: 'Crédito' },
        { value: 'Débito', label: 'Débito' },
        { value: 'Transferencia', label: 'Transferencia' }
    ];
    const [selectedProducts, setSelectedProducts] = useState([null]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [clientOptions, setClientOptions] = useState([]);
    const [selectKey, setSelectKey] = useState(Date.now());
    const [saleMade, setSaleMade] = useState(false);
    const [saleResponse, setSaleResponse] = useState(null);

    const initialSaleState = {
        client: '',
        paymentMethod: '',
        soldAt: '',
        discount: '',
        products: []
    };
    const [newSale, setNewSale] = useState(initialSaleState);

    const productRefs = useRef([]);

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
        clientOptions.unshift({ value: '', label: 'Anónimo' });
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

    const productInputStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '20px',
            fontSize: '0.75rem',
            width: '100%',
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

    const handleProductChange = (selectedOption, index) => {
        setSelectedProducts((prevSelectedProducts) => {
            const newSelectedProducts = [...prevSelectedProducts];
            newSelectedProducts[index] = selectedOption ? selectedOption.value : null;

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
            newSelectedProducts.splice(index, 1);
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

    const handlePaymentMethodChange = (selectedOption) => {
        setNewSale((prevNewSale) => ({
            ...prevNewSale,
            paymentMethod: selectedOption ? selectedOption.value : ''
        }));
        validateForm();
    };

    const validateForm = () => {
        const isClientSelected = selectedClient !== null;
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
        return null;
    };

    const customNoOptionsMessage = () => "Nombre del producto buscado";

    const handleShowClientForm = () => {
        setShowClientForm(!showClientForm);
    };

    const toggleSaleMade = () => {
        setSaleMade(prevSaleMade => !prevSaleMade);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const productsToSend = selectedProducts.filter(product => product !== null);
        const saleData = {
            ...newSale,
            discount: newSale.discount === '' ? 0 : newSale.discount,
            products: productsToSend
        };
        dispatch(postSale(saleData)).then((response) => {
            setSaleResponse(response);
            
            // Resetear el formulario
            setNewSale(initialSaleState);
            setSelectedProducts([null]);
            setSubtotal(0);
            setSelectedClient(null);
            setIsSubmitDisabled(true);

            toggleSaleMade();
        });
    };

    const handleClientAdded = (newClient) => {
        setShowClientForm(false);
        if(newClient !== undefined){
            setSelectedClient({ value: newClient._id, label: `${newClient.name} ${newClient.lastname}` });
        }

        if(newClient !== undefined){
            setNewSale((prevNewSale) => ({
                ...prevNewSale,
                client: newClient._id
            }));
        }

        validateForm();
    };

    return (
 
        <div className="component">
            <div className="title" style={{ display: saleMade ? 'none' : 'block' }}>
                <h2>NUEVA VENTA</h2>
            </div>
            <div className="container" style={{ display: saleMade ? 'none' : 'block' }}>
                <form onSubmit={handleSubmit} className={style.salesForm}>
                    <div className={style.column1}>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="client">Cliente</label>
                            </div>
                            <div className={style.right}>
                                <div className={style.clientInput}>
                                    <AsyncSelect
                                        key={selectKey}
                                        cacheOptions
                                        name="client"
                                        value={selectedClient}
                                        loadOptions={loadClientOptions}
                                        onChange={handleClientChange}
                                        placeholder="Buscar Cliente"
                                        defaultOptions={clientOptions}
                                        styles={clientInputStyles}
                                    />
                                    <button type="button" onClick={handleShowClientForm} className={style.addClient}><img src={add} alt=""/></button>
                                </div>
                                
                            </div>
                        </div>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="paymentMethod">Medio de pago</label>
                            </div>
                            <div className={style.right}>
                                <Select
                                    name="paymentMethod"
                                    value={paymentMethods.find(method => method.value === newSale.paymentMethod)}
                                    onChange={handlePaymentMethodChange}
                                    options={paymentMethods}
                                    styles={clientInputStyles}
                                    placeholder="Seleccionar"
                                />
                            </div>
                        </div>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="discount">Descuento</label>
                            </div>
                            <div className={style.right}>
                                <input 
                                    name="discount"
                                    placeholder='%'
                                    value={newSale.discount}
                                    onChange={handleInputChange}
                                    className={style.discount}
                                    type='number'
                                />
                            </div>
                        </div>
                        <div className={style.labelInput}>
                            <div className={style.left}>
                                <label htmlFor="soldAt">Tipo de venta</label>
                            </div>
                            <div className={style.right}>
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
                    </div>
                    <div className={style.column2}>
                        <label htmlFor="products">Productos</label>
                        {selectedProducts.map((product, index) => (
                            <div key={index} className={style.product}>
                                
                                <div className={style.productSelect}>
                                    <AsyncSelect
                                        name="products"
                                        value={product ? { value: product, label: transformProductOptions(products).find(p => p.value === product)?.label } : null}
                                        loadOptions={loadProductOptions}
                                        onChange={(selectedOption) => handleProductChange(selectedOption, index)}
                                        placeholder="Buscar Producto"
                                        ref={(element) => productRefs.current[index] = element}
                                        components={{DropdownIndicator}}
                                        noOptionsMessage={customNoOptionsMessage}
                                        styles={productInputStyles}
                                    />
                                </div>
                                {index ? <button type="button" onClick={() => handleRemoveProduct(index)} className={style.removeProduct}><img src={x} alt=""/></button> : ''}
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
                            <div className={style.right}>- ${formatNumber(subtotal * newSale.discount / 100)}</div>
                        </div>
                        <div className={style.total}>
                            <div className={style.left}>Total</div>
                            <div className={style.right}>${formatNumber(subtotal * (1 - newSale.discount / 100))}</div>
                        </div>
                        <button type="submit" disabled={isSubmitDisabled}>Aceptar</button>
                    </div> 
                </form>
                <div className={`${style.addClientComponent} ${showClientForm ? style.addClientComponentBorder : ''}`}>
                    {showClientForm && <FormClient onClientAdded={handleClientAdded} />}
                </div>
            </div>
            
            {saleMade ? (
                <div className={`${style.newSaleModal} ${"component"}`}>
                    <div className="title">
                        <h2>NUEVA VENTA REGISTRADA</h2>
                        <button onClick={toggleSaleMade}>X</button>
                    </div>
                    <NewSale saleResponse={saleResponse}/>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default FormSales;
