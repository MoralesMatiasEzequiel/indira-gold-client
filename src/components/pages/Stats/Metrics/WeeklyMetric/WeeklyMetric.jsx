import style from './WeeklyMetric.module.css';
import { useSelector } from "react-redux";
import React from 'react';


const WeeklyMetric = () => {

    const salesBalance = useSelector(state => state.sales.salesBalance);

    return(
        <div>
            <div className={style.containerCards}>
                <div className={style.cards}>
                    <div className={style.card}>
                        <div className={style.cardContent}>
                            <p>Semanal</p>
                        </div>
                        <div className={style.cardContent}>
                            <p>👕</p>
                            <div className={style.numberCard}>{salesBalance.weekly?.soldProducts}</div>
                            <div className={style.cardName}>productos</div>
                        </div>
                        <div className={style.cardContent}>
                            <p>💲</p>
                            <div className={style.numberCard}>{salesBalance.weekly?.totalRevenue}k</div>
                            <div className={style.cardName}>ganancias</div>
                        </div>
                        <div className={style.cardContent}>
                            <div>3% más que la semana pasada</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyMetric;