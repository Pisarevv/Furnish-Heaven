import './Navigation.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping} from '@fortawesome/free-solid-svg-icons'


export default function Navigation() {
    return (

        <header>
        <nav>
            <ul>
            <li className='nav-li'><NavLink to="/">Home</NavLink></li>
                <li className ="dropLi">
                    <div className="dropdown">
                        <button className="dropbtn">Menu</button>
                        <div className="dropdown-content">
                            <ul>
                                <li><NavLink to="/">Products</NavLink></li>
                                <li><NavLink to="/">Deals</NavLink></li>
                                <li><NavLink to="/">Recycle your furniture</NavLink></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li><input type="text" placeholder="Search.."></input></li>
                <li className='nav-li'><NavLink to="/">Login</NavLink></li>
                <li className='nav-li'><NavLink to="/">Register</NavLink></li>
                <li className='nav-li'><NavLink to="/">Cart <FontAwesomeIcon icon={faCartShopping}/></NavLink></li>
            </ul>
        </nav>
        </header>
    )
}

