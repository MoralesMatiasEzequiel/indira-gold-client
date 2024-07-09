import React from 'react';
import { useSelector } from "react-redux";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement);

const PieChart = () => {

    const categories = useSelector(state => state.categories.categories);

    const namesCategories = [];
    categories.map(category => namesCategories.push(category.name)); //Vamos a necesitar que se pusheen las categorias con productos mas vendidos
// console.log(categories);
    const options = {};
    const pieCharData = {
        labels: namesCategories,
        datasets: [
            {
                label: "Vendido",
                data: [250, 123, 75, 100, 54],
                backgroundColor: [
                    "rgba(228, 182, 26, 1)",
                    "rgba(11, 12, 11, 1)",
                    "rgba(42, 46, 52, 1)",
                    "rgba(233, 234, 236, 1)",
                    "rgba(251, 225, 52, 1)",
                ],
                borderWidth: 4,
            },
            // {
            //     label: "Local",
            //     data: [100, 250, 75, 450],
            //     backgroundColor: "rgba(51, 51, 51, 1)",
            //     borderWidth: 1
            // }
        ]
    };

    return(
        <div>
            <h2>POR CATEGORÍAS</h2>
            <Pie options={options} data={pieCharData} />
        </div>
    );
};

export default PieChart;