import React from 'react';
import DailyMetric from './DailyMetric/DailyMetric.jsx';
import WeeklyMetric from './WeeklyMetric/WeeklyMetric.jsx';
import MonthMetric from './MonthlyMetric/MonthlyMetric.jsx';
import AnnualMetric from './AnnualMetric/AnnualMetric.jsx';


const Metrics = () => {

    return(
        <div>
            <h3>Métricas</h3>
            <div>
                <DailyMetric />
                <WeeklyMetric />
                <MonthMetric />
                <AnnualMetric />
            </div>

        </div>
    );
};

export default Metrics;