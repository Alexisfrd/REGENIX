import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import TemperaturePage from './pages/temperaturePage';
import PhPage from './pages/phPage';
import DoPage from './pages/doPage';
import DebitPage from './pages/debitPage';
import Culture from './pages/Culture';
import LogPage from './pages/LogPage';
import Dashboard from './pages/Dashboard';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/temp",
    element: <TemperaturePage/>,
  },
  {
    path: "/do",
    element: <DoPage />,
  },
  {
    path: "/ph",
    element: <PhPage />,
  },
  {
    path: "/debit",
    element: <DebitPage />,
  },
  {
    path: "/culture",
    element: <Culture />,
  },
  {
    path: "/log",
    element: <LogPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
    
);

reportWebVitals();
