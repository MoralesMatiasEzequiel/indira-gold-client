import React from 'react';
import { useSelector } from "react-redux";
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

    const salesOnline = useSelector(state => state.sales.salesOnline);
    const salesLocal = useSelector(state => state.sales.salesLocal);

    const getLastFourMonths = () => {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const date = new Date();
        const currentMonth = date.getMonth();
        return [
            months[(currentMonth - 3 + 12) % 12],
            months[(currentMonth - 2 + 12) % 12],
            months[(currentMonth - 1 + 12) % 12],
            months[currentMonth]
        ];
    };

    // const countSalesByMonth = (sales) => {
    //     const salesCount = [0, 0, 0, 0];
    //     const currentDate = new Date();
    //     const currentMonth = currentDate.getMonth();
    //     const currentYear = currentDate.getFullYear();
        
    //     sales.forEach(sale => {
    //         const saleDate = new Date(sale.date);
    //         const saleMonth = saleDate.getMonth();
    //         const saleYear = saleDate.getFullYear();
    //         const monthDiff = (currentMonth - saleMonth + 12) % 12;
    
    //         // Asegúrate de que las ventas sean del año actual y dentro de los últimos 4 meses
    //         if (saleYear === currentYear && monthDiff < 4) {
    //             salesCount[3 - monthDiff]++;
    //         }
    //     });
    //     return salesCount;
    // };
    const countSalesByMonth = (sales) => {
        const salesCount = [0, 0, 0, 0];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
    
        sales.forEach(sale => {
            const saleDate = new Date(sale.date);
            const saleMonth = saleDate.getMonth();
            const saleYear = saleDate.getFullYear();
    
            // Calcula la diferencia total en meses, considerando el año
            const totalMonthsDiff = (currentYear - saleYear) * 12 + (currentMonth - saleMonth);
    
            // Verifica que la venta esté dentro de los últimos 4 meses
            if (totalMonthsDiff >= 0 && totalMonthsDiff < 4) {
                salesCount[3 - totalMonthsDiff]++;
            }
        });
    
        return salesCount;
    };
    
    const lastFourMonths = getLastFourMonths();
    const onlineSalesCount = countSalesByMonth(salesOnline);
    const localSalesCount = countSalesByMonth(salesLocal);
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    const barCharData = {
        labels: lastFourMonths,
        datasets: [
            {
                label: "Online",
                data: onlineSalesCount,
                backgroundColor: "rgba(228, 182, 26, 1)",
                borderWidth: 1
            },
            {
                label: "Local",
                data: localSalesCount,
                backgroundColor: "rgba(51, 51, 51, 1)",
                borderWidth: 1
            }
        ]
    };

    return(
        <div className="component">
            <div className="title">
                <h2>POR MES</h2>
            </div>
            <div className="container">
                <Bar options={options} data={barCharData} />
            </div>
        </div>
    );
};

export default BarChart;