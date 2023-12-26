import React, {useState} from "react";
import './SendMail.css';
import { useUser } from "../context/UserContext";
import {toast} from "react-toastify";

function SendMail() {

    const {sendEmail} = useUser();

    const [mail, setMail] = useState('');

    const handleMail = ({target: {value}})=>{
        setMail(value);
    }

    const send = async()=>{
        const resp = await sendEmail(mail);
        if(resp.status === 'success'){
            setMail('');
            toast.success(resp.message, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
        }
        if(resp.status === 'error'){
            toast.error(resp.error, { position: "top-center", autoClose: 1300, hideProgressBar: true, closeOnClick: true, closeButton: true, pauseOnHover: false })
        }
    }


    return (
        <div className="body-sendemail">
            <h3>Cambio de contraseña</h3>
            <div className="div-input-email">
                <div className="field-input">
                    <label>Ingrese su email:</label>
                    <input type="email" name="email" onChange={handleMail}/>
                </div>
                <button className="btn-sendmail" onClick={send}>Enviar email</button>
            </div>
        </div>
    );
};

export default SendMail;