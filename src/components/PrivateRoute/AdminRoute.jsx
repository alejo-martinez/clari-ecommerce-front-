import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function AdminRoute() {
  const {usuario} = useAuth();
  return usuario && usuario.rol === 'admin' ? <Outlet /> : <Navigate to={"/"} />
}

export default AdminRoute;