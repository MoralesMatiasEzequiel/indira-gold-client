import style from './Stats.module.css';
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import BarChart from './BarChart/BarChart.jsx'
import Metrics from './Metrics/Metrics.jsx'
import Rating from './Rating/Rating.jsx';
import Piechart from './PieChart/PieChart.jsx'
import { getCategories } from '../../../redux/categoryActions.js';
import { getSalesOnline, getSalesLocal } from '../../../redux/saleActions.js';
import { getSoldProducts, getTopFiveProducts } from '../../../redux/productActions.js';


const Stats = () => {

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getSalesOnline());
        dispatch(getSalesLocal());
        dispatch(getSoldProducts());
        dispatch(getTopFiveProducts());
    }, [dispatch]);

    return(
        <div className="page">
            <div className={style.metrics}>
                <Metrics/>  
            </div>
            <div className={style.stats}>
                <div className={style.component}><Rating/></div>
                {/* <div className={style.middleComponent}><Piechart  /></div> */}
                {/* <div className={style.component}><BarChart /></div> */}
            </div>
        </div>
    );
};

export default Stats;