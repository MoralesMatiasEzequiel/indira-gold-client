import React from 'react';
import BarGraph from './BarGraph/BarGraph.jsx'
import Metrics from './Metrics/Metrics.jsx'
import Rating from './Rating/Rating.jsx';
import Piechart from './PieChart/PieChart.jsx'


const Stats = () => {

    return(
        <div>
            <h1>Estadísticas</h1>
            <div>
                <Metrics/>  
            </div>
            <div>
                <Rating/>
                <Piechart/>
                <BarGraph/>
            </div>
        </div>
    );
};

export default Stats;