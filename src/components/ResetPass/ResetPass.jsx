import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {toast} from 'react-toastify';

import './ResetPass.css';

function ResetPass() {

    const { uid } = useParams();
    const { updatePassword } = useUser();

    const navigation = useNavigate();

    const [error, setError] = useState(null);
    const [pass, setPass] = useState('');
    const [passCheck, setPassCheck] = useState('');

    const handlePass = ({target: {value}})=>{
        setPass(value);
    };

    const handlePassCheck = ({target: {value}})=>{
        setPassCheck(value);
    };

    const sendData = async()=>{
        if(pass !== passCheck) setError('Las contraseñas no coinciden.');
        else{
            const resp = await updatePassword(uid, pass);
            if(resp.status === 'success'){
                toast.success(resp.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false });
                setTimeout(() => {
                    navigation('/login');
                }, 2300);
            }
            if(resp.error){
                toast.error(resp.error, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
            }
        }
    }



    return (
        <div>
                    <div>
                        <div>
                            <label>Contraseña</label>
                            <input type="password" name="pass" onChange={handlePass}/>
                        </div>
                        <div>
                            <label>Confirmar contraseña</label>
                            <input type="password" name="passCheck" onChange={handlePassCheck}/>
                        </div>
                        <button onClick={()=> sendData()}>Actualizar</button>
                        { error && <p>{error}</p> }
                    </div>
        </div>
    );
};

export default ResetPass;