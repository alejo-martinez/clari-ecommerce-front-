import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

function Login() {
    const [user, setUser] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const {login, prevLocation} = useAuth();

    const navigate = useNavigate();

    const handleChange = ({ target: { name, value } }) => {
        if(error !== '') setError('');
        setUser({ ...user, [name]: value });
    }

    const handleLogin = async()=>{
        try {
            const response = await login(user);
            if(response.status === 'succes'){
                toast.success(response.message,{position:"top-center", autoClose:1300, hideProgressBar:true, closeOnClick:true, closeButton:true, pauseOnHover:false})
                setError('');
                if(prevLocation) navigate(prevLocation);
                else navigate('/');
            }
            else setError(response.error);
        } catch (error) {
            setError(error);
        }
    }   

    return (
        <>
            <div className='div-content-forms'>
                <h2>Inicia sesión !</h2>
                <div className='div-form'>
                    <div className='div-input'>
                        <label >Email:</label>
                        <input type="email" name="email" onChange={handleChange} />
                    </div>
                    <div className='div-input'>
                        <label >Contraseña:</label>
                        <input type="password" name="password" onChange={handleChange} />
                    </div>
                    <div>
                        <button onClick={handleLogin} className='btn-login'>Iniciar sesión</button>
                    </div>
                </div>
                <p className='error'>{error && `${error}`}</p>
            </div>
        </>
    )
}

export default Login;