import './App.css';

//COMPONENTES
import Login from '../Login/Login.jsx';
import Home from '../Home/Home.jsx';
import Register from '../Register/Register.jsx';
import Profile from '../Profile/Profile.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import ControlPanel from '../ControlPanel/ControlPanel.jsx';
import ProductCategory from '../ProductCategory/ProductCategory.jsx';
import Cart from '../Cart/Cart.jsx';
import ItemDetail from '../ItemDetail/ItemDetail.jsx';

//RUTAS PROTEGIDAS
import AdminRoute from '../PrivateRoute/AdminRoute.jsx';
import AuthRoute from '../PrivateRoute/AuthRoute.jsx';
import ClientRoute from '../PrivateRoute/ClientRoute.jsx';
import LoguedRoute from '../PrivateRoute/LoguedRoute.jsx';

//PROVIDERS
import { AuthProvider } from '../context/AuthContext.js';
import { ProdProvider } from '../context/ProductContext.js';
import { CartProvider } from '../context/CartContext.js';
import { MpProvider } from '../context/MpContext.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AuthProvider>
        <ProdProvider>
          <MpProvider>
            <CartProvider>
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/subcategory/:subcategory" element={<ProductCategory />} />
                  <Route path="/itemdetail/:pid" element={<ItemDetail />} />
                  <Route element={<AuthRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>
                  <Route element={<LoguedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                  <Route element={<ClientRoute />}>
                    <Route path="/cart/:cid" element={<Cart />} />
                  </Route>
                  <Route element={<AdminRoute />}>
                    <Route element={<ControlPanel />} path="/controlpanel" />
                  </Route>
                  <Route path='*' element={<h2>Pagina no encontrada</h2>} />
                </Routes>
                <ToastContainer />
              </BrowserRouter>
            </CartProvider>
          </MpProvider>
        </ProdProvider>
      </AuthProvider>
    </>
  );
}

export default App;
