import './Navigation.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'




const Navigation = () => {
    const {user} = useContext(AuthContext);


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
                {
                user.email && user.accessToken
                ?
                 <><li><NavLink to="/logout">Logout</NavLink></li>
                 <NavLink className="cta" to="/">Wish list  <FontAwesomeIcon icon={faHeart} /></NavLink></>
                :
                 <><li><NavLink to="/register">Register</NavLink></li>
                 <li><NavLink to="/login">Login</NavLink></li></>
                 } 
                
            </ul>

            

        </header>
    )
}

export default Navigation;