import { Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation'
import Catalog from './components/Catalog/Catalog'

import './assets/App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Footer from './components/Footer/Footer';
import About from './components/About/About';
import Faq from './components/Faq/Faq';
import { AuthContext } from './contexts/AuthContext';
import { useEffect, useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Logout from './components/Logout/Logout';
import Recycle from './components/Recycle/Recycle';
import UserProductDetails from './components/UserProductDetails/UserProductDetails';
import EditUserProduct from './components/EditUserProduct/EditUserProduct';
import CreateUserProduct from './components/CreateUserProduct/CreateUserProduct';
import { CartContext } from './contexts/CartContext';


function App() {

  const [auth,setAuth] = useLocalStorage('user',{});

  const [products,setProducts] = useLocalStorage('cart', {})

  const userLogin = (userData) => {
    setAuth(userData);
  }

  const userLogout = () => {
    setAuth({})
    setProducts({})
  }

  const addProductToCart = (productData) => {
    setProducts(productData);
  }

  const removeProductFromCart = (productId) => {
    setProducts(products => products.filter(x => x._productId != productId));
  }

  



  return (
    <AuthContext.Provider value = {{user: auth, userLogin, userLogout}}>
      <CartContext.Provider value = {{cart: products, addProductToCart, removeProductFromCart}}>
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
          </Routes>
        </main>
        <Footer />
      </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
  
}

export default App;

