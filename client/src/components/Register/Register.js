import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Register.css'

const Register = () => {

   const[username,setUsername] = useState("");
   const[password,setPassword] = useState("");
   
   const onUsernameChange = (e) => {
      setUsername(e.target.value);
   }

   const onPasswordChange = (e) => {
      setPassword(e.target.value);
   }

    return (
        <section className="reg">
            <div className="containerReg">
                <div className="login">
                    <div className="heading">
                        <h2>Register</h2>
                        <form action="#">
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text"  placeholder="Username" name="username" value={username} onChange = {onUsernameChange}/>
                            </div>

                            <div className="input-group input-group-lg">                          
                                <input className="form-control" type="password" placeholder="Password" name="password" value = {password} onChange = {onPasswordChange}/>
                            </div>

                            <button type="submit" className="float">Login</button>
                            <p className= "sign-up">Don't have an account? Sign up <NavLink>here</NavLink>.</p>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default Register;

