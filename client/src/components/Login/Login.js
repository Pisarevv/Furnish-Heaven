/**
 * Login Component
 * ---------------------
 * This component displays the login form for the user
 * to authenticate.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - email (string): Holding the user email input.
 * - password (string): Holding hte user password input.
 * ----------------------
 * 
 * Contexts:
 * ----------------
 * - useAuthContext
 *  In this component this context provides the "userLogin" function.
 *  The purpose of this function is to set the user data after successful login 
 *  in the custom localStorage hook.
 *  
 *  - useCartContext
 *  In this component this context provides the "addProductToCart" function.
 *  The purpose of this function is to set the user cart products after successful login.
 * -----------------
 * 
 * Functions:
 * -----------------
 * - onEmailChange:
 *  Function for handling user input for email.
 * - onPasswordChange:
 *  Function for handling user input for password.
 * - loginHandler:
 *   Function that sends the user input.
 *   If the sent data is valid the user is authenticated and redircted.
 * 
 * - ErrorHandler
 *  This is a custom function that handles errors thrown by the REST api  
 *  and based on the error shows the user notifications.
 *  In the current case with a invalid access  token the user recieves a 
 *  notification containing :
 *  title : "Invalid access token"
 *  message : "Your session has expired. Please log in again."
 * -----------------
**/


import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';

import { useCartContext } from "../../contexts/CartContext";
import { useAuthContext } from '../../contexts/AuthContext';

import { login } from '../../services/authService';
import { getUserCartItems } from '../../services/cartService';

import './Login.css'


const Login = () => {

    const { userLogin } = useAuthContext();
    const { addProductToCart } = useCartContext();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    //Event handlers
    const onEmailChange = (e) => {
        setEmail(email => e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(email => e.target.value);
    }

    const loginHandler = async (e) => {
        try {
            let returnedUserData = await login(email, password);
            let cartProducts = await getUserCartItems(returnedUserData._id);
            userLogin(returnedUserData);
            addProductToCart(cartProducts);  
            navigate('/');
        }
        catch (error) {
            ErrorHandler(error);
        }


    }

    return (
        <section className="log">
            <div className="containerLog">
                <div className="login">
                    <div className="heading">
                        <h2>Sign in</h2>
                        <form onSubmit={loginHandler}>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Email" name="email" value={email} onChange={onEmailChange} />
                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Password" name="password" value={password} onChange={onPasswordChange} />
                            </div>

                            <button type="submit" className="float">Login</button>

                            <p className="sign-up">Don't have an account? Sign up <NavLink to="/register" >here</NavLink>.</p>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default Login;

