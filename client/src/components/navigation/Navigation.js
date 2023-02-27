import './Navigation.css'
import { NavLink } from 'react-router-dom'

export default function Navigation() {
    return (
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
                <li className='nav-li'><NavLink to="/">Login</NavLink></li>
                <li className='nav-li'><NavLink to="/">Register</NavLink></li>
            </ul>
        </nav>
    )
}

