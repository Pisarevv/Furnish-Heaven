import './Navigation.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { CartContext } from '../../contexts/CartContext'




const Navigation = () => {

    const { user } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    return (
        <header>
            <img className="logo" src="/images/fhlogo.png" alt="image" />
            <nav>
                <ul className="nav_links">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/">Products</NavLink></li>
                    <li><NavLink to="/">Deals</NavLink></li>
                    <li><NavLink to="/recycle">Recycle your furniture</NavLink></li>
                </ul>
            </nav>
            <ul className="nav_links">
                {
                    user.email && user.accessToken
                        ?
                        <><li><NavLink to="/logout">Logout</NavLink></li>
                            <span className="fa-layers fa-fw fa-2x" >
                                <NavLink className="fas fa-envelope fa-sm" to="/"><FontAwesomeIcon icon={faCartShopping} /></NavLink>
                                {cart.length > 0 &&  <span className="fa-layers-counter" >{cart.length}</span>}
                            </span>
                        </>
                        :
                        <><li><NavLink to="/register">Register</NavLink></li>
                            <li><NavLink to="/login">Login</NavLink></li></>
                }

            </ul>



        </header>
    )
}

export default Navigation;