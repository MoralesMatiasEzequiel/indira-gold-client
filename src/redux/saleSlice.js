import { createSlice } from "@reduxjs/toolkit";

export const saleSlice = createSlice({
    name: "sale",
    initialState: {
        sales: [],
        salesCopy: [],
        saleDetail: {},
        salesOnline: [],
        salesLocal: [],
        salesBalance: {},
        salesBalanceLocal: {},
        salesAnnualBalance: {},
        calculateSalesAnnualBalance: {},
        salesYears: []
    },
    reducers: {
        getSalesReducer: (state, action) => {
            state.sales = action.payload;
            state.salesCopy = action.payload;
        },
        getSaleByIdReducer: (state, action) => {
            if(typeof action.payload === "string" || typeof action.payload === "number"){
                const saleFound = state.salesCopy.find((sale) => sale._id === action.payload);
                state.saleDetail = saleFound;
            }else{
                state.saleDetail = action.payload;
            }
        },
        getSalesByOrderNumberReducer: (state, action) => {
            const query = action.payload.trim();
            state.sales = state.salesCopy.filter(sale => sale.orderNumber.includes(query));
        },
        getSalesByClientReducer: (state, action) => {
            const query = action.payload.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const regex = new RegExp(query, 'i');
            state.sales = state.salesCopy.filter(sale => {
                if (sale.client) {
                    const name = sale.client.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const lastname = sale.client.lastname.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return regex.test(name) || regex.test(lastname);
                }
                return false;
            });
        },
        clearSaleDetailReducer: (state, action) => {
            state.saleDetail = {};
        },
        getSalesOnlineReducer: (state, action) => {
            state.salesOnline = action.payload;
        },
        getSalesOnlineLocalReducer: (state, action) => {
            state.salesOnline = state.salesCopy.filter(sale => sale.soldAt.includes('Online'));
        },
        getSalesLocalReducer: (state, action) => {
            state.salesLocal = action.payload;
        },
        getSalesLocalLocalReducer: (state, action) => {
            state.salesLocal = state.salesCopy.filter(sale => sale.soldAt.includes('Local'));
        },
        getSalesBalanceReducer: (state, action) => {
            state.salesBalance = action.payload;
        },
        // getSalesBalanceLocalReducer: (state, action) => {
        //     state.salesBalance = state.salesBalance;
        // },
        deleteSaleReducer: (state, action) => {
            const saleIdToDelete = action.payload;
            state.sales = state.sales.filter(sale => sale._id !== saleIdToDelete);
            state.salesCopy = state.salesCopy.filter(sale => sale._id !== saleIdToDelete);
        },
        filterSalesReducer: (state, action) => {
            const filteredSales = state.sales.filter((sale) => {
                const saleDate = new Date(sale.date);
                const saleMonth = saleDate.getMonth(); // Índice del mes
                const saleYear = saleDate.getFullYear();
        
                return (
                    (action.payload.month === '' || saleMonth === parseInt(action.payload.month)) &&
                    (action.payload.year === '' || saleYear === parseInt(action.payload.year))
                );
            });
        
            state.salesCopy = filteredSales;
        },
        calculateSalesBalanceReducer: (state) => {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfYear = new Date(now.getFullYear(), 0, 1);
        
            const balances = {
                daily: { soldProducts: 0, totalRevenue: 0 },
                weekly: { soldProducts: 0, totalRevenue: 0 },
                monthly: { soldProducts: 0, totalRevenue: 0 },
                annually: { soldProducts: 0, totalRevenue: 0 }
            };
        
            state.sales.forEach(sale => {
                const saleDate = new Date(sale.date);
                const totalProductsSold = sale.products.length; // Requiere que cada venta tenga un array de productos
                const totalRevenue = sale.totalWithFee; // Requiere que cada venta tenga un campo totalPrice
        
                if (saleDate >= startOfDay) {
                    balances.daily.soldProducts += totalProductsSold;
                    balances.daily.totalRevenue += totalRevenue;
                }
                if (saleDate >= startOfWeek) {
                    balances.weekly.soldProducts += totalProductsSold;
                    balances.weekly.totalRevenue += totalRevenue;
                }
                if (saleDate >= startOfMonth) {
                    balances.monthly.soldProducts += totalProductsSold;
                    balances.monthly.totalRevenue += totalRevenue;
                }
                if (saleDate >= startOfYear) {
                    balances.annually.soldProducts += totalProductsSold;
                    balances.annually.totalRevenue += totalRevenue;
                }
            });
        
            state.salesBalanceLocal = balances;
        },    
        calculateSalesAnnualBalanceReducer: (state, action) => {
            const year = action.payload;
            const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0); // 1 de enero del año 'year'.
            const endOfYear = new Date((parseInt(year) + 1), 0, 1, 0, 0, 0, 0);
        
            const annualBalance = {
                soldProducts: 0, 
                totalRevenue: 0
            };
        
            state.sales.forEach(sale => {
                const saleDate = new Date(sale.date);
    
                if (saleDate >= startOfYear && saleDate < endOfYear) {
                    annualBalance.soldProducts += sale.products.length;
                    annualBalance.totalRevenue += sale.totalWithFee;
                }
            });
        
            state.salesAnnualBalance = annualBalance;
        },
        getCalculateSalesAnnualBalanceReducer: (state, action) => {
            state.calculateSalesAnnualBalance = action.payload;
        },
        fetchSalesYearsReducer: (state, action) => {
            const years = new Set();  // Usamos un Set para evitar duplicados

            state.sales.forEach(sale => {
                const year = new Date(sale.date).getFullYear(); 
                years.add(year);  // Añadimos el año al Set
            });

            state.salesYears = Array.from(years);
        },

    }
});

export const { getSalesReducer, getSaleByIdReducer, clearSaleDetailReducer, getSalesOnlineReducer, getSalesOnlineLocalReducer, getSalesLocalReducer, getSalesLocalLocalReducer, getSalesByClientReducer, getSalesByOrderNumberReducer, getSalesBalanceReducer, getCalculateSalesAnnualBalanceReducer, deleteSaleReducer, filterSalesReducer, calculateSalesBalanceReducer, calculateSalesAnnualBalanceReducer, fetchSalesYearsReducer } = saleSlice.actions;

export default saleSlice.reducer;