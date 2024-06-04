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
import ResetPass from '../ResetPass/ResetPass.jsx';
import SendMail from '../SendMail/SendMail.jsx';
import TicketDetail from '../TicketDetail/TicketDetail.jsx';
import EndPurchase from '../EndPurchase/EndPurchase.jsx';

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
import { UserProvider } from '../context/UserContext.js';
import { GetnetProvider } from '../context/GetnetContext.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <GetnetProvider>
            <ProdProvider>
              <MpProvider>
                <CartProvider>
                  <BrowserRouter>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/subcategory/:subcategory" element={<ProductCategory />} />
                      <Route path="/itemdetail/:pid" element={<ItemDetail />} />
                      <Route path="/resetpass/:uid" element={<ResetPass />} />
                      <Route path="/sendmail" element={<SendMail />} />
                      <Route path="/endpurchase" element={<EndPurchase />} />
                        <Route path="/cart/:cid" element={<Cart />} />
                      <Route element={<AuthRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                      </Route>
                      <Route element={<LoguedRoute />}>
                        <Route path="/profile" element={<Profile />} />
                      </Route>
                      {/* <Route element={<ClientRoute />}>
                      </Route> */}
                      <Route element={<AdminRoute />}>
                        <Route element={<ControlPanel />} path="/controlpanel" />
                        <Route path="/ticketdetail/:tid" element={<TicketDetail />} />
                      </Route>
                      <Route path='*' element={<h2>Pagina no encontrada</h2>} />
                    </Routes>
                    <ToastContainer />
                  </BrowserRouter>
                </CartProvider>
              </MpProvider>
            </ProdProvider>
          </GetnetProvider>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
