import style from './FormDebt.module.css';
import iconClear from "../../../../../assets/img/clearForm.png";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { postDebt, getDebts, getActiveDebts } from '../../../../../redux/debtActions.js';
import { getSales } from '../../../../../redux/saleActions.js';

const FormDebt = ({ onDebtAdded = () => {} }) => {

    const dispatch = useDispatch();

    const sales = useSelector(state => state.sales.sales);
    const allDebts = useSelector(state => state.debts.allDebts);

    const initialDebtState = {
        saleId: '',
        amount: null,
    };
 
    const [newDebt, setNewDebt] = useState(initialDebtState);
    const [salesOptions, setSalesOptions] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [totalSale, setTotalSale] = useState(null);
    const [selectKey, setSelectKey] = useState(Date.now());
    const [selectedClient, setSelectedClient] = useState(null);
    const [isClearDisabled, setIsClearDisabled] = useState(true);
    const [debtMade, setDebtMade] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        dispatch(getDebts()); // Carga las deudas al montar el componente
    }, [dispatch]);

    const filterSales = (sales, allDebts) => {
        sales = Array.isArray(sales) ? sales : [];
        allDebts = Array.isArray(allDebts) ? allDebts : []; 
        
        return sales
            .filter(sale => 
                sale?.client &&  // Filtra ventas con cliente
                !allDebts.some(debt => debt?.sale?._id === sale._id)  // No tengan deuda
            )
            .map(sale => ({
                value: sale._id,
                label: `${sale.orderNumber}`
            }));
    };

    useEffect(() => {
        setSalesOptions(filterSales(sales, allDebts));
        setSelectKey(Date.now());
    }, [sales, allDebts]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let newValue = value === '' ? 0 : parseFloat(value);

        if (name === 'amount' && newValue > totalSale) {
            newValue = totalSale;
        }

        setNewDebt((prevDebt) => ({
            ...prevDebt,
            [name]: newValue,
        }));
    };

    const handleDebtChange = (selectedOption) => {
        if(selectedOption) {
            setIsClearDisabled(false);
        }

        const sale = sales.find(sale => sale?._id === selectedOption?.value);

        if (sale.client) {
            setSelectedClient(`${sale?.client.name} ${sale?.client.lastname}`);
        } else {
            setSelectedClient('Anónimo');
        }

        if (sale.totalWithFee) {
            setTotalSale(sale.totalWithFee)
        }

        setSelectedSale(selectedOption);

        setNewDebt((prevNewDebt) => ({
            ...prevNewDebt,
            saleId: selectedOption ? selectedOption.value : ''
        }));
    };

    const debtInputStyles = {
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

    const loadSalesOptions = (inputValue, callback) => {
        if (!inputValue.trim()) {
            return callback([]);
        }
    
        const updatedSalesOptions = filterSales(sales, allDebts); // Usa ventas actualizadas
        const filteredOptions = updatedSalesOptions.filter(sale =>
            sale.label.toLowerCase().startsWith(inputValue.toLowerCase())
        );
    
        callback(filteredOptions);
    };

    const formatNumber = (number) => {
        if (number !== null && number !== undefined) {
            const rounded = Math.round(number); // redondea al entero más cercano
            return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return '0';
    };

    const balance = (totalSale || 0) - (newDebt.amount || 0);

    const handleSetForm = () => {
        setIsSubmitDisabled(true);
        setNewDebt(initialDebtState);
        setSelectedSale(null);
        setTotalSale(null);
        setSelectedClient(null);
        setErrorMessage('');
    };

    const toggleDebtMade = () => {
        setDebtMade(prevDebtMade => !prevDebtMade);
        handleSetForm();
    };

    useEffect(() => {
        setIsSubmitDisabled(!(newDebt.saleId && newDebt.amount !== null));
    }, [newDebt.saleId, newDebt.amount]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
    
        try {
            const response = await dispatch(postDebt(newDebt));
    
            if (typeof response === 'string') {
                setErrorMessage(response);
            } else {
                onDebtAdded(response);
                await dispatch(getDebts()); // Esperamos actualización de deudas    
                await dispatch(getActiveDebts());
                dispatch(getSales()); // Si tienes una acción para actualizar las ventas
                setSalesOptions(filterSales(sales, allDebts)); // Recalcula opciones de ventas
            }

        } catch (error) {
            console.error("Error al registrar la deuda:", error);
        }
    
        handleSetForm();
    };
    

    return (
        <div className="component">
            {debtMade ? (
                <div className={`${style.newSaleModal} ${"component"}`}>
                    <div className="title">
                        <h2>NUEVA DEUDA REGISTRADA</h2>
                        <div className="titleButtons">
                            <button className="delete" onClick={toggleDebtMade}>X</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="component">
                    <div className="title">
                        <h2>NUEVA DEUDA</h2>
                        <div className="titleButtons">
                            <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button>
                        </div>
                    </div>
                    <div className="container" style={{ display: debtMade ? 'none' : 'block' }}>
                        <form onSubmit={handleSubmit} className={style.salesForm}>
                            <div className={style.column1}>
                                <div className={style.labelInput}>
                                    <div className={style.left}>
                                        <label htmlFor="orderNumber">N° de orden</label>
                                    </div>
                                    <div className={style.right}>
                                        <div>
                                            <AsyncSelect
                                                key={selectKey}
                                                name="orderNumber"
                                                cacheOptions
                                                value={selectedSale || ''}
                                                loadOptions={loadSalesOptions}
                                                onChange={handleDebtChange}
                                                placeholder="Buscar venta"
                                                defaultOptions={[]} // No mostrar opciones hasta que se escriba algo
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    ...debtInputStyles
                                                }}
                                                noOptionsMessage={({ inputValue }) => 
                                                    inputValue.trim() ? "No hay ventas disponibles" : "Ingrese número de orden"
                                                }
                                            />
                                        </div>                                 
                                    </div>
                                </div>
                                <div className={style.labelInput}>
                                    <div className={style.left}>
                                        <label htmlFor="amount">Pago realizado $</label>
                                    </div>
                                    <div className={style.right}>
                                        <input 
                                            className={style.discount}
                                            type='number'
                                            name="amount"
                                            value={newDebt.amount ?? ''}
                                            onChange={handleInputChange}
                                            placeholder='0'
                                            min='0'
                                            max={totalSale ?? 0}
                                            onWheel={(event) => event.target.blur()}
                                            onKeyDown={(e) => {
                                                if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === '-') {
                                                    e.preventDefault(); // Bloquea decimales, notación científica y negativos
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={style.column2}>
                            {newDebt.saleId ?
                                <div className={style.labelInput}>
                                    <div className={style.left}>
                                        <label htmlFor="client">Cliente:</label>
                                    </div>
                                    <div className={style.right}>
                                        <label className={style.labelClient}>{selectedClient ? selectedClient : "Anónimo"}</label>
                                    </div>
                                </div>
                            :
                                <></>
                            }
                            </div>
                            <div className={style.column3}>
                                <div className={style.subtotal}>
                                    <div className={style.left}>Monto</div>
                                    <div className={style.right}>
                                        {`$${formatNumber(totalSale)}`}
                                    </div>
                                </div>   
                                <div className={style.subtotal}>
                                    <div className={style.left}>Pagado</div>
                                    <div className={style.right}>
                                        {`-$${formatNumber(newDebt.amount)}`}
                                    </div>
                                </div>      
                                <div className={style.total}>
                                    <div className={style.left}>Saldo</div>
                                    <div className={style.right}>
                                        {`$${formatNumber(balance)}`}
                                    </div>
                                </div>                     
                                <button type="submit" disabled={isSubmitDisabled}>Aceptar</button>
                            </div> 
                            {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormDebt;
