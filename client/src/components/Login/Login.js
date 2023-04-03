/**
 * Login Component
 * ---------------------
 * This component displays the starting page of the website with 
 * the wellcoming slogans and showing the top 4 most trending products.
 * Trending products are products that have more than 5 rating on them.
 * The catalog provides two buttons - a button to navigate to the store products page or 
 * user listing products
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - trendingProducts (array): The collection holding the fetched products from the server.
 *  Example 
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * [{…}, {…}, {…}, {…}]
 * 0: 
 * {_id: '53d4dbf5-7f41-47ba-b485-43eccb91cb95', model: 'Opulent Oaken Boardroom Table', price: 1235, imgUrl: 'https://www.bentleydesigns.com/images/products/large/3074_10186.jpg', rating: 9.5, description : ...}
 * 1: 
 * {_id: '22d4dbf5-7f41-47ba-b485-43eccb91cb95', model: 'Regal Slumber Haven', price: 2235, imgUrl: 'https://www.idfdesign.com/images/luxury-classic-bed-and-canopy-bed/r45-bed-carved-beds-3.jpg', rating: 8.8, description : ...}
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ---------------
 * 
 * Contexts:
 * ----------------
 * - useAuthContext
 *  In this component this context provides the "userLogout" function.
 *  The purpose of this function here is when the user has an expired 
 *  access token to be logged out on the first opening of the page
 *  and set localStorage key containing the user information to default.
 *  
 *  - useCartContext
 *  In this component this context provides the "emptyCart" function.
 *  The purpose of this function here is also when the user has an expired 
 *  access token have his cart in the localStorage set to the default value on the 
 *  first opening of the page.
 * -----------------
 * 
 * Functions:
 * -----------------
 * - Observe 
 *  This function is used for the animation of fading in in the page.
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


    const onEmailChange = (e) => {
        setEmail(email => e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(email => e.target.value);
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        console.log(email, password);
        try {
            let result = await login(email, password);
            let cartProducts = await getUserCartItems(result._id);
            userLogin(result);
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

