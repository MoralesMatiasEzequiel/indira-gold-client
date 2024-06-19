import React from 'react';
import BarGraph from './BarGraph/BarGraph.jsx'
import Metrics from './Metrics/Metrics.jsx'
import Rating from './Rating/Rating.jsx';
import Piechart from './PieChart/PieChart.jsx'


const Statistics = () => {

    return(
        <div>
            <h1>Staditsss</h1>
            <BarGraph/>
            <Metrics/>
            <Rating/>
            <Piechart/>
        </div>
    );
};

export default Statistics;