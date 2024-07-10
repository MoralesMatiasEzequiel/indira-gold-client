import style from './MonthlyMetric.module.css';
import { useSelector } from "react-redux";
import React from 'react';


const MonthlyMetric = () => {

    const salesBalance = useSelector(state => state.sales.salesBalance);

    return(
        <div>
            <div className={style.card}>
                <div className={style.titleBalance}>
                    <p>Mensual</p>
                </div>
                <div className={style.cardContent}>
                    <div className={style.labels}>
                        <p>👕</p>
                        <div className={style.numberCard}>{salesBalance.monthly?.soldProducts}</div>
                        <span className={style.cardName}>productos</span>
                    </div>
                    <div className={style.labels}>
                        <p>💲</p>
                        <div className={style.numberCard}>{salesBalance.monthly?.totalRevenue}k</div>
                        <span className={style.cardName}>ganancias</span>
                    </div>
                </div>
                <div className={style.textBalance}>
                    <div>3% menos que el mes pasado</div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyMetric;