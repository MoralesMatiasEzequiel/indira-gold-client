import style from './PutDebt.module.css';
import x from '../../../Sales/FormSales/img/x.png';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from 'react-select/async';
import { getDebts, getDebtById, putDebt } from '../../../../../redux/debtActions';

const PutDebt = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const debtDetail = useSelector(state => state.debts.debtDetail);   
    const sales = useSelector(state => state.sales.sales);  
    const debts = useSelector(state => state.debts.debts);

    useEffect(() => {
        dispatch(getDebtById(id));
    }, [dispatch, id]);

    const [editDebt, setEditDebt] = useState({});  
    const [salesOptions, setSalesOptions] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [totalSale, setTotalSale] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [incomes, setIncomes] = useState([]);
    const [newIncome, setNewIncome] = useState('');
    const [isClearDisabled, setIsClearDisabled] = useState(true);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    // console.log(editDebt);

    useEffect(() => {    
        if (debtDetail && debtDetail._id === id) {        
            const updatedEditDebt = {
                _id: debtDetail._id,
                client: debtDetail.client,
                saleId: debtDetail.sale?._id,
                income: debtDetail.income || [],
                remainingBalance: debtDetail.remainingBalance,
                paymentMade: debtDetail.paymentMade,
                active: debtDetail.active
            };
            setEditDebt(updatedEditDebt);
            setSelectedSale({
                value: debtDetail.sale?._id,
                label: debtDetail.sale?.orderNumber
            });
            setTotalSale(debtDetail.sale?.totalWithFee || 0);
            setSelectedClient(`${debtDetail.client?.name || ''} ${debtDetail.client?.lastname || ''}`);
            setIncomes(updatedEditDebt.income);
        }
    }, [dispatch, id, debtDetail]);

    const validateForm = () => {
        const isSaleChanged = editDebt.saleId !== debtDetail?.sale?._id;
        const isIncomeChanged = JSON.stringify(editDebt.income) !== JSON.stringify(debtDetail?.income);
    
        setIsSubmitDisabled(!(isSaleChanged || isIncomeChanged));
    };

    useEffect(() => {
        validateForm();
    }, [editDebt]);

    //--- HANDLE CHANGE
    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     let newValue = value === '' ? 0 : parseFloat(value);

    //     if (name === 'amount') {
    //         // Validar que el monto no sea mayor al saldo restante
    //         if (newValue > editDebt.remainingBalance) {
    //             newValue = editDebt.remainingBalance;
    //         }
    //     }       

    //     setEditDebt((prevDebt) => ({
    //         ...prevDebt,
    //         [name]: newValue,
    //     }));
    // };

    const handleDebtChange = (selectedOption) => {
        if(selectedOption) {
            setIsClearDisabled(false);
        }

        const sale = sales.find(sale => sale._id === selectedOption.value);

        setSelectedClient(sale?.client ? `${sale.client.name} ${sale.client.lastname}` : 'Anónimo');

        setTotalSale(sale.totalWithFee || 0);

        setSelectedSale(selectedOption);
        setEditDebt((prevEditDebt) => ({
            ...prevEditDebt,
            saleId: selectedOption ? selectedOption.value : ''
        }));
    };

    const transformSalesOptions = (sales) => {
        // Filtra las ventas que tienen cliente y que no tienen deuda registrada
        return sales
            .filter(sale => 
                sale.client && 
                !debts.some(debt => debt.sale._id === sale._id)  // Excluye las ventas con deuda registrada
            )
            .map(sale => ({
                value: sale._id,
                label: `${sale.orderNumber}`
            }));
    };

    useEffect(() => {
        setSalesOptions(transformSalesOptions(sales));
    }, [sales, debts]);

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
            income: '#3c3c3b',
        }),
        placeholder: (provided) => ({
            ...provided,
            income: '#797979',
            fontStyle: 'italic'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            income: '#3c3c3b',
            padding: 0
        }),
        option: (provided, state) => ({
            ...provided,
            income: state.isSelected ? '#000' : '#555',
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
        if (number !== null && number !== undefined) {
            const rounded = Math.round(number); // redondea al entero más cercano
            return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return '0';
    };

    const formatDate = (date) => {        
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            // timeZone: 'UTC' 
        };

        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
    };

    //--- INCOME
    const handleInputIncomeChange = (event) => {
        setNewIncome(event.target.value);
    };

    const addIncome = () => {
        if (newIncome !== '') {
            const newIncomeAmount = parseFloat(newIncome);
    
            // Verificar que el nuevo ingreso no exceda el saldo restante
            if (newIncomeAmount > editDebt.remainingBalance) {
                setErrorMessage('El pago no puede superar el saldo restante.');
                return;
            }
    
            const newIncomeObject = {
                amount: newIncomeAmount,
                date: new Date(), 
            };
    
            const updatedPaymentMade = editDebt.paymentMade + newIncomeObject.amount;
            const updatedRemainingBalance = editDebt.remainingBalance - newIncomeObject.amount;
    
            setIncomes((prevIncomes) => [...prevIncomes, newIncomeObject]);
    
            setEditDebt((prevDebt) => ({
                ...prevDebt,
                income: [...prevDebt.income, newIncomeObject],
                paymentMade: updatedPaymentMade,
                remainingBalance: updatedRemainingBalance,
            }));
    
            setNewIncome('');
            setErrorMessage('');
        }
    };

    const deleteIncome = (index) => {
        const incomeToRemove = incomes[index]; // Obtener el ingreso a eliminar
        const updatedIncomes = [...incomes];
        updatedIncomes.splice(index, 1); // Eliminar el ingreso por índice
    
        setIncomes(updatedIncomes); // Actualizamos el estado de los ingresos
    
        // Actualizamos el estado de editDebt
        const updatedEditDebt = {
            ...editDebt,
            income: updatedIncomes,
            paymentMade: editDebt.paymentMade - incomeToRemove.amount, // Restamos el monto eliminado
            remainingBalance: editDebt.remainingBalance + incomeToRemove.amount, // Sumamos al saldo restante
        };
        setEditDebt(updatedEditDebt);
    };

    const handleKeyDown = (event) => {
        // Permitir solo números, borrar, y teclas especiales como el backspace y enter
        if (!/[\d]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Enter') {
            event.preventDefault();
        }
    
        if (event.key === 'Enter') {
            event.preventDefault();
            addIncome();  // Tu función para agregar el ingreso
        }
    };

    const handleSetForm = () => {
        // setIsSubmitDisabled(true);
        // setNewDebt(initialDebtState);
        // setSelectedSale(null);
        // setTotalSale(null);
        // setSelectedClient(null);
        // setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const debtData = {
            _id: editDebt._id,
            saleId: editDebt.saleId,
            income: editDebt.income
        }

        try {
            const response = await dispatch(putDebt(debtData))
            // .then((response) => {
            //     if (typeof response === 'string') {
            //         setErrorMessage(response);
            //     }
            // });

            if (response.data.remainingBalance === 0) {
                console.log("Debt successfully settled");
                await dispatch(getDebtById(id));
                dispatch(getDebts());
                navigate(`/main_window/debts/success`);
            };
            
            if (response.data.remainingBalance > 0) {
                console.log("Successfully edited debt");
                await dispatch(getDebtById(id));
                dispatch(getDebts());
                navigate(`/main_window/debts/${id}`);
            };

        } catch (error) {
            console.error('Error updating debt:', error);
        }
    };

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>EDITAR DEUDA</h2>
                    <div className="titleButtons">
                        <button onClick={() => navigate(`/main_window/debts/${id}`)}>Atrás</button>
                    </div>
                </div>
                <div className="container">
                    <form onSubmit={handleSubmit} className={style.salesForm}>
                        <div className={style.column1}>
                            <div className={style.labelInput}>
                                <div className={style.left}>
                                    <label htmlFor="orderNumber">N° de orden:</label>
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
                                                ...debtInputStyles
                                            }}
                                        />
                                    </div>                                 
                                </div>
                            </div>
                            <div className={style.labelInput}>
                                <div className={style.left}>
                                    <label htmlFor="client">Cliente:</label>
                                </div>
                                <div className={style.right}>
                                    <label>{selectedClient ? selectedClient : "Anónimo"}</label>
                                </div>
                            </div>
                            <div className={style.labelInput}>
                                <div className={style.left}>
                                    <label htmlFor="client">Ingresos:</label>
                                </div>
                            </div>
                            <div className={style.incomeCard}>
                                <ol>
                                    {incomes?.map((income, incomeIndex) => (
                                        <li key={incomeIndex} className={style.list}>
                                            <span className={style.spanList1}>Fecha: {formatDate(income.date)}</span>
                                            <span className={style.spanList2}>Pago: ${formatNumber(income.amount)}</span>
                                            <button type="button" className={style.buttonDelete} onClick={() => deleteIncome(incomeIndex)}>
                                                <img src={x} alt="x" />
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                                <div className={style.containerInputIncome}>
                                    <input 
                                        className={style.inputAddIncome} 
                                        type="text" 
                                        name="income" 
                                        value={newIncome} 
                                        onChange={handleInputIncomeChange} 
                                        onKeyDown={handleKeyDown} 
                                        placeholder='Agregar nuevo pago'
                                    />
                                    <button type="button" className={style.buttonAdd} onClick={addIncome}>+</button>
                                </div>
                            </div>
                            {errorMessage && <p className='errorMessage'>{errorMessage}</p>} 
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
                                    {`-$${formatNumber(editDebt.paymentMade)}`}
                                </div>
                            </div>      
                            <div className={style.total}>
                                <div className={style.left}>Saldo</div>
                                <div className={style.right}>
                                    {`$${formatNumber(editDebt.remainingBalance)}`}
                                </div>
                            </div>                     
                            <button type="submit" disabled={isSubmitDisabled}>Aceptar</button>
                        </div> 
                        {/* {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}                      */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PutDebt;