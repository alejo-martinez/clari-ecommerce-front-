import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SearchBar from '../SearchBar/SearchBar';

import { useAuth } from '../context/AuthContext';
import { useProd } from '../context/ProductContext';

import Cookies from 'js-cookie';
import {v4 as uuidv4} from 'uuid';

import './Navbar.css';

function Navbar() {

    const { usuario, logout, setPrevLocation, current, setUsuario, setLoading, cart, setCart } = useAuth();

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
            const newCart = {_id: uuidv4(), products: []}
            Cookies.set('shop_cart', JSON.stringify(newCart), {expires: 7});
            toast.success(response.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover:false });
            setCart(newCart)
            if (location.pathname === "/controlpanel") navigation("/");
            if(location.pathname.includes('/cart')) navigation("/")
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
                        <div className='div-img-inicio'>
                            <Link to={"/"}>
                                <img src="https://claraimgprods.s3.us-east-2.amazonaws.com/logo.jpeg" alt="" width={150} height={150} className='img-inicio'/>
                            </Link>
                        </div>
                        <div className='div-searchbar'>
                            <SearchBar />
                        </div> 
                        <div className='div-panel-user'>
                            {usuario ?
                                <div className='panel-user'>
                                    <div className='panel-user-true'>
                                        <div className='panel-user-true-links'>
                                            <Link to={"/profile"}>
                                                <FontAwesomeIcon icon={faUser} color='white' className='btn-user'/>
                                            </Link>
                                            {usuario.rol === 'client' ?
                                                <Link to={`/cart/${usuario.cart._id}`}>
                                                    <FontAwesomeIcon icon={faCartShopping} color='#fff' className='link-panel'/>
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
                                    <Link to={"/register"} className='link link-register'>Registrarse</Link>
                                    <Link to={`/cart/${cart._id}`}><FontAwesomeIcon icon={faCartShopping}/></Link>
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

export default React.memo(Navbar);