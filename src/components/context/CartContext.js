import { useEffect, useState, useContext, createContext } from "react";

const cartContext = createContext();

const apiUrl = process.env.REACT_APP_API_URL;

const useCart = ()=>{
    const context = useContext(cartContext);
    if(!context) throw new Error('No cart provider');
    return context;
}

const CartProvider = ({children}) =>{

    const [loading, setLoading] = useState(true);

    const getProductsCart = async(id)=>{
        try {
            const response = await fetch(`${apiUrl}/cart/${id}`,{
                method:'GET',
                credentials:'include'
            })
            const json = await response.json();
            setLoading(false);
            return json;
        } catch (error) {
            return error;
        }
    }

    const addProduct = async(cid, body)=>{
        try {
            const response = await fetch(`${apiUrl}/cart/${cid}`,{
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(body)
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const removeProd = async(cid, pid, quantity, color, size)=>{
        try {
            const response = await fetch(`${apiUrl}/cart/${cid}/remove/${pid}`,{
                method:'DELETE',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({quantity: quantity, color: color, size: size})
            })
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const updateCart = async(cid, prods)=>{
        const response = await fetch(`${apiUrl}/cart/update/${cid}`, {
            method: 'PUT',
            credentials: 'include',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({productos: prods})
        })
        const json = await response.json();
        return json;
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

    const getAllTickets = async()=>{
        try {
            const response = await fetch(`${apiUrl}/ticket`, {
                method:'GET',
                credentials:'include'
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const getTicketByPreference = async(tid)=>{
        try {
            const response = await fetch(`${apiUrl}/ticket/preference/${tid}`, {
                method : "GET",
                credentials: "include"
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const getTicketById = async(id)=>{
        try {
            const response = await fetch(`${apiUrl}/ticket/${id}`,{
                method:"GET",
                credentials:"include"
            });

            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const createTicket = async(ticket)=>{
        try {
            const response = await fetch(`${apiUrl}/ticket/`, {
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticket)
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const approveTicket = async(id)=>{
        try {
            const response = await fetch(`${apiUrl}/ticket/approved/${id}`,{
                method:'PUT',
                credentials:'include'
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const deleteTicket = async(id)=>{
        try {
            const response = await fetch(`${apiUrl}/ticket/delete/${id}`,{
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
        <cartContext.Provider value={{getProductsCart, addProduct, removeProd, emptyCart, getTicketByPreference, getAllTickets, getTicketById, createTicket, approveTicket, deleteTicket, updateCart}}>
            {children}
        </cartContext.Provider>
    )
};

export {cartContext, CartProvider, useCart};