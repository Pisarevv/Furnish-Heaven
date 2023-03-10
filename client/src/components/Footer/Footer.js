import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import "./Footer.css"

const Footer = () => {
    return (

        <footer className="footer-distributed">

            <div className="footer-right">
                 {/* //TODO: Fix icons */}
                <NavLink href="#"><FontAwesomeIcon icon={faHeart} /></NavLink>
                <NavLink href="#"><FontAwesomeIcon icon={faHeart} /></NavLink>
                <NavLink href="#"><FontAwesomeIcon icon={faHeart} /></NavLink>
                <NavLink href="#"><FontAwesomeIcon icon={faHeart} /></NavLink>

            </div>

            <div className="footer-left">

                <p className="footer-links">
                    <NavLink to = "/">Home</NavLink>

                    <NavLink to = "/about">About</NavLink>

                    <NavLink to = "/about">FAQ</NavLink>

                    <NavLink to = "/about">Contact</NavLink>
                </p>

                <p>Hristo Pisarev &copy; 2023</p>
            </div>
        </footer>

    )
}


export default Footer;