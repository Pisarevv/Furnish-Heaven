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

    const [isInputValid, SetisInputValid] = useState({
        emailValid: false,
        passwordValid: false,
        rePasswordValid: false
    });


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
        const emailRegex = new RegExp(
            '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
        );
        const match = emailRegex.test(email.current)
        SetisInputValid({
            ...isInputValid,
            emailValid: match,
        }
        );
    }

    const validatePasswordInput = () => {
        const passwordRegex = new RegExp(
            '^(?=.*[a-zA-Z]).{8,}$'
        );
        const match = passwordRegex.test(password.current);

        SetisInputValid({
            ...isInputValid,
            passwordValid: match,
        }
        );
    }

    const validateRePasswordInput = () => {
        const match = rePassword.current === password.current ? true : false;
        SetisInputValid({
            ...isInputValid,
            rePasswordValid: match,
        }
        );
    }

    const registerHandler = async(e) => {
        e.preventDefault();
        console.log(email.current,password.current);
        
        try{
            if(isInputValid.emailValid && isInputValid.passwordValid && isInputValid.rePasswordValid){
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
                                {!isInputValid.emailValid && email.current.length > 0 && <p>Invalid email address.</p>}

                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Password" name="password" ref={password} onChange={onPasswordChange} onBlur={() => validatePasswordInput()} />
                                {!isInputValid.passwordValid && password.current.length > 0 && <p>Password must contain minimum eight characters and at least one letter.</p>}
                            </div>

                            <div className="input-group input-group-lg">
                                <input className="form-control" type="password" placeholder="Repeat Password" name="rePassword" ref={rePassword} onChange={onRePasswordChange} onBlur={() => validateRePasswordInput()} />
                                {!isInputValid.rePasswordValid && rePassword.current.length > 0 && <p>Passwords do not match.</p>}
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

