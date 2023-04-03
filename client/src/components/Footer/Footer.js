/**
 * Footer Component
 * ---------------------
 * This component displays basic links to home, about and faq pages in
 * the store and copyright information.
 * 
 * ---------------------- 
**/

import { NavLink } from "react-router-dom";

import "./Footer.css"


const Footer = () => {
    return (

        <footer className="footer-distributed">

            <div className="footer-left">

                <p className="footer-links">
                    <NavLink to = "/">Home</NavLink>

                    <NavLink to = "/about">About</NavLink>

                    <NavLink to = "/faq">FAQ</NavLink>

                </p>

                <p>Hristo Pisarev &copy; 2023</p>
            </div>
        </footer>

    )
}


export default Footer;