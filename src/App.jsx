import React from "react";
import { Routes, Route } from 'react-router-dom';
import SideBar from "./components/common/SideBar/SideBar.jsx"; 
import Stats from "./components/pages/Stats/Stats.jsx";
import Sales from "./components/pages/Sales/Sales.jsx";
import Products from "./components/pages/Products/Products.jsx";
import Detail from "./components/pages/Products/DetailProduct/DetailProduct.jsx";
import FormProduct from "./components/pages/Products/FormProduct/FormProduct.jsx";
import Clients from "./components/pages/Clients/Clients.jsx";


const App = () => {

  return (
    <div className="App">
      <h1>HOME</h1>
      <SideBar />
      <Routes>
        <Route path='/main_window/stats' element={<Stats />}/>
        <Route path='/main_window/sales' element={<Sales />}/>
        <Route path='/main_window/products' element={<Products />}/>
        <Route path='/main_window/detail/:id' element={<Detail />}/>
        <Route path='/main_window/products/form' element={<FormProduct />}/>
        <Route path='/main_window/clients' element={<Clients />}/>
      </Routes>
    </div>
  );
};

export default App;