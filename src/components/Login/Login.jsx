import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

function Login() {
    const [user, setUser] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);

    const {login, prevLocation, setUsuario, setIsAuth} = useAuth();

    const navigate = useNavigate();

    const handleChange = ({ target: { name, value } }) => {
        if(error !== '') setError('');
        setUser({ ...user, [name]: value });
    }

    const handleLogin = async()=>{
            const response = await login(user);
            if(response.status === 'succes'){
                setUsuario(response.payload);
                setIsAuth(true);
                toast.success(response.message,{position:"top-center", autoClose:1300, hideProgressBar:true, closeOnClick:true, closeButton:true, pauseOnHover:false});
                setError('');
                if(prevLocation) navigate(prevLocation);
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