import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoutes } from './router/routes';

import './assets/styles/_reset.scss';
import './assets/styles/index.scss';


const App: React.FC = () => {
  const routes = createRoutes()

  return (
    <BrowserRouter>
      <Routes>
        {
          routes.map((route) => (
            <Route 
              key={route.path}
              path={route.path}
              element={route.element}
              />
          ))
        }  
      </Routes>    
    </BrowserRouter>
  )
}

export default App
