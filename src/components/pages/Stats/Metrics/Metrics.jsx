import style from './Metrics.module.css';
import React, { useState } from 'react';
import DailyMetric from './DailyMetric/DailyMetric.jsx';
import WeeklyMetric from './WeeklyMetric/WeeklyMetric.jsx';
import MonthMetric from './MonthlyMetric/MonthlyMetric.jsx';
import AnnualMetric from './AnnualMetric/AnnualMetric.jsx';


const Metrics = () => {

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Función que se pasa a AnnualMetric para manejar el cambio de año
    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const isCurrentYear = selectedYear.toString() === new Date().getFullYear().toString();    

    return(
        <div className="component">
            <div className="title">
                <h2>MÉTRICAS</h2>
            </div>
            <div className="container">
                <div className={style.metrics}>
                    <div className={style.component}><DailyMetric isCurrentYear={isCurrentYear} /></div>
                    <div className={style.component}><WeeklyMetric isCurrentYear={isCurrentYear} /></div>
                    <div className={style.component}><MonthMetric isCurrentYear={isCurrentYear} /></div>
                    <div className={style.component}><AnnualMetric onYearChange={handleYearChange} /></div>
                </div>
            </div>
        </div>
    );
};

export default Metrics;