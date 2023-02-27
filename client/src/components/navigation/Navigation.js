import './Navigation.css'
import { NavLink } from 'react-router-dom'

export default function Navigation () {
    return (
        <nav>
            <ul>
            <li>
                <div className="dropdown">
                <button className="dropbtn">Dropdown</button>
                <div className="dropdown-content">
                    <ul>
                    <li><NavLink to = "/">Products</NavLink></li>
                    <li><NavLink to = "/">Deals</NavLink></li>
                    <li><NavLink to = "/">Recycle your furniture</NavLink></li>
                    </ul>
                </div>
            </div>
            </li>
            </ul>
        </nav>
    )
}

