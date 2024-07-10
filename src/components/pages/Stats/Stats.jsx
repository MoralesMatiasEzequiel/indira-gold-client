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
            {/* <div className="title">
                <h2>ESTADÍSTICAS</h2>
            </div> */}
            <div>
                <Metrics/>  
            </div>
            <div>
                <Rating/>
                <Piechart/>
                <BarChart/>
            </div>
        </div>
    );
};

export default Stats;