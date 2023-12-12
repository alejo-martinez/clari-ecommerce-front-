import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SearchBar from '../SearchBar/SearchBar';

import { useAuth } from '../context/AuthContext';
import { useProd } from '../context/ProductContext';

import './Navbar.css';

function Navbar() {

    const { usuario, logout, setPrevLocation } = useAuth();
    const { products, setProducts } = useProd();

    // const [navFixed, setNavFixed] = useState(false);

    const navigation = useNavigate();
    const location = useLocation();

    const goLogin = ()=>{
        setPrevLocation(location.pathname);
        navigation('/login');
    }

    const handleLogout = async () => {
        const response = await logout();
        const ubication = location.pathname;
        if (response.status === 'succes') {
            toast.success(response.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover:false });
            if (location.pathname === "/controlpanel") navigation("/");
            else navigation(ubication);
        }
        if (response.status === 'error') {
            toast.error(response.error, { position: "top-right", autoClose: 5000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true });
        }
    }

    return (
        <>
            <div>
                <div>
                    <div className='nav-sup'>
                        <div>
                            <Link to={"/"}><h3 className='home'>Clara</h3></Link>
                            {/* aca va el logo */}
                        </div>
                        <div>
                            <SearchBar />
                        </div> 
                        <div>
                            {usuario ?
                                <div className='panel-user'>
                                    <div className='panel-user-true'>
                                        <div className='panel-user-true-links'>
                                            <Link to={"/profile"}>
                                                <FontAwesomeIcon icon={faUser} className='btn-user'/>
                                            </Link>
                                            {usuario.rol === 'client' ?
                                                <Link to={`/cart/${usuario.cart}`}>
                                                    <FontAwesomeIcon icon={faCartShopping} className='link-panel'/>
                                                </Link>
                                                :
                                                ''
                                            }
                                        </div>
                                        <button onClick={handleLogout} className='btn-logout'>Cerrar sesion</button>
                                    </div>
                                    {
                                        usuario.rol === 'admin' &&
                                        <div>
                                            <Link to={"/controlpanel"} className='link'>Panel de control</Link>
                                        </div>
                                    }
                                </div>
                                :
                                <div className='links-nav'>
                                    <button onClick={goLogin} className='buttonlink-login'>Iniciar sesión</button>
                                    <Link to={"/register"} className='link'>Registrarse</Link>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <ul className='ul-nav'>
                        <li className='nav-item'>
                            <span>Velas</span>
                            <ul className='submenu'>
                                <li className='submenu-item'><Link to={"/subcategory/decorativas"}>Decorativas</Link></li>
                                <li className='submenu-item'><Link to={"/subcategory/eventos"}>Para eventos</Link></li>
                                <li className='submenu-item'><Link to={"/subcategory/aromaticas"}>Aromáticas</Link></li>
                                <li className='submenu-item'><Link to={"/subcategory/molde"}>De molde</Link></li>
                            </ul>
                        </li>
                        <li className='nav-item'>
                            <span>Mantas</span>
                            <ul className='submenu'>
                                <li className='submenu-item'><Link to={"/subcategory/sillones"}>Para sillones</Link></li>
                                <li className='submenu-item'><Link to={"/subcategory/mesa"}>Caminos para mesa</Link></li>
                                <li className='submenu-item'><Link to={"/subcategory/individuales"}>Manteles individuales</Link></li>
                            </ul>
                        </li>
                        <li className='nav-item'>
                            <span>Artículos de decoración</span>
                            <ul className='submenu'>
                                <li className='submenu-item'><Link to={"/subcategory/hornillos"}>Hornillos/fogoneros</Link></li>
                                <li className='submenu-item'><Link to={"/subcategory/fuentes"}>Fuentes para jardines</Link></li>
                                <li className='submenu-item'><Link to={"/subcategory/figuras"}>Figuras de india</Link></li>
                            </ul>
                        </li>
                        <li className='nav-item'>
                            <span>Flores</span>
                            <ul className='submenu'>
                                <li className='submenu-item'><Link to={"/subcategory/secas"}>Secas</Link></li>
                                <li className='submenu-item'><Link to={"/subcategory/textiles"}>Textiles</Link></li>
                            </ul>
                        </li>
                        <div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar