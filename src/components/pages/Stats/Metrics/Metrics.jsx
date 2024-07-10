import style from './Metrics.module.css';
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import DailyMetric from './DailyMetric/DailyMetric.jsx';
import WeeklyMetric from './WeeklyMetric/WeeklyMetric.jsx';
import MonthMetric from './MonthlyMetric/MonthlyMetric.jsx';
import AnnualMetric from './AnnualMetric/AnnualMetric.jsx';
import { getSalesBalance } from '../../../../redux/saleActions.js';


const Metrics = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSalesBalance());
    }, [dispatch]);

    return(
        <div className="component">
            <div className="title">
                <h2>MÉTRICAS</h2>
            </div>
            <div className={style.metrics}>
                <DailyMetric />
                <WeeklyMetric />
                <MonthMetric />
                <AnnualMetric />
            </div>

        </div>
    );
};

export default Metrics;