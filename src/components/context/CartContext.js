import { useEffect, useState, useContext, createContext } from "react";

const cartContext = createContext();

const apiUrl = process.env.REACT_APP_API_URL;

const useCart = ()=>{
    const context = useContext(cartContext);
    if(!context) throw new Error('No cart provider');
    return context;
}

const CartProvider = ({children}) =>{



    const getProductsCart = async(id)=>{
        try {
            const response = await fetch(`${apiUrl}/cart/${id}`,{
                method:'GET',
                credentials:'include'
            })
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const addProduct = async(cid, pid, quantity)=>{
        try {
            const response = await fetch(`${apiUrl}/cart/${cid}`,{
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({idProd: pid, quantity: quantity})
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const removeProd = async(cid, pid, quantity)=>{
        try {
            const response = await fetch(`${apiUrl}/cart/${cid}/remove/${pid}`,{
                method:'DELETE',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({quantity: quantity})
            })
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const emptyCart = async(cid)=>{
        try {
            const response = await fetch(`${apiUrl}/cart/${cid}`,{
                method:'DELETE',
                credentials:'include'
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    return(
        <cartContext.Provider value={{getProductsCart, addProduct, removeProd, emptyCart}}>
            {children}
        </cartContext.Provider>
    )
};

export {cartContext, CartProvider, useCart};