import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

import './Profile.css';

function Profile() {

  const { usuario, setUsuario } = useAuth();
  const { updateUser, updatePassword } = useUser();

  const [user, setUser] = useState({ field: '', value: '' });
  const [update, setUpdate] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState(null);

  const handlePassword = ({ target: { value } }) => {
    if(error) setError(null);
    setPassword(value);
    setUser({...user, 'value': value})
  };

  const handlePasswordCheck = ({ target: { value } }) => {
    if(error) setError(null);
    setPasswordCheck(value);
  };

  const handleUpdatePassword = async () => {
    if (password !== passwordCheck) {
      setError('Las contraseñas no coinciden');
    } else {
      const resp = await updateUser(usuario._id, user);
      if (resp.status === 'succes') {
        toast.success(resp.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false });
        setPassword('');
        setPasswordCheck('');
        setUsuario({ ...usuario, [user.field]: user.value });
        setUser({ field: '', value: '' });
        setUpdate(null)
      }
      if (resp.status === 'error') {
        toast.error(resp.error, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false });
      }
    }
  }

  const handleUpdate = async () => {
    const resp = await updateUser(usuario._id, user);
    if (resp.status === 'succes') {
      toast.success(resp.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false });
      setUsuario({ ...usuario, [user.field]: user.value });
      setUser({ field: '', value: '' });
      setUpdate(null)
    }
    if (resp.status === 'error') {
      toast.error(resp.error, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false });
    }
  }

  const handleChange = ({ target: { value } }) => {
    setUser({ ...user, 'value': value });
  }

  const openInput = (field) => {
    setUser({ ...user, 'field': field });
    setUpdate(field);
  }

  return (
    <div className='body-profile'>
      <div className='div-profile'>
        <h2 className='title-profile'>Datos de la cuenta</h2>
        <div className='div-each-field-profile'>
          {
            update === 'name' ?
              <div className='div-profile-input'>
                <input type="text" name='name' onChange={handleChange} />
                <div className='div-btns-update-check'>
                  <FontAwesomeIcon icon={faXmark} onClick={() => setUpdate(null)} className='btn-update-profile' color='#D9846E' />
                  <FontAwesomeIcon icon={faCheck} onClick={() => handleUpdate()} className='btn-update-profile' color='#8F9779' />
                </div>
              </div>
              :
              <div className='div-profile-field'>
                <div className='div-field'>
                  <span>Nombre: </span>
                  <span>{usuario.name}</span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faSquarePen} onClick={() => openInput('name')} className='btn-update-profile' color='#001F3F' />
                </div>
              </div>
          }
        </div>
        {usuario.second_name &&
          <div className='div-each-field-profile'>
            {update === 'second_name' ?
              <div className='div-profile-input'>
                <input type="text" name='second_name' onChange={handleChange} />
                <div className='div-btns-update-check'>
                  <FontAwesomeIcon icon={faXmark} onClick={() => setUpdate(null)} className='btn-update-profile' color='#D9846E' />
                  <FontAwesomeIcon icon={faCheck} onClick={() => handleUpdate()} className='btn-update-profile' color='#8F9779' />
                </div>
              </div>
              :
              <div className='div-profile-field'>
                <div className='div-field'>

                  <span>Segundo nombre: </span>
                  <span>{usuario.second_name}</span>
                </div>
                <div>
                  <FontAwesomeIcon icon={faSquarePen} onClick={() => openInput('second_name')} className='btn-update-profile' color='#001F3F' />
                </div>
              </div>
            }
          </div>
        }
        <div className='div-each-field-profile'>
          {update === 'last_name' ?
            <div className='div-profile-input'>
              <input type="text" name='last_name' onChange={handleChange} />
              <div className='div-btns-update-check'>
                <FontAwesomeIcon icon={faXmark} onClick={() => setUpdate(null)} className='btn-update-profile' color='#D9846E' />
                <FontAwesomeIcon icon={faCheck} onClick={() => handleUpdate()} className='btn-update-profile' color='#8F9779' />
              </div>
            </div>
            :
            <div className='div-profile-field'>
              <div className='div-field'>
                <span>Apellido: </span>
                <span>{usuario.last_name}</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faSquarePen} onClick={() => openInput('last_name')} className='btn-update-profile' color='#001F3F' />
              </div>
            </div>
          }
        </div>
        <div className='div-each-field-profile'>
          {update === 'email' ?
            <div className='div-profile-input'>
              <input type="email" name="email" onChange={handleChange} />
              <div className='div-btns-update-check'>
                <FontAwesomeIcon icon={faXmark} onClick={() => setUpdate(null)} className='btn-update-profile' color='#D9846E' />
                <FontAwesomeIcon icon={faCheck} onClick={() => handleUpdate()} className='btn-update-profile' color='#8F9779' />
              </div>
            </div>
            :
            <div className='div-profile-field'>
              <div className='div-field'>
                <span>Email: </span>
                <span>{usuario.email}</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faSquarePen} onClick={() => openInput('email')} className='btn-update-profile' color='#001F3F' />
              </div>
            </div>
          }
        </div>
        <div className='div-each-field-profile'>
          {update === 'password' ?
            <div className='div-profile-input'>
              <div className='div-pass-input'>
                <input type="password" name="password" placeholder='Contraseña...' onChange={handlePassword} />
                <input type="password" name="passwordCheck" placeholder='Repita su contraseña...' onChange={handlePasswordCheck} />
              </div>
              <div className='div-btns-update-check'>
                <FontAwesomeIcon icon={faXmark} onClick={() => setUpdate(null)} className='btn-update-profile' color='#D9846E' />
                <FontAwesomeIcon icon={faCheck} onClick={() => handleUpdatePassword()} className='btn-update-profile' color='#8F9779' />
              </div>
            </div>
            :
            <div className='div-profile-field'>
              <div className='div-field'>
                <span>Contraseña: </span>
                <span>********</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faSquarePen} onClick={() => openInput('password')} className='btn-update-profile' color='#001F3F' />
              </div>
            </div>
          }
          <div>
            <span className='error'>{error && error}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;