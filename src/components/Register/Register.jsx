import React, {useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

function Register() {

  const [user, setUser] = useState({name:'', second_name:'', last_name:'', email:'', password:''});
  const [error, setError] = useState(null);

  const {register} = useAuth();

  const navigation = useNavigate();

  const handleChange = ({target: {name, value}}) =>{
    if(error !== '') setError('');
    setUser({...user, [name]: value});
  }

  const handleRegister = async()=>{
    try {
      const response = await register(user);
      if(response.status === 'succes'){
        toast.success(response.message,{position:"top-right", autoClose:2000, hideProgressBar:true, closeOnClick:false, closeButton:false})
        setError(null)
        navigation('/login')
      }
      if(response.status === 'error') setError(response.error);
    } catch (error) {
      setError(error);
    }
  }

  const handleKeyPress = async(event) => {
    if (event.key === 'Enter') {
        await handleRegister();
    }
}

  return (
    <>
      <div className='div-content-forms'>
        <h2>Registrate !</h2>
        <div className='div-form'>
          <div className='div-input'>
            <label>Nombre</label>
            <input type="text" name="name" onChange={handleChange} onKeyDown={handleKeyPress} />
          </div>
          <div className='div-input'>
            <label>Segundo nombre</label>
            <input type="text" name="second_name" onChange={handleChange} onKeyDown={handleKeyPress} />
          </div>
          <div className='div-input'>
            <label>Apellido</label>
            <input type="text" name="last_name" onChange={handleChange} onKeyDown={handleKeyPress} />
          </div>
          <div className='div-input'>
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} onKeyDown={handleKeyPress} />
          </div>
          <div className='div-input'>
            <label>Contraseña</label>
            <input type="password" name="password" onChange={handleChange} onKeyDown={handleKeyPress} />
          </div>
          <div>
            <button onClick={handleRegister} className='btn-login'>Registrarse</button>
          </div>
        </div>
        <p className='error'>{error && `${error}`}</p>
      </div>
    </>
  )
}

export default Register