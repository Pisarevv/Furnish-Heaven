import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Register.css'

const Register = () => {

   const[email,setEmail] = useState("");
   const[password,setPassword] = useState("");
   const[rePassword,setRePassword] = useState("");
   
   const onEmailChange = (e) => {
    setEmail(e.target.value);
   }


   const onPasswordChange = (e) => {
      setPassword(e.target.value);
   }

   const onRePasswordChange = (e) => {
    setRePassword(e.target.value);
 }

    return (
        <section className="reg">
            <div className="containerReg">
                <div className="login">
                    <div className="heading">
                        <h2>Register</h2>
                        <form action="#">
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text"  placeholder="Email" name="email" value={email} onChange = {onEmailChange}/>
                            </div>
                    
                            <div className="input-group input-group-lg">                          
                                <input className="form-control" type="password" placeholder="Password" name="password" value = {password} onChange = {onPasswordChange}/>
                            </div>

                            <div className="input-group input-group-lg">                          
                                <input className="form-control" type="rePassword" placeholder="Repeat Password" name="rePassword" value = {rePassword} onChange = {onRePasswordChange}/>
                            </div>

                            <button type="submit" className="float">Login</button>
                            <p className= "sign-up">Already have an account? <NavLink to = "/login">Log in</NavLink>.</p>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default Register;

