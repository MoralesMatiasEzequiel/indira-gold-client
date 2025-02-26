import style from './Debts.module.css';
import React, { useEffect} from 'react';
import { useDispatch } from "react-redux";
import { getDebts, getActiveDebts } from '../../../../redux/debtActions.js';
import FormDebt from './FormDebt/FormDebt.jsx';
import DebtRegistration from './DebtsRegistration/DebtsRegistration.jsx';


const Debts = () => {

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getDebts());
        dispatch(getActiveDebts());
    }, [dispatch]);

    return(
        <div className="page">
            <div className={style.formClient}><FormDebt /></div> 
            <div className={style.clientRegistration}><DebtRegistration /></div>
        </div>
    );
};

export default Debts;