/**
 * Register Component
 * ---------------------
 * This component displays the register form for the user
 * to create an account.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - email (string): Holding the user email input.
 * - password (string): Holding the user password input.
 * - rePassword (string): Holding the repeated user password.
 * ----------------------
 * 
 * Contexts:
 * ----------------
 * - useAuthContext
 *  In this component this context provides the "userLogin" function.
 *  The purpose of this function is to set the user data after successful login 
 *  in the custom localStorage hook.
 * -----------------
 * 
 * Functions:
 * -----------------
 * - onEmailChange:
 *  Function for handling user input for email.
 * - onPasswordChange:
 *  Function for handling user input for password.
 * - onRePasswordChange:
 *  Function for handling user input for repeated password.
 * - registerHandler:
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

import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';

import { register } from '../../services/authService';

import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';

import './Register.css'


const ValidationRegexes = {
    //The current regex validates that the input email address 
    //begins with a string, contains a "@" symbol and "." after the domain
    // and end with a top-level-domain TLD
    emailRegex: new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]+$'),

    //This regex validates that the input has minimul 8 charecters and one of them 
    //must be a letter
    passwordRegex: new RegExp( /^(?=.*[a-zA-Z]).{8,}$/)
}

const ValidationErrors = {
    email : "Please enter a valid email address",
    password: "Password must contain minimum eight characters and at least one letter.",
    rePassword: "Passwords do not match"
}

const Register = () => {


    const [email,setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password,setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [rePassword,setRepassword] = useState("");
    const [rePasswordError, setRePasswordError] = useState("");

    const {userLogin} = useContext(AuthContext);
    const navigate = useNavigate();

    const onEmailChange = (e) => {
        setEmail(email => e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(password => e.target.value);
    }

    const onRePasswordChange = (e) => {
        setRepassword(rePassword => e.target.value)
    }

    const validateEmailInput = () => {   
        if(!ValidationRegexes.emailRegex.test(email)){
            setEmailError(emailError => ValidationErrors.email)
            return false;
        }
        return true;
    }

    const validatePasswordInput = () => {
        if(!ValidationRegexes.passwordRegex.test(password)){
            setPasswordError(passwordError => ValidationErrors.password);
            return false;
        }
        return true;
    }

    const validateRePasswordInput = () => {
        if(rePassword !== password){
            setRePasswordError(rePasswordError => ValidationErrors.rePassword);
            return false;
        }
        return true;
    }

    const registerHandler = async(e) => {
        e.preventDefault();
        try{
            let isEmailValid = validateEmailInput(email);
            let isPasswordValid = validatePasswordInput(password);
            let isRePasswordValid = validateRePasswordInput(rePassword);

            if(isEmailValid && isPasswordValid && isRePasswordValid){
                let returnedUserData = await register(email,password);
                userLogin(returnedUserData);
                navigate('/');
            }
            else{
                throw("Invalid input fields")
            }
        }
        catch(error){
            ErrorHandler(error);
        }
        
       }

    return (
        <section className="reg">
            <div className="containerReg">
                <div className="register">
                    <div className="heading">
                        <h2>Register</h2>
                        <form onSubmit={registerHandler}>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Email" name="email" value={email} onChange={onEmailChange}/>
                                {emailError && <p>{emailError}</p>}
                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Password" name="password" value={password} onChange={onPasswordChange}/> 
                                {passwordError && <p>{passwordError}</p>}
                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Repeat Password" name="rePassword" value={rePassword} onChange={onRePasswordChange}/>
                                {rePasswordError && <p>{rePasswordError}</p>}
                            </div>

                            <button type="submit" className="float">Sign up</button>
                            <p className="sign-up">Already have an account? <NavLink to="/login">Log in</NavLink>.</p>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default Register;

