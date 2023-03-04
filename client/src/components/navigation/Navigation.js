import './Navigation.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'




export default function Navigation() {
    return (

        <header>
            <img className="logo" src="/fhlogo.png" alt="image" />
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

// export default function Navigation() {
//     return (

//         <header>
//             <nav>
//                 <ul>
//                     <div className="topnav-left">
//                     <li className='nav-li'><NavLink to="/">Home</NavLink></li>
//                     <li className="dropLi">
//                         <div className="dropdown">
//                             <button className="dropbtn">Menu</button>
//                             <div className="dropdown-content">
//                                 <ul>
//                                     <li><NavLink to="/">Products</NavLink></li>
//                                     <li><NavLink to="/">Deals</NavLink></li>
//                                     <li><NavLink to="/">Recycle your furniture</NavLink></li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </li>
//                     <li><input type="text" placeholder="Search.."></input></li>
//                     </div>
//                     <div className="topnav-right">
//                         <li className='nav-li'><NavLink to="/">Login</NavLink></li>
//                         <li className='nav-li'><NavLink to="/">Register</NavLink></li>
//                         <li className='nav-li'><NavLink to="/">Cart <FontAwesomeIcon icon={faCartShopping} /></NavLink></li>
//                     </div>
//                 </ul>
//             </nav>
//         </header>
//     )
// }
