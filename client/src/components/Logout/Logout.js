/**
 * Logout Component
 * ---------------------
 * This component sends a request to log the user out of the website.
 * ---------------------- 
 *
 * Contexts:
 * ----------------
 * - useAuthContext
 *  In this component this context provides the "userLogout" function.
 *  The purpose of this function is to set the user data to default value in the localStorage after 
 *  successful logout.
 *  
 *  - useCartContext
 *  In this component this context provides the "emptyCart" function.
 *  The purpose of this function is to clear the user cart data stored in the localStorage.
 * -----------------
 *
 * - ErrorHandler
 *  This is a custom function that handles errors thrown by the REST api  
 *  and based on the error shows the user notifications.
 * -----------------
**/

import { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";

import { logout } from "../../services/authService";
import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";

const Logout = () => {

  const navigate = useNavigate();
  const { userLogout } = useContext(AuthContext);
  const { emptyCart } = useContext(CartContext);


  useEffect(() => {
    (async () => {
      try {
        await logout();
        userLogout();
        emptyCart();
        navigate("/");
      }
      catch (error) {
        ErrorHandler(error);
      }

    })()
  }, [])

  return null;
}

export default Logout;