import React from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {

  
  const token = localStorage.getItem('access_token');


  return (

    <Route
      {...rest}
      element={token ? <Component /> : <Navigate to="/login" />}
    />

  );
};

export default PrivateRoute;
