import React from 'react';

import ReactDOM from 'react-dom/client';

import './style/index.css';

import App from './App';
import { AuthProvider } from './AuthContext';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <React.StrictMode>

    <AuthProvider>

    <BrowserRouter>

    <App />

    </BrowserRouter>

    </AuthProvider>
    

  </React.StrictMode>
);

