import { useState, useEffect, useContext, createContext } from "react";

const getnetContext = createContext();

const useGetnet = ()=>{
    const context = useContext(getnetContext);
    if(!context) throw new Error('useGetnet must be used within the GetnetProvider');
    return context;
}

const apiUrl = process.env.REACT_APP_API_URL;

const GetnetProvider = ({children}) =>{

    const getToken = async()=>{
        const response = await fetch(`${apiUrl}/getnet/token`, {
            method: 'POST',
            credentials: 'include'
        })
        
        const data = await response.json();

        return data;
    }

    const generatePayment = async(token, items, idCart)=>{
        const response = await fetch(`${apiUrl}/getnet/payment`, {
            method:'POST',
            credentials:'include',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({token: token, items: items, idCart: idCart})
        })
        // const response = await fetch(`https://api.globalgetnet.com.ar/api/v2/orders`, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/vnd.api+json',
        //       'Accept': 'application/vnd.api+json',
        //       'Authorization': `Bearer ${token}`
        //     },
        //     body: JSON.stringify({
        //       data: {
        //         attributes: {
        //           currency: '032', // Cambia a '032' para pesos argentinos
        //           items: items, // Utiliza los items proporcionados como prop
        //           redirect_urls:{
        //             success: `http://localhost:3000/cart/${idCart}/?status=success`,
        //             failed: `http://localhost:3000/cart/${idCart}/?status=failed`
        //           }
        //         }
        //       }
        //     })
        //   });
        //   console.log(response)
    
        //   if (!response.ok) {
        //     throw new Error('Error al generar la intención de pago');
        //   }
    
          const orderData = await response.json();
          console.log(orderData);
        //   setOrder(orderData);
    }

    return(
        <getnetContext.Provider value={{getToken, generatePayment}}>{children}</getnetContext.Provider>
    )
}

export {getnetContext, GetnetProvider, useGetnet};