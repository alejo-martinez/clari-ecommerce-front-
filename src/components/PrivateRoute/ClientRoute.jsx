import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function ClientRoute() {
  const {usuario} = useAuth();
  return usuario && usuario.rol === 'client' ? <Outlet /> : <Navigate to={"/"} />
}

export default ClientRoute;