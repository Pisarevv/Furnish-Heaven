import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({
    children
}) => {
    const [auth, setAuth] = useLocalStorage('user', {});

    const userLogin = (userData) => {
        setAuth(userData);
    }

    const userLogout = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider value = {{user: auth, userLogin, userLogout, isAuthenticated : !!auth.accessToken}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    return context;
}