import style from './AnnualMetric.module.css';
import { useSelector } from "react-redux";
import React from 'react';


const AnnualMetric = () => {

    const salesBalance = useSelector(state => state.sales.salesBalance);

    return(
        <div>
            <div className={style.containerCards}>
                <div className={style.cards}>
                    <div className={style.card}>
                        <div className={style.cardContent}>
                            <p>Anual</p>
                        </div>
                        <div className={style.cardContent}>
                            <p>👕</p>
                            <div className={style.numberCard}>{salesBalance.annually?.soldProducts}</div>
                            <div className={style.cardName}>productos</div>
                        </div>
                        <div className={style.cardContent}>
                            <p>💲</p>
                            <div className={style.numberCard}>{salesBalance.annually?.totalRevenue}k</div>
                            <div className={style.cardName}>ganancias</div>
                        </div>
                        <div className={style.cardContent}>
                            <div>3% más que el año pasado</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnualMetric;