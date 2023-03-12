import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRef } from 'react';
import './Register.css'

const Register = () => {

//    const[email,setEmail] = useState("" );
//    const[password,setPassword] = useState("");
//    const[rePassword,setRePassword] = useState("");
   const email = useRef();
   const password = useRef();
   const rePassword = useRef();


   const onEmailChange = (e) => {
    email.current += e.target.value;
   }    


   const onPasswordChange = (e) => {
    //   setPassword(e.target.value);
    password.current += e.target.value;
   }

   const onRePasswordChange = (e) => {
    // setRePassword(e.target.value);
    rePassword.current += e.target.value;
    }

    return (
        <section className="reg">
            <div className="containerReg">
                <div className="login">
                    <div className="heading">
                        <h2>Register</h2>
                        <form action="#">
                            <div className="input-group input-group-lg">
                            <input className="form-control" type="text"  placeholder="Email" name="email" refer={email} onChange = {onEmailChange} onBlur = {() => console.log("off focus")}/>
                                {/* <input className="form-control" type="text"  placeholder="Email" name="email" value={email} onChange = {onEmailChange} /> */}
                            </div>
                    
                            <div className="input-group input-group-lg">    
                            <input className="form-control" type="password" placeholder="Password" name="password" ref = {password} onChange = {onPasswordChange} onBlur = {() => console.log("off focus")}/>                      
                                {/* <input className="form-control" type="password" placeholder="Password" name="password" value = {password} onChange = {onPasswordChange} onBlur = {() => console.log("off focus")}/> */}
                            </div>

                            <div className="input-group input-group-lg">        
                            <input className="form-control" type="rePassword" placeholder="Repeat Password" name="rePassword" ref = {rePassword} onChange = {onRePasswordChange}/>                  
                                {/* <input className="form-control" type="rePassword" placeholder="Repeat Password" name="rePassword" value = {rePassword} onChange = {onRePasswordChange}/> */}
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

