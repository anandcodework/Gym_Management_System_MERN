import {useState, useEffect, useContext, createContext} from "react";
import axios from "axios";
const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({
        user:null,
        token:""
    });

    // default axios
    axios.defaults.headers.common['Authorization'] = auth?.token;
    

    useEffect(() => {
        const storedData = localStorage.getItem("auth");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setAuth({
            user: parsedData.user,
            token: parsedData.token,
          });
        }
      }, []);
      

return (
    <AuthContext.Provider value={{auth, setAuth}}>
        {children}
    </AuthContext.Provider>
)

}

// custom hooks

const useAuth = () => {
   return useContext(AuthContext);
}

export {AuthProvider, useAuth};