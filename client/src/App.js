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
import useLocalStorage from './hooks/useLocalStorage';
import Logout from './components/Logout/Logout';
import Recycle from './components/Recycle/Recycle';
import UserProductDetails from './components/UserProductDetails/UserProductDetails';
import EditUserProduct from './components/EditUserProduct/EditUserProduct';
import CreateUserProduct from './components/CreateUserProduct/CreateUserProduct';
import { CartProvider } from './contexts/CartContext';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';


function App() {
  return (
    <CartProvider >
    <AuthProvider>
      <div className="App">
        <Navigation />
        <main id="main-content">
          <Routes>
            <Route path='/' element={<Catalog />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/recycle' element={ <Recycle/>}/> 
            <Route path='/about' element={<About />} />
            <Route path='/faq' element={<Faq />} />
            <Route path='/create' element={<CreateUserProduct/>} />
            <Route path='/recycle/:id' element = {<UserProductDetails/>} />
            <Route path='/recycle/:id/edit' element = {<EditUserProduct/>} />
            <Route path='/cart' element = {<ShoppingCart/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
    </CartProvider>
  );
  
}

export default App;

