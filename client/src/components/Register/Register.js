import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Register.css'
import { register } from '../../services/authService';
import { AuthContext } from '../../contexts/AuthContext';
import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';


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
                let result = await register(email,password);
                userLogin(result);
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

