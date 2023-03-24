import { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { logout } from "../../services/authService";

const Logout = () => {

  const navigate = useNavigate();
  const { userLogout } = useContext(AuthContext);
  const { emptyCart } =  useContext(CartContext);

  
  useEffect(() => {
    (async () => {       
        await logout();    
        userLogout();
        emptyCart();
        navigate("/"); 
    })()
  },)

  return null;
}

export default Logout;