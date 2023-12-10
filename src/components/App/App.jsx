import './App.css';

//COMPONENTES
import Login from '../Login/Login.jsx';
import Home from '../Home/Home.jsx';
import Register from '../Register/Register.jsx';
import Profile from '../Profile/Profile.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import ControlPanel from '../ControlPanel/ControlPanel.jsx';
import AdminRoute from '../PrivateRoute/AdminRoute.jsx';
import AuthRoute from '../PrivateRoute/AuthRoute.jsx';
import ProductCategory from '../ProductCategory/ProductCategory.jsx';
import Cart from '../Cart/Cart.jsx';
import ItemDetail from '../ItemDetail/ItemDetail.jsx';
import PagoComponent from '../PagoComponent/PagoComponent.jsx';

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
                  <Route path="/:page" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/subcategory/:subcategory" element={<ProductCategory />} />
                  <Route path="/itemdetail/:pid" element={<ItemDetail />} />
                  <Route element={<AuthRoute />}>
                    <Route path="/cart/:cid" element={<Cart />} />
                    {/* <Route path="/endpurchase" element={<PagoComponent />} /> */}
                  </Route>
                  <Route element={<AdminRoute />}>
                    <Route element={<ControlPanel />} path="/controlpanel" />
                    {/* <Route element={<ProdEdit />} path="/controlpanel/update/:pid"/> */}
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
