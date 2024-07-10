import style from './MonthlyMetric.module.css';
import { useSelector } from "react-redux";
import React from 'react';


const MonthlyMetric = () => {

    const salesBalance = useSelector(state => state.sales.salesBalance);

    return(
        <div>
            <div className={style.containerCards}>
                <div className={style.cards}>
                    <div className={style.card}>
                        <div className={style.cardContent}>
                            <p>Mensual</p>
                        </div>
                        <div className={style.cardContent}>
                            <p>👕</p>
                            <div className={style.numberCard}>{salesBalance.monthly?.soldProducts}</div>
                            <div className={style.cardName}>productos</div>
                        </div>
                        <div className={style.cardContent}>
                            <p>💲</p>
                            <div className={style.numberCard}>{salesBalance.monthly?.totalRevenue}k</div>
                            <div className={style.cardName}>ganancias</div>
                        </div>
                        <div className={style.cardContent}>
                            <div>3% menos que el mes pasado</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyMetric;