import { useEffect, useState, useContext, createContext } from "react";

const userContext = createContext();

const apiUrl = process.env.REACT_APP_API_URL;

const useUser = ()=>{
    const context = useContext(userContext);
    if(!context) throw new Error('No user provider');
    return context;
}

const UserProvider = ({children})=>{

    const updateUser = async(uid, body)=>{
        try {
            const response = await fetch(`${apiUrl}/user/update/${uid}`, {
                method:"PUT",
                body:JSON.stringify(body),
                headers:{
                    "Content-type":"application/json"
                    },
                credentials:"include"
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const sendEmail = async(email)=>{
        try {
            const response = await fetch(`${apiUrl}/user/reset`,{
                method:'PUT',
                body: JSON.stringify({ email: email }),
                headers:{"Content-Type": "application/json"},
                credentials:"include"
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const updatePassword = async(uid, pass)=>{
        try {
            const response = await fetch(`${apiUrl}/user/updatepass/${uid}`,{
                method:'PUT',
                body: JSON.stringify({password:pass}),
                headers:{"Content-Type": "application/json"},
                credentials:'include'
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    const getUserById = async(uid)=>{
        try {
            const response = await fetch(`${apiUrl}/user/${uid}`,{
                method:"GET",
                credentials:"include"
            });
            const json = await response.json();
            return json;
        } catch (error) {
            return error;
        }
    }

    return(
        <userContext.Provider value={{updateUser, updatePassword, sendEmail, getUserById}}>
            {children}
        </userContext.Provider>
    )
}

export {userContext, useUser, UserProvider}