import { useEffect, useState } from 'react';
import { NavLink , Link} from 'react-router-dom';
import './Login.css'

const Login = () => {

   const[email,setEmail] = useState("");
   const[password,setPassword] = useState("");
   
   const onEmailChange = (e) => {
      setEmail(e.target.value);
   }

   const onPasswordChange = (e) => {
      setPassword(e.target.value);
   }

    return (
        <section className="log">
            <div className="containerLog">
                <div className="login">
                    <div className="heading">
                        <h2>Sign in</h2>
                        <form action="#">
                           <div className="input-group input-group-lg">
                                <input className="form-control" type="text"  placeholder="Email" name="email" value={email} onChange = {onEmailChange}/>
                            </div>

                            <div className="input-group input-group-lg">                          
                                <input className="form-control" type="password" placeholder="Password" name="password" value = {password} onChange = {onPasswordChange}/>
                            </div>

                            <button type="submit" className="float">Login</button>
                            {/* TODO: Fix register path */}
                            <p className= "sign-up">Don't have an account? Sign up <NavLink to = "\register" >here</NavLink>.</p>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default Login;

