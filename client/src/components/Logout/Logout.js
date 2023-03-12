import { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";
import { logout } from "../../services/authService";

const Logout = () => {

  const navigate = useNavigate();
  const { userLogout } = useContext(AuthContext);

  
  useEffect(() => {
    (async () => {       
        await logout();    
        userLogout();
        navigate("/"); 
    })()
  },)

  return null;
}

export default Logout;