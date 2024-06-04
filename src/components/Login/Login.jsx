import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

import Cookies from 'js-cookie';

function Login() {
    const [user, setUser] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    const {login, prevLocation, setUsuario, setIsAuth} = useAuth();
    const {updateCart} = useCart();

    const navigate = useNavigate();

    const handleChange = ({ target: { name, value } }) => {
        if(error !== '') setError('');
        setUser({ ...user, [name]: value });
    }

    const handleLogin = async()=>{
            const cookie = Cookies.get('shop_cart');
            const response = await login(user);
            if(response.status === 'succes'){
                // if(cookie && cookie.products.length !== 0){
                //     await updateCart(response.payload.cart._id, cookie.products);
                // }
                // console.log(response)
                // console.log(JSON.parse(cookie))
                if(cookie) Cookies.remove('shop_cart');
                setUsuario(response.payload);
                setIsAuth(true);
                toast.success(response.message,{position:"top-center", autoClose:1300, hideProgressBar:true, closeOnClick:true, closeButton:true, pauseOnHover:false});
                setError('');
                if(prevLocation){
                    if(prevLocation.includes("endpurchase")) navigate('/')
                    else  navigate(prevLocation);
                }
                else navigate('/');
            }
            if(response.status === 'error'){
                setUsuario(null);
                setIsAuth(false);
                setError(response.error);
            }
            
    }

    const handleKeyPress = async(event) => {
        if (event.key === 'Enter') {
            await handleLogin();
        }
    }

    return (
        <>
            <div className='div-content-forms'>
                <h2>Inicia sesión !</h2>
                <div className='div-form'>
                    <div className='div-input'>
                        <label >Email:</label>
                        <input type="email" name="email" onChange={handleChange} onKeyDown={handleKeyPress}/>
                    </div>
                    <div className='div-input'>
                        <label >Contraseña:</label>
                        <input type="password" name="password" onChange={handleChange} onKeyDown={handleKeyPress}/>
                    </div>
                    <div>
                        <button onClick={handleLogin} className='btn-login'>Iniciar sesión</button>
                    </div>
                </div>
                <Link to={"/sendmail"} className='link-forgotpass'>Olvidé mi contraseña</Link>
                <p className='error'>{error && `${error}`}</p>
            </div>
        </>
    )
}

export default Login;