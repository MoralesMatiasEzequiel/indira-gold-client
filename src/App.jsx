import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SideBar from "./components/common/SideBar.jsx"; 
import Stats from "./components/pages/Stats/Stats.jsx";
import Sales from "./components/pages/Sales/Sales.jsx";
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
import Clients from "./components/pages/Clients/Clients.jsx";
import DetailClient from "./components/pages/Clients/DetailClient/DetailClient.jsx";
import PutClient from "./components/pages/Clients/PutClient/PutClient.jsx";
import { ToastContainer } from 'react-toastify';

const App = () => {

  return (
    <div className="App">
      <div className="SideBar"><SideBar /></div>
      <div className="content">
        <Routes>
          <Route path='/main_window/stats' element={<Stats />}/>
          <Route path='/' element={<Sales />}/>
          <Route path='/main_window/sales/:id' element={<DetailSale />}/>
          <Route path='/main_window/sales/edit/:id' element={<PutSale/>}/>
          <Route path='/main_window/products' element={<Products />}/>
          <Route path='/main_window/products/:id' element={<DetailProduct />}/>
          <Route path='/main_window/products/form' element={<FormProduct />}/>
          <Route path='/main_window/products/success/post' element={<SuccessPostProduct />}/>
          <Route path='/main_window/products/success/put' element={<SuccessPutProduct />}/>
          <Route path='/main_window/products/management' element={<ProductManagement/>}/>
          <Route path='/main_window/products/edit/:id' element={<PutProduct />}/>
          <Route path='/main_window/products/edit/price' element={<PutPriceProducts />}/>
          <Route path='/main_window/clients' element={<Clients />}/>
          <Route path='/main_window/clients/:id' element={<DetailClient />}/>
          <Route path='/main_window/clients/edit/:id' element={<PutClient />}/>
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;