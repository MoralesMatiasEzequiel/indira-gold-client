import React from 'react';
import BarGraph from './BarGraph/BarGraph.jsx'
import Metrics from './Metrics/Metrics.jsx'
import Rating from './Rating/Rating.jsx';
import Piechart from './PieChart/PieChart.jsx'


const Stats = () => {

    return(
        <div>
            <h1>Estadísticas</h1>
            <Metrics/>  
            <Rating/>
            <Piechart/>
            <BarGraph/>
        </div>
    );
};

export default Stats;