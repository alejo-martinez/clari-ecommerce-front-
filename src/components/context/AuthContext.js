import { useState, useContext, useEffect, createContext } from "react";
import { useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import {v4 as uuidv4} from 'uuid';

const userContext = createContext();

const apiUrl = process.env.REACT_APP_API_URL;
const CART_COOKIE_NAME = 'shop_cart';

const useAuth = () => {
    const context = useContext(userContext);
    if (!context) throw new Error('There is not auth provider');
    return context;
};

const AuthProvider = ({ children }) => {
    
    const [usuario, setUsuario] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] =useState(true);
    const [prevLocation, setPrevLocation] = useState(null);
    const [cart, setCart] = useState(null);

    const login = async (user) => {
        try {
            const response = await fetch(`${apiUrl}/session/login`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(user),
                credentials:'include'
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const register = async(user)=>{
        try {
            const response = await fetch(`${apiUrl}/session/register`, {
                headers:{
                    'Content-Type': 'application/json'
                },
                method:'POST',
                body: JSON.stringify(user),
                credentials:'include'
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const logout = async()=>{
        try {
            const response = await fetch(`${apiUrl}/session/logout`,{
                method:'DELETE',
                credentials:'include'
            });
            const json = await response.json();
            setUsuario(null);
            return json;
        } catch (error) {
            return error;
        }
    }

    const current = async()=>{
        try {
            const response = await fetch(`${apiUrl}/session/current`,{
                credentials:'include',
                method:'GET'
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const fetchData = async()=>{
            const savedCart = Cookies.get(CART_COOKIE_NAME)
            const response = await current();
            if(response.status === 'succes'){
                if(savedCart) Cookies.remove(CART_COOKIE_NAME);
                    setUsuario(response.payload);
                    setIsAuth(true);
                    setLoading(false);
            } 
            if(response.status === 'error'){
                setUsuario(null);
                setIsAuth(false);
                if(savedCart) setCart(JSON.parse(savedCart));
                if(!savedCart){
                    const newCart = {products:[], _id: uuidv4()}
                    Cookies.set(CART_COOKIE_NAME, JSON.stringify(newCart), {expires: 7})
                    setCart(newCart)
                }
                setLoading(false);
            }
    }
    
    useEffect(() => {
        const newFetchData = async()=>{
            await fetchData();

        }
        newFetchData();
      }, [])
      

    return (
        <userContext.Provider value={{register, login, logout, current, usuario, prevLocation, setPrevLocation, setUsuario, setIsAuth, cart, setCart }}>
            {loading? <div>Cargando...</div> : children}
        </userContext.Provider>
    )
}

export { AuthProvider, userContext, useAuth }; 