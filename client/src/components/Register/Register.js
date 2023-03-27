import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import './Register.css'
import { register } from '../../services/authService';
import { AuthContext } from '../../contexts/AuthContext';
import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';

const Register = () => {

    const email = useRef("");
    const password = useRef("");
    const rePassword = useRef("");

    const {userLogin} = useContext(AuthContext);
    const navigate = useNavigate();

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isRePasswordValid, setIsRePasswordValid] = useState(false);


    const onEmailChange = (e) => {
        email.current = e.target.value;
    }


    const onPasswordChange = (e) => {
        password.current = e.target.value;
    }

    const onRePasswordChange = (e) => {
        rePassword.current = e.target.value;
    }

    const validateEmailInput = () => {
        //The current regex validates that the input email address 
        //begins with a string, contains a "@" symbol and "." after the domain
        // and end with a top-level-domain TLD
        const emailRegex = new RegExp(
            '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]+$'
        );
        const match = emailRegex.test(email.current);
        setIsEmailValid(match);
    }

    const validatePasswordInput = () => {
        //This regex validates that the input has minimul 8 charecters and one of them must be a letter
        const passwordRegex = new RegExp(
            '^(?=.*[a-zA-Z]).{8,}$'
        );
        const match = passwordRegex.test(password.current)
        setIsPasswordValid(match);
    }

    const validateRePasswordInput = () => {
        const match = rePassword.current === password.current ? true : false;
        setIsRePasswordValid(match)
    }
    const registerHandler = async(e) => {
        e.preventDefault();
        try{
            if(isEmailValid && isPasswordValid && isRePasswordValid){
                let result = await register(email.current,password.current);
                userLogin({email:result.email, accessToken:result.accessToken, _id:result._id});
                navigate('/');
            }
            else{
                throw("Invalid register fields")
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
                                <input className="form-control" type="text" placeholder="Email" name="email" refer={email} onChange={onEmailChange} onBlur={() => validateEmailInput()} />
                                {!isEmailValid && email.current.length > 0 && <p>Invalid email address.</p>}

                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Password" name="password" ref={password} onChange={onPasswordChange} onBlur={() => validatePasswordInput()} />
                                {!isPasswordValid && password.current.length > 0 && <p>Password must contain minimum eight characters and at least one letter.</p>}
                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Repeat Password" name="rePassword" ref={rePassword} onChange={onRePasswordChange} onBlur={() => validateRePasswordInput()} />
                                {!isRePasswordValid && rePassword.current.length > 0 && <p>Passwords do not match.</p>}
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

