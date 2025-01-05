import style from './MonthlyMetric.module.css';
import iconClothes from '../img/icons-camiseta.png';
import iconMoney from '../img/icons-monedas.png';
import React from 'react';
import { useSelector } from "react-redux";


const MonthlyMetric = ({ isCurrentYear }) => {

    // const salesBalance = useSelector(state => state.sales.salesBalance);
    const salesBalance = useSelector(state => state.sales.salesBalanceLocal);
    const totalRevenue = salesBalance.monthly?.totalRevenue ?? 0;

    let displayRevenue = totalRevenue;
    let suffix = '';
    if (totalRevenue >= 1000 && totalRevenue < 1000000) {
        displayRevenue = Math.floor(totalRevenue / 1000);
        suffix = 'k';
    } else if (totalRevenue >= 1000000) {
        displayRevenue = Math.floor(totalRevenue / 1000000);
        suffix = 'M';
    };
    
    const cardClass = isCurrentYear ? style.card : style.cardInactive;

    return(
        <div>
            <div className={cardClass}>
                <div className={style.titleBalance}>
                    <p>Mensual</p>
                </div>
                <div className={style.cardContent}>
                    <div className={style.labels}>
                        <p className={style.pp}><img className={style.icon} src={iconClothes} alt="icon"/></p>
                        <div className={style.numberCard}>{salesBalance.monthly?.soldProducts}</div>
                        <span className={style.cardName}>productos</span>
                    </div>
                    <div className={style.labels}>
                        <p className={style.pp}><img className={style.icon} src={iconMoney} alt="icon"/></p>
                        <div className={style.numberCard}>{displayRevenue.toLocaleString()}{suffix}</div>
                        <span className={style.cardName}>ganancias</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyMetric;