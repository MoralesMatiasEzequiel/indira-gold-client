import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js"; 
// import { barCharData } from './'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)


const BarChart = () => {
    const options = {};
    const barCharData = {
        labels: ['Mayo', 'Junio', 'Julio', 'Agosto'],
        datasets: [
            {
                label: "Online",
                data: [100, 250, 75, 450],
                backgroundColor: "rgba(228, 182, 26, 1)",
                borderWidth: 1
            },
            {
                label: "Local",
                data: [100, 250, 75, 450],
                backgroundColor: "rgba(51, 51, 51, 1)",
                borderWidth: 1
            }
        ]
    };

    return(
        <div>
            <h2>POR MES</h2>
            <Bar options={options} data={barCharData} />
        </div>
    );
};

export default BarChart;



// import React, { useState, useEffect } from 'react';
// import { Chart } from 'primereact/chart';

// export default function VerticalBarDemo() {
//     const [chartData, setChartData] = useState({});
//     const [chartOptions, setChartOptions] = useState({});

//     useEffect(() => {
//         const documentStyle = getComputedStyle(document.documentElement);
//         const textColor = documentStyle.getPropertyValue('--text-color');
//         const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
//         const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
//         const data = {
//             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//             datasets: [
//                 {
//                     label: 'My First dataset',
//                     backgroundColor: documentStyle.getPropertyValue('--blue-500'),
//                     borderColor: documentStyle.getPropertyValue('--blue-500'),
//                     data: [65, 59, 80, 81, 56, 55, 40]
//                 },
//                 {
//                     label: 'My Second dataset',
//                     backgroundColor: documentStyle.getPropertyValue('--pink-500'),
//                     borderColor: documentStyle.getPropertyValue('--pink-500'),
//                     data: [28, 48, 40, 19, 86, 27, 90]
//                 }
//             ]
//         };

//         const options = {
//             maintainAspectRatio: false,
//             aspectRatio: 0.8,
//             plugins: {
//                 legend: {
//                     labels: {
//                         fontColor: textColor
//                     }
//                 }
//             },
//             scales: {
//                 x: {
//                     ticks: {
//                         color: textColorSecondary,
//                         font: {
//                             weight: 500
//                         }
//                     },
//                     grid: {
//                         display: false,
//                         drawBorder: false
//                     }
//                 },
//                 y: {
//                     ticks: {
//                         color: textColorSecondary
//                     },
//                     grid: {
//                         color: surfaceBorder,
//                         drawBorder: false
//                     }
//                 }
//             }
//         };

//         setChartData(data);
//         setChartOptions(options);
//     }, []);

//     return (
//         <div className="card">
//             <Chart type="bar" data={chartData} options={chartOptions} />
//         </div>
//     )
// };    