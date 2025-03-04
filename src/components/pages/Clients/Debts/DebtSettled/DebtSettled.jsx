import style from './DebtSettled.module.css';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getDebts } from '../../../../../redux/debtActions.js';

const DebtSettled = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/main_window/debts');
    };

    useEffect(() => {
        dispatch(getDebts());
    }, []);

    return (
        <div className="page">
            <div className="component">
                <div className="title">
                    <h2>DEUDA SALDADA</h2>
                </div>
                <div className="container">
                    <p className={style.paragraph}>¡Deuda saldada con éxito!</p>
                    <div className={style.containerButton}>
                        <button type='button' onClick={handleBackClick}>Volver</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebtSettled;