import { useEffect, useState, useContext, createContext } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";

const mpContext = createContext();

const apiUrl = process.env.REACT_APP_API_URL;

const useMp = ()=>{
    const context = useContext(mpContext);
    if(!context) throw new Error('No mercadopago provider');
    return context;
}

const MpProvider = ({children})=>{

    const crearPreferencia = async()=>{
        try {
            const response = await fetch(`${apiUrl}/mercadopago`,{
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                }
            });
            
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }
    

    return(
        <mpContext.Provider value={{ crearPreferencia}}>
            {children}
        </mpContext.Provider>
    )
}

export {MpProvider, mpContext, useMp};