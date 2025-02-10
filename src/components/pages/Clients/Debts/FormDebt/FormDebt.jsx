import style from './FormDebt.module.css';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postDebt, getDebts } from '../../../../../redux/debtActions.js';

const FormDebt = ({ onDebtAdded = () => {} }) => {

    const dispatch = useDispatch();

    const initialDebtState = {
        saleId: '',
        amount: '',
    };

    const [newDebt, setNewDebt] = useState(initialDebtState);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSetForm = () => {
        setNewDebt(initialDebtState);
        setErrorMessage('');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setNewDebt((prevDebt) => ({
            ...prevDebt,
            [name]: value
        }));
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
                setNewDebt(initialDebtState);
            }
        });
    };

    return (
        <div className="component">
            <div className="title">
                <h2>NUEVA DEUDA</h2>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit} className={style.clientForm}>
                    <div className={style.column}>
                        <div className={style.labelInput}>
                            <label htmlFor="order">N° de orden</label>
                            <input 
                                type="number" 
                                id="order" 
                                name="order" 
                                value={newDebt.saleId} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className={style.labelInput}>
                            <label htmlFor="amount">Monto</label>
                            <input 
                                type="number" 
                                id="amount" 
                                name="amount" 
                                value={newDebt.amount} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>
                    <div className={style.column}>
                        <div className={style.labelInput}>
                            <label htmlFor="client">Cliente</label>
                            <input 
                                type="text" 
                                id="client" 
                                name="client" 
                                // value={newDebt.client} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className={style.labelInput}>
                            <label htmlFor="phone">Teléfono</label>
                            <input 
                                type="number" 
                                id="phone" 
                                name="phone" 
                                // value={newDebt.phone} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
                    </div>
                    <button type="submit">Agregar</button>
                </form>
            </div>
        </div>
    );
};

export default FormDebt;
