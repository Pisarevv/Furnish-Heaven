import { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import { login } from '../../services/authService';
import { getUserCartItems } from '../../services/cartService';
import { Store } from 'react-notifications-component';
import './Login.css'


const Login = () => {

    const { userLogin , userLogout} = useContext(AuthContext);
    const { addProductToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});

    const onEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
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
            if(error === "Login or password don't match"){
            Store.addNotification({
            title: "Invalid credentials!",
            message: error,
            type: "warning",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        })}
        else if(error === "Invalid access token"){
            Store.addNotification({
                title: error,
                message: "Please log in again",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });
            userLogout();
        };
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

