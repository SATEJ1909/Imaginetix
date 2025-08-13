import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user , setUser] = useState(null);
    const [showLogin , setShowLogin] = useState(false);
    const [token , setToken] = useState(localStorage.getItem('token'));
    const [credit , setCredit] = useState(false);

    const navigate = useNavigate();

    const loadCreditData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/v1/user/credits' , {headers : {token}});
            
            if(data.success){
                setCredit(data.user.creditBalance);
                setUser(data.user);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const generateImage = async (prompt) =>{
        try {
            const  {data} = await axios.post(backendUrl + '/api/v1/image/generateImage' , {prompt} , {headers : {token}});

            if(data.success){
                loadCreditData();
                return data.image;
            }else{
                toast.error(data.message);
                loadCreditData();
                if(data.creditBalance === 0){
                    navigate('/buy')
                }
            }
            
        } catch (error : any) {
            toast.error(error.message);    
        }
    }
    const logOut = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    }

    useEffect(() =>{
        if(token){
            loadCreditData();
        }
    } , [token])

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const value = {
        user , setUser ,  showLogin , setShowLogin , backendUrl , token , setToken , credit , setCredit , loadCreditData , logOut , generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider ;