import './Navigation.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'




const Navigation = () => {
    return (

        <header>
            <img className="logo" src="/images/fhlogo.png" alt="image" />
            <nav>
                <ul className="nav_links">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/">Products</NavLink></li>
                    <li><NavLink to="/">Deals</NavLink></li>
                    <li><NavLink to="/">Recycle your furniture</NavLink></li>
                </ul>
            </nav>
            <ul className="nav_links">
                <li><NavLink to="/">Login</NavLink></li>
                <li><NavLink to="/">Register</NavLink></li>
                <NavLink className="cta" to="/">Wish list  <FontAwesomeIcon icon={faHeart} /></NavLink>
            </ul>

            

        </header>
    )
}

export default Navigation;