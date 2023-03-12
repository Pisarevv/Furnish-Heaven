import { useContext, useEffect, useState } from 'react';
import { NavLink , Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { login } from '../../services/authService';
import './Login.css'


const Login = () => {

   const {userLogin} = useContext(AuthContext);
   const navigate = useNavigate();

   const[email,setEmail] = useState("");
   const[password,setPassword] = useState("");
   const[error,setError] = useState({});
   
   const onEmailChange = (e) => {
      setEmail(e.target.value);
   }

   const onPasswordChange = (e) => {
      setPassword(e.target.value);
   }

   const loginHandler = async(e) => {
    e.preventDefault();
    console.log(email,password);
    let result = await login(email,password);
    userLogin(result);
    navigate('/');
   }

    return (
        <section className="log">
            <div className="containerLog">
                <div className="login">
                    <div className="heading">
                        <h2>Sign in</h2>
                        <form onSubmit={loginHandler}>
                           <div className="input-group input-group-lg">
                                <input className="form-control" type="text"  placeholder="Email" name="email" value={email} onChange = {onEmailChange} />
                            </div>

                            <div className="input-group input-group-lg">                          
                                <input className="form-control" type="password" placeholder="Password" name="password" value = {password} onChange = {onPasswordChange}/>
                            </div>

                            <button type="submit" className="float">Login</button>
                            {/* TODO: Fix register path */}
                            <p className= "sign-up">Don't have an account? Sign up <NavLink to = "/register" >here</NavLink>.</p>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default Login;

