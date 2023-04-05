import { Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation'
import Catalog from './components/Catalog/Catalog'

import './assets/App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Footer from './components/Footer/Footer';
import About from './components/About/About';
import Faq from './components/Faq/Faq';
import { AuthProvider } from './contexts/AuthContext';
import Logout from './components/Logout/Logout';
import Recycle from './components/Recycle/Recycle';
import UserProductDetails from './components/UserProductDetails/UserProductDetails';
import EditUserProduct from './components/EditUserProduct/EditUserProduct';
import CreateUserProduct from './components/CreateUserProduct/CreateUserProduct';
import { CartProvider } from './contexts/CartContext';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import PrivateGuard from './components/Common/PrivateGuard';
import StoreProducts from './components/StoreProducts/StoreProducts';
import StoreProductDetails from './components/StoreProductDetails/StoreProductDetails';


function App() {
  return (
    <AuthProvider>
    <CartProvider >
     
        <div className="App">
          <Navigation />
          <main id="main-content">
            <Routes>
              <Route path='/' element={<Catalog />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/logout' element={<Logout />} />
              <Route path='/products/page/:page' element={<StoreProducts/>}/>
              <Route path='/recycle/page/:page' element={<Recycle />} />
              <Route path='/about' element={<About />} />
              <Route path='/faq' element={<Faq />} />
              <Route path='/recycle/:id' element={<UserProductDetails />} />
              <Route path='/products/:id' element ={<StoreProductDetails/>} />
              <Route element={<PrivateGuard/>}>
                <Route path='/recycle/:id/edit' element={<EditUserProduct />} />
                <Route path='/cart' element={<ShoppingCart />} />
                <Route path='/create' element={<CreateUserProduct />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
     
    </CartProvider>
    </AuthProvider>
  );

}

export default App;

