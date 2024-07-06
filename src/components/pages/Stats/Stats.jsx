import React from 'react';
import BarChart from './BarChart/BarChart.jsx'
import Metrics from './Metrics/Metrics.jsx'
import Rating from './Rating/Rating.jsx';
import Piechart from './PieChart/PieChart.jsx'


const Stats = () => {

    return(
        <div>
            <h1>Estadísticas</h1>
            <div>
                {/* <Metrics/>   */}
            </div>
            <div>
                {/* <Rating/> */}
                <Piechart/>
                <BarChart/>
            </div>
        </div>
    );
};

export default Stats;