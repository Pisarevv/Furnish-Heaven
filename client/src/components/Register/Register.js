import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import './Register.css'
import { register } from '../../services/authService';
import { AuthContext } from '../../contexts/AuthContext';
import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';
import useFirstTouched from '../../hooks/useFirstTouched';
import useIsValid from '../../hooks/useIsValid';

const ValidationRegexes = {
    //The current regex validates that the input email address 
    //begins with a string, contains a "@" symbol and "." after the domain
    // and end with a top-level-domain TLD
    emailRegex: new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]+$'),

    //This regex validates that the input has minimul 8 charecters and one of them 
    //must be a letter
    passwordRegex: new RegExp( /^(?=.*[a-zA-Z]).{8,}$/)
}

const Register = () => {


    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [rePassword,setRepassword] = useState("");

    const {userLogin} = useContext(AuthContext);
    const navigate = useNavigate();

    const isEmailValid = useIsValid();

    const isPasswordValid = useIsValid()

    const isRePasswordValid = useIsValid()


    const onEmailChange = (e) => {
        setEmail(email => e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(password => e.target.value);
    }

    const onRePasswordChange = (e) => {
        setRepassword(rePassword => e.target.value)
    }

    const validateEmailInput = (e) => {
        e.preventDefault();    
        if(ValidationRegexes.emailRegex.test(email)){
            isEmailValid.setValidHandler();
        }
        else{
            isEmailValid.setInvalidHandler();           
        }
        console.log(email.current.length)
    }

    const validatePasswordInput = () => {

        if(ValidationRegexes.passwordRegex.test(password)){
            isPasswordValid.setValidHandler();
        }
        else{
            isPasswordValid.setInvalidHandler();
        }
    }

    const validateRePasswordInput = () => {
        if(rePassword == password){
            isRePasswordValid.setValidHandler();
        }
        else{
            isRePasswordValid.setInvalidHandler();
        }

    }

    const registerHandler = async(e) => {
        e.preventDefault();
        try{
            if(isEmailValid.isValid && isPasswordValid.isValid && isRePasswordValid.isValid){
                let result = await register(email.current,password.current);
                userLogin({email:result.email, accessToken:result.accessToken, _id:result._id});
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
                                <input className="form-control" type="text" placeholder="Email" name="email" value={email} onChange={onEmailChange} onBlur={validateEmailInput} />
                                {!isEmailValid.isValid && email.length > 0 && <p>Invalid email address.</p>}

                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Password" name="password" value={password} onChange={onPasswordChange} onBlur={validatePasswordInput} />
                                {!isPasswordValid.isValid  &&  <p>Password must contain minimum eight characters and at least one letter.</p>}
                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Repeat Password" name="rePassword" value={rePassword} onChange={onRePasswordChange} onBlur={validateRePasswordInput} />
                                {!isRePasswordValid.isValid && <p>Passwords do not match.</p>}
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

