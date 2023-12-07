import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function AuthRoute() {
    const {usuario} = useAuth();
  return  usuario? <Outlet /> : <Navigate to={"/"}/>
}

export default AuthRoute