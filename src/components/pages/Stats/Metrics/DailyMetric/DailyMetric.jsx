import style from './DailyMetric.module.css';
import { useSelector } from "react-redux";
import React from 'react';


const DailyMetric = () => {

    const salesBalance = useSelector(state => state.sales.salesBalance);

    const totalRevenue = ~~salesBalance.daily?.totalRevenue;

    let suffix = '';
    if (totalRevenue >= 1000 && totalRevenue < 1000000) {
        suffix = 'k';
    } else if (totalRevenue >= 1000000) {
        suffix = 'M';
    };

    return(
        <div>
            <div className={style.card}>
                <div className={style.titleBalance}>
                    <p>Diario</p>
                </div>
                <div className={style.cardContent}>
                    <div className={style.labels}>
                        <p>👕</p>
                        <div className={style.numberCard}>{salesBalance.daily?.soldProducts}</div>
                        <span className={style.cardName}>productos</span>
                    </div>
                    <div className={style.labels}>
                        <p>💲</p>
                        <div className={style.numberCard}>{totalRevenue.toLocaleString()}{suffix}</div>
                        <span className={style.cardName}>ganancias</span>
                    </div>
                </div>
                <div className={style.textBalance}>
                    <div>3% más que ayer</div>
                </div>
            </div>
        </div>
    );
};

export default DailyMetric;