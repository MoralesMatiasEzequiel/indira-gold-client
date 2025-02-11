import style from './FormDebt.module.css';
import iconClear from "../../../../../assets/img/clearForm.png";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { postDebt, getDebts } from '../../../../../redux/debtActions.js';

const FormDebt = ({ onDebtAdded = () => {} }) => {

    const dispatch = useDispatch();

    const sales = useSelector(state => state.sales.sales);

    const initialDebtState = {
        saleId: '',
        amount: null,
    };
 
    const [newDebt, setNewDebt] = useState(initialDebtState);
    const [salesOptions, setSalesOptions] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [totalSale, setTotalSale] = useState(null);
    // const [selectKey, setSelectKey] = useState(Date.now());
    const [selectedClient, setSelectedClient] = useState(null);
    const [isClearDisabled, setIsClearDisabled] = useState(true);
    const [debtMade, setDebtMade] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    
    const validateForm = () => {
        const isAmount = newDebt.amount !== '';
        const isSaleId = newDebt.saleId !== '';
        setIsSubmitDisabled(!(isAmount && isSaleId));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setNewDebt((prevDebt) => ({
            ...prevDebt,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));

        validateForm();
    };

    const handleDebtChange = (selectedOption) => {
        if(selectedOption) {
            setIsClearDisabled(false);
        }

        const sale = sales.find(sale => sale._id === selectedOption.value);

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
        validateForm();
    };

    const transformSalesOptions = (sales) => {
        const salesOptions = sales?.map(sale => ({
            value: sale._id,
            label: `${sale.orderNumber}`
        }));
        return salesOptions;
    };

    useEffect(() => {
        setSalesOptions(transformSalesOptions(sales));
        // setSelectKey(Date.now());
    }, [sales]);

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

    const loadSalesOptions = (inputValue, callback) => {
        const filteredOptions = salesOptions.filter(sale =>
            sale.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
    };

    const formatNumber = (number) => {

        if(number){
            return number.toLocaleString('es-ES', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        }

        return null;
    };

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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        dispatch(postDebt(newDebt)).then((response) => {
            if (typeof response === 'string') {
                setErrorMessage(response);
            } else {
                onDebtAdded(response);
                dispatch(getDebts());
            }
        });
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
                    {/* <NewSale saleResponse={saleResponse}/> */}
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
                                                // key={selectKey}
                                                cacheOptions
                                                name="orderNumber"
                                                value={selectedSale || ''}
                                                loadOptions={loadSalesOptions}
                                                onChange={handleDebtChange}
                                                placeholder="Buscar venta"
                                                defaultOptions={salesOptions}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    ...clientInputStyles
                                                }}
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
                                            value={newDebt.amount || ''}
                                            onChange={handleInputChange}
                                            placeholder='0'
                                            min='0'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={style.column2}>
                                <div className={style.labelInput}>
                                    <div className={style.left}>
                                        <label htmlFor="client">Cliente</label>
                                    </div>
                                    <div className={style.right}>
                                        <span>{selectedClient ? selectedClient : "Anónimo"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.column3}>
                                <div className={style.subtotal}>
                                    <div className={style.left}>Monto</div>
                                    <div className={style.right}>${formatNumber(totalSale)}</div>
                                </div>   
                                <div className={style.subtotal}>
                                    <div className={style.left}>Pagado</div>
                                    <div className={style.right}>${formatNumber(newDebt.amount)}</div>
                                </div>      
                                <div className={style.total}>
                                    <div className={style.left}>Saldo</div>
                                    <div className={style.right}>${formatNumber(totalSale - newDebt.amount)}</div>
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
