import React from "react";
import { Routes, Route } from 'react-router-dom';
import Stats from "./components/pages/Stats/Stats.jsx";


const App = () => {

  return (
    <div className="App">
      <h1>HOME</h1>
      <Routes>
        <Route path='/main_window' element={<Stats />}/>
      </Routes>
    </div>
  );
};

export default App;