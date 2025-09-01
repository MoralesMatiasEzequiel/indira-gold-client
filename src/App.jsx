import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import LogoSvg from "./LogoSvg.jsx";
import SideBar from "./components/common/SideBar.jsx"; 
import Stats from "./components/pages/Stats/Stats.jsx";
import FormSales from './components/pages/Sales/FormSales/FormSales.jsx';
import SalesHistory from './components/pages/Sales/SalesHistory/SalesHistory.jsx';
import FilteredSales from "./components/pages/Sales/FilteredSales/FilteredSales.jsx";
import DetailSale from "./components/pages/Sales/DetailSale/DetailSale.jsx";
import PutSale from "./components/pages/Sales/PutSale/PutSale.jsx";
import Products from "./components/pages/Products/Products.jsx";
import DetailProduct from "./components/pages/Products/DetailProduct/DetailProduct.jsx";
import FormProduct from "./components/pages/Products/FormProduct/FormProduct.jsx";
import SuccessPostProduct from './components/pages/Products/SuccessProduct/SuccessPostProduct.jsx';
import SuccessPutProduct from './components/pages/Products/SuccessProduct/SuccessPutProduct.jsx';
import ProductManagement from "./components/pages/Products/ProductManagement/ProductManagement.jsx";
import PutProduct from "./components/pages/Products/PutProduct/PutProduct.jsx";
import PutPriceProducts from "./components/pages/Products/PutPriceProduct/PutPriceProducts.jsx";
import FormClientContainer from './components/pages/Clients/FormClient/FormClientContainer.jsx';
import ClientRegistration from './components/pages/Clients/ClientRegistration/ClientRegistration.jsx';
import DetailClient from "./components/pages/Clients/DetailClient/DetailClient.jsx";
import PutClient from "./components/pages/Clients/PutClient/PutClient.jsx";
import Debts from './components/pages/Clients/Debts/Debts.jsx';
import DetailDebt from './components/pages/Clients/Debts/DetailDebt/DetailDebt.jsx';
import PutDebt from './components/pages/Clients/Debts/PutDebt/PutDebt.jsx';
import DebtSettled from './components/pages/Clients/Debts/DebtSettled/DebtSettled.jsx';
import { ToastContainer } from 'react-toastify';
import { getProducts } from './redux/productActions.js';
import { getClients } from './redux/clientActions.js';
import { getSales } from './redux/saleActions.js';

const App = () => {

  const dispatch = useDispatch();
  const [ hasFetched, setHasFetched ] = useState(false);
  const [ error, setError ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getProducts());
        await dispatch(getClients());
        await dispatch(getSales());
        setHasFetched(true);
      } catch (error) {
        setError(true);
      }
    }

    if( !hasFetched ){
      fetchData();
    }
  }, [dispatch, hasFetched]);

  return (
    <div className="App">
      {
      // error ? (
      //   // <Error />
      //   <div>Error</div>
      // ) : (
        !hasFetched ? (
          <div className="loadingApp">
            <LogoSvg />
          </div>
        ) : (
            <>
              <div className="SideBar"><SideBar /></div>
              <div className="content">
                <Routes>
                  <Route path='/main_window/stats' element={<Stats />}/>
                  <Route path='/' element={<FormSales />}/>
                  <Route path='/main_window/sales/form' element={<FormSales />}/>
                  <Route path='/main_window/sales/history' element={<SalesHistory />}/>
                  <Route path='/main_window/sales/:id' element={<DetailSale />}/>
                  <Route path='/main_window/sales/edit/:id' element={<PutSale/>}/>
                  <Route path='/main_window/sales/filtered' element={<FilteredSales/>}/>
                  <Route path='/main_window/products' element={<Products />}/>
                  <Route path='/main_window/products/:id' element={<DetailProduct />}/>
                  <Route path='/main_window/products/form' element={<FormProduct />}/>
                  <Route path='/main_window/products/success/post' element={<SuccessPostProduct />}/>
                  <Route path='/main_window/products/success/put' element={<SuccessPutProduct />}/>
                  <Route path='/main_window/products/management' element={<ProductManagement/>}/>
                  <Route path='/main_window/products/edit/:id' element={<PutProduct />}/>
                  <Route path='/main_window/products/edit/price' element={<PutPriceProducts />}/>
                  <Route path='/main_window/clients/form' element={<FormClientContainer />}/>
                  <Route path='/main_window/clients/history' element={<ClientRegistration />}/>
                  <Route path='/main_window/clients/:id' element={<DetailClient />}/>
                  <Route path='/main_window/clients/edit/:id' element={<PutClient />}/>
                  <Route path='/main_window/debts' element={<Debts />}/>
                  <Route path='/main_window/debts/:id' element={<DetailDebt />}/>
                  <Route path='/main_window/debts/edit/:id' element={<PutDebt />}/>
                  <Route path='/main_window/debts/success' element={<DebtSettled />}/>
                </Routes>
              </div>
              <ToastContainer />
            </>
        )}
    </div>
  );
};

export default App;