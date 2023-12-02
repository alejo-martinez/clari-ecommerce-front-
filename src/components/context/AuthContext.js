import { useState, useContext, useEffect, createContext } from "react";

const userContext = createContext();

const apiUrl = process.env.REACT_APP_API_URL;

const useAuth = () => {
    const context = useContext(userContext);
    if (!context) throw new Error('There is not auth provider');
    return context;
};

const AuthProvider = ({ children }) => {
    
    const [usuario, setUsuario] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] =useState(true);

    // console.log(isAuth);

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
            setUsuario(json.payload);
            setIsAuth(true);
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

    useEffect(() => {
        const fetchData = async()=>{
                const response = await current();
                if(response.status === 'succes'){
                    setUsuario(response.payload);
                    setIsAuth(true);
                    setLoading(false);
                } 
                if(response.status === 'error'){
                    setUsuario(null);
                    setIsAuth(false);
                    setLoading(false);
                }
        }
        if(!isAuth && !usuario) fetchData();
      }, [])
      

    return (
        <userContext.Provider value={{register, login, logout, current, usuario, isAuth }}>
            {loading? <div>Cargando...</div> : children}
        </userContext.Provider>
    )
}

export { AuthProvider, userContext, useAuth }; 