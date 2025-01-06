import style from './AnnualMetric.module.css';
import iconClothes from '../img/icons-camiseta.png';
import iconMoney from '../img/icons-monedas.png';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesYears , calculateSalesAnnualBalance } from '../../../../../redux/saleActions';


const AnnualMetric = ({ onYearChange }) => { // Recibimos el callback para enviar el año seleccionado

    const dispatch = useDispatch();

    // const salesBalance = useSelector(state => state.sales.salesBalance);
    // const salesBalance = useSelector(state => state.sales.salesBalanceLocal);
    // const totalRevenue = salesBalance.annually?.totalRevenue ?? 0;
    const salesAnnualBalance = useSelector(state => state.sales.salesAnnualBalance);   
    const totalRevenue = salesAnnualBalance?.totalRevenue ?? 0; //Si el valor obtenido es null o undefined mostramos '0'.
    const years = useSelector(state => state.sales.salesYears);    

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);

    useEffect(() => {
        dispatch(fetchSalesYears());
    }, [dispatch]);

    useEffect(() => {
        if (year) {
            dispatch(calculateSalesAnnualBalance(year));
        }
    }, [year, dispatch]);

    let displayRevenue = totalRevenue;
    let suffix = '';
    if (totalRevenue >= 1000 && totalRevenue < 1000000) {
        displayRevenue = Math.floor(totalRevenue / 1000);
        suffix = 'k';
    } else if (totalRevenue >= 1000000) {
        displayRevenue = Math.floor(totalRevenue / 1000000);
        suffix = 'M';
    };

    // Manejador para cuando se cambia el año en el select
    const handleYearChange = (e) => {
        setYear(e.target.value);
        onYearChange(e.target.value); // Llamamos al callback y pasamos el año seleccionado
    };

    return(
        <div>
            <div className={style.card}>
                <div className={style.titleBalance}>
                    <div className={style.containerYear}>
                        <select
                            className={style.selectYear}
                            name="year"
                            id="yearSelect"
                            value={year}
                            onChange={handleYearChange}
                        >
                            {years?.map((yearOption) => (
                                <option key={yearOption} value={yearOption}>
                                    {yearOption}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p>Anual</p>
                    </div>                    
                </div>
                <div className={style.cardContent}>
                    <div className={style.labels}>
                        <p className={style.pp}><img className={style.icon} src={iconClothes} alt="icon"/></p>
                        {/* <div className={style.numberCard}>{salesAnnualBalance.annually?.soldProducts}</div> */}
                        <div className={style.numberCard}>{salesAnnualBalance?.soldProducts}</div>
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

export default AnnualMetric;