import { Routes, Route, useLocation } from 'react-router-dom';
import Catalog from '../Catalog/Catalog'
import Login from '../Login/Login';
import Register from '../Register/Register';
import About from '../About/About';
import Faq from '../Faq/Faq';
import Logout from '../Logout/Logout';
import Recycle from '../Recycle/Recycle';
import UserProductDetails from '../UserProductDetails/UserProductDetails';
import EditUserProduct from '../EditUserProduct/EditUserProduct';
import CreateUserProduct from '../CreateUserProduct/CreateUserProduct';

import {AnimatePresence} from 'framer-motion'


const AnimatedRoutes = () => {

    const location = useLocation();
    return (
        <AnimatePresence>
        <Routes location={location} key = {location.pathname}>
            <Route path='/' element={<Catalog />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/recycle' element={<Recycle />} />
            <Route path='/about' element={<About />} />
            <Route path='/faq' element={<Faq />} />
            <Route path='/create' element={<CreateUserProduct />} />
            <Route path='/recycle/:id' element={<UserProductDetails />} />
            <Route path='/recycle/:id/edit' element={<EditUserProduct />} />
        </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes;