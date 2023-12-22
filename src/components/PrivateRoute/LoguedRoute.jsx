import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function LoguedRoute() {
    const {usuario} = useAuth();
  return  usuario? <Outlet /> : <Navigate to={"/"}/> ;
}

export default LoguedRoute;